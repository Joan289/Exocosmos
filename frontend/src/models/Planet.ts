// Import constants used for physics calculations
import { EARTH_RADIUS_KM, G } from "../constants/astro";

/**
 * Represents the structure of an atmosphere associated with a planet.
 */
export interface Atmosphere {
  pressure_atm: number; // Pressure in atmospheres
  greenhouse_factor: number; // Multiplier for temperature due to greenhouse effect
  texture_url: string; // URL to a visual representation of the atmosphere
  [key: string]: unknown; // Allows for additional unspecified properties
}

/**
 * Represents a chemical compound that may be present on a planet.
 */
export interface Compound {
  CID: number | string; // Compound ID (can be numeric or string-based)
  name: string; // Name of the compound
  formula: string; // Chemical formula (e.g., H2O)
  percentage?: number; // Optional percentage composition on the planet
  [key: string]: unknown; // Allows for additional unspecified properties
}

/**
 * Interface for planet construction properties.
 */
export interface PlanetProps {
  name?: string;
  description?: string | null;
  mass_earth?: number | string; // Mass in Earth masses
  radius_earth?: number | string; // Radius in Earth radii
  inclination_deg?: number | string; // Orbital inclination in degrees
  rotation_speed_kms?: number | string; // Rotational speed at equator in km/s
  albedo?: number | string; // Reflectivity coefficient
  star_distance_au?: number | string; // Distance from star in astronomical units
  has_rings?: boolean;
  moon_count?: number | string;
  surface_texture_url?: string;
  height_texture_url?: string;
  thumbnail_url?: string;
  planetary_system_id?: number | string;
  planet_type_id?: number | string;
  compounds?: Compound[];
  atmosphere?: Atmosphere | null;
}

/**
 * Class representing a Planet with physical characteristics and derived values.
 */
export class Planet {
  // Raw attributes from the database or model
  planet_id: number;
  name: string;
  description: string | null;
  mass_earth: number;
  radius_earth: number;
  inclination_deg: number;
  rotation_speed_kms: number;
  albedo: number;
  star_distance_au: number;
  has_rings: boolean;
  moon_count: number;
  surface_texture_url: string;
  height_texture_url: string;
  thumbnail_url: string;
  planetary_system_id: number;
  planet_type_id: number;
  compounds: Compound[];
  atmosphere: Atmosphere | null;

  /**
   * Initializes a new instance of the Planet class.
   * Converts and normalizes all numeric values for safety and consistency.
   */
  constructor({
    planet_id,
    name = "",
    description = null,
    mass_earth = 1,
    radius_earth = 1,
    inclination_deg = 0,
    rotation_speed_kms = 0,
    albedo = 0.3,
    star_distance_au = 1,
    has_rings = false,
    moon_count = 0,
    surface_texture_url = "",
    height_texture_url = null,
    thumbnail_url = "",
    planetary_system_id = 0,
    planet_type_id = 0,
    compounds = [],
    atmosphere = null,
  }: PlanetProps) {
    this.planet_id = Number(planet_id);
    this.name = name;
    this.description = description;
    this.mass_earth = Number(mass_earth);
    this.radius_earth = Number(radius_earth);
    this.inclination_deg = Number(inclination_deg);
    this.rotation_speed_kms = Number(rotation_speed_kms);
    this.albedo = Number(albedo);
    this.star_distance_au = Number(star_distance_au);
    this.has_rings = Boolean(has_rings);
    this.moon_count = Number(moon_count);
    this.surface_texture_url = surface_texture_url;
    this.height_texture_url = height_texture_url;
    this.thumbnail_url = thumbnail_url;
    this.planetary_system_id = Number(planetary_system_id);
    this.planet_type_id = Number(planet_type_id);
    this.compounds = compounds ?? [];
    this.atmosphere = atmosphere;
  }

  /**
   * Planet radius in kilometers, converted from Earth radii.
   */
  get radiusKm(): number {
    return this.radius_earth * EARTH_RADIUS_KM;
  }

  /**
   * Angular speed of the planet's rotation in radians per second.
   */
  get angularSpeed(): number {
    return this.rotation_speed_kms > 0 && this.radiusKm > 0
      ? this.rotation_speed_kms / this.radiusKm
      : 0;
  }

  /**
   * Gravitational acceleration at the planet's surface in m/s².
   */
  get gravity(): number {
    const massKg = this.mass_earth * 5.972e24; // Convert Earth masses to kg
    const radiusM = this.radiusKm * 1e3; // Convert km to m
    return (G * massKg) / (radiusM * radiusM);
  }

  /**
   * Effective gravity after subtracting centrifugal force due to rotation.
   */
  get effectiveGravity(): number {
    const g = this.gravity;
    const omega = this.angularSpeed;
    const r = this.radiusKm * 1e3;
    return g - omega ** 2 * r;
  }

  /**
   * Planetary flattening due to centrifugal force.
   */
  get flattening(): number {
    const g = this.gravity;
    const omega = this.angularSpeed;
    const r = this.radiusKm * 1e3;
    return (omega ** 2 * r) / (2 * g);
  }

  /**
   * Escape velocity in km/s from the planet's surface.
   */
  get escapeVelocity(): number {
    const massKg = this.mass_earth * 5.972e24;
    const radiusM = this.radiusKm * 1e3;
    const ve = Math.sqrt((2 * G * massKg) / radiusM);
    return ve / 1000; // Convert to km/s
  }

  /**
   * Duration of a planetary day in hours based on rotation speed.
   */
  get dayDurationHours(): number {
    const omega = this.angularSpeed;
    return omega === 0 ? Infinity : (2 * Math.PI) / omega / 3600;
  }

  /**
   * Serializes the planet to a plain object with all its properties and derived values.
   */
  toObject(): Record<string, unknown> {
    return {
      name: this.name,
      description: this.description,
      mass_earth: this.mass_earth,
      radius_earth: this.radius_earth,
      inclination_deg: this.inclination_deg,
      rotation_speed_kms: this.rotation_speed_kms,
      albedo: this.albedo,
      star_distance_au: this.star_distance_au,
      has_rings: this.has_rings,
      moon_count: this.moon_count,
      surface_texture_url: this.surface_texture_url,
      height_texture_url: this.height_texture_url,
      thumbnail_url: this.thumbnail_url,
      planetary_system_id: this.planetary_system_id,
      planet_type_id: this.planet_type_id,
      compounds: this.compounds,
      atmosphere: this.atmosphere,
      radiusKm: this.radiusKm,
      angularSpeed: this.angularSpeed,
      gravity: this.gravity,
      effectiveGravity: this.effectiveGravity,
      flattening: this.flattening,
      escapeVelocity: this.escapeVelocity,
      dayDurationHours: this.dayDurationHours,
    };
  }
}

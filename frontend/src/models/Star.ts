import { getSpectralType } from "../utils/getSpectralType";
import { SOLAR_RADIUS_KM } from "../constants/astro";

/**
 * Interface defining the properties required to construct a Star.
 */
export interface StarProps {
  star_id: number | string; // Unique identifier for the star
  name?: string; // Optional name of the star
  description?: string | null; // Optional description
  mass_solar?: number | string; // Mass in solar masses (default: 1)
  radius_solar?: number | string; // Radius in solar radii (default: 1)
  thumbnail_url?: string; // Optional URL to a thumbnail image
}

/**
 * Class representing a star, with astrophysical calculations and metadata.
 */
export class Star {
  star_id: number;
  name: string;
  description: string | null;
  mass_solar: number;
  radius_solar: number;
  thumbnail_url: string;

  /**
   * Initializes a new Star instance, normalizing values and providing defaults.
   */
  constructor({
    star_id,
    name = "",
    description = null,
    mass_solar = 1,
    radius_solar = 1,
    thumbnail_url = "",
  }: StarProps) {
    this.star_id = Number(star_id);
    this.name = name;
    this.description = description;
    this.mass_solar = Number(mass_solar);
    this.radius_solar = Number(radius_solar);
    this.thumbnail_url = thumbnail_url;
  }

  /**
   * Estimates the star's luminosity relative to the Sun (L☉),
   * using the mass-luminosity relation for main-sequence stars.
   */
  get luminosity(): number {
    return Math.pow(this.mass_solar, 3.5);
  }

  /**
   * Estimates the star's surface temperature in Kelvin,
   * based on an empirical mass-temperature relation.
   */
  get temperature(): number {
    return 5800 * Math.pow(this.mass_solar, 0.505);
  }

  /**
   * Classifies the star's spectral type (e.g. G2V) based on its temperature.
   */
  get spectralType(): string {
    return getSpectralType(this.temperature);
  }

  /**
   * Converts the star's radius to kilometers.
   */
  get radiusKm(): number {
    return this.radius_solar * SOLAR_RADIUS_KM;
  }

  /**
   * Converts the star instance into a plain object with both raw and derived values.
   */
  toObject(): Record<string, unknown> {
    return {
      star_id: this.star_id,
      name: this.name,
      description: this.description,
      mass_solar: this.mass_solar,
      radius_solar: this.radius_solar,
      thumbnail_url: this.thumbnail_url,
      luminosity: this.luminosity,
      temperature: this.temperature,
      spectralType: this.spectralType,
      radiusKm: this.radiusKm,
    };
  }
}

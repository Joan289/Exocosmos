// Import core planet, star, and system models
import { Planet, PlanetProps } from "./Planet";
import { Star, StarProps } from "./Star";
import { PlanetarySystem, PlanetarySystemProps } from "./PlanetarySystem";

// Import physical constants for orbital calculations
import { SOLAR_MASS_KG, AU_IN_KM, G } from "../constants/astro";

/**
 * Extended properties for a planet that includes its planetary system and star.
 */
export interface PlanetFullProps extends PlanetProps {
  system: PlanetarySystemProps & { star: StarProps; }; // Planetary system including its star
}

/**
 * Represents a planet with full contextual information:
 * planetary system, parent star, and derived orbital properties.
 */
export class PlanetFull extends Planet {
  star: Star; // Parent star of the planet
  system: PlanetarySystem; // Planetary system the planet belongs to

  /**
   * Constructs a fully contextualized planet.
   *
   * @param star - Star data used to compute physics
   * @param system - Planetary system including embedded star data
   * @param base - Base planet properties passed to parent constructor
   */
  constructor({ star, system, ...base }: PlanetFullProps) {
    super(base);
    this.system = new PlanetarySystem(system);
    this.star = new Star(system.star);
  }

  /**
   * Calculates the orbital period in Earth days.
   * Based on Kepler's Third Law for circular orbits: T² ∝ a³ / M.
   */
  get orbitalPeriodDays(): number | null {
    if (!this.star?.mass_solar) return null;

    const a = Number(this.star_distance_au); // Semi-major axis in AU
    const M = Number(this.star.mass_solar); // Star mass in solar masses

    if (M <= 0 || a <= 0) return null;

    const periodYears = Math.sqrt(Math.pow(a, 3) / M); // Orbital period in years
    return periodYears * 365.25; // Convert to days
  }

  /**
   * Estimates the planet's equilibrium surface temperature in Kelvin.
   * Based on albedo, distance to star, and star luminosity.
   */
  get surfaceTemperature(): number | null {
    if (!this.star?.luminosity) return null;

    const L = Number(this.star.luminosity); // Star luminosity
    const d = Number(this.star_distance_au); // Distance to star in AU
    const A = Number(this.albedo); // Albedo (reflectivity)

    if (L <= 0 || d <= 0) return null;

    // Basic black-body temperature model with albedo correction
    return (278 * Math.pow(1 - A, 0.25) * Math.pow(L, 0.25)) / Math.sqrt(d);
  }

  /**
   * Calculates the planet's orbital speed in km/s.
   * Assumes a circular orbit using the formula v = sqrt(G*M / r).
   */
  get orbitalSpeed(): number | null {
    if (!this.star?.mass_solar) return null;

    const M = Number(this.star.mass_solar) * SOLAR_MASS_KG; // Mass in kg
    const r = Number(this.star_distance_au) * AU_IN_KM * 1000; // Distance in meters

    if (M <= 0 || r <= 0) return null;

    return Math.sqrt((G * M) / r) / 1000; // Convert m/s to km/s
  }

  /**
   * Converts the instance to a plain object including derived properties.
   */
  toObject(): Record<string, unknown> {
    return {
      ...super.toObject(),
      orbitalPeriodDays: this.orbitalPeriodDays,
      surfaceTemperature: this.surfaceTemperature,
      orbitalSpeed: this.orbitalSpeed,
      star: this.star,
      system: this.system,
    };
  }
}

// Import base models and their props
import { PlanetarySystem, PlanetarySystemProps } from "./PlanetarySystem";
import { Star, StarProps } from "./Star";
import { Planet, PlanetProps } from "./Planet";
import { User } from "./User";

/**
 * Extended interface for a full planetary system.
 * Includes the user who created it, its associated star, and optional planets.
 */
export interface PlanetarySystemFullProps extends PlanetarySystemProps {
  user: User; // User who owns or created the system
  star: StarProps; // Star at the center of the system
  planets?: PlanetProps[]; // Optional list of planet data
}

/**
 * Output object format for full planetary systems,
 * including derived data like planet count and nested objects.
 */
export interface PlanetarySystemFullObject extends PlanetarySystemProps {
  user: User;
  star: ReturnType<Star["toObject"]>; // Serialized star object
  planets: ReturnType<Planet["toObject"]>[]; // Array of serialized planets
  planetCount: number; // Total number of planets
}

/**
 * Class representing a fully populated planetary system,
 * including its star, planets, and user metadata.
 */
export class PlanetarySystemFull extends PlanetarySystem {
  user: User;
  star: Star;
  planets: Planet[];

  /**
   * Constructs a fully contextualized planetary system.
   *
   * @param user - The user who created or owns the system
   * @param star - Star data for the system's central star
   * @param planets - Optional array of planet data
   * @param base - Base planetary system properties
   */
  constructor({ user, star, planets = [], ...base }: PlanetarySystemFullProps) {
    super(base);

    // Normalize and assign user
    this.user = {
      ...user,
      user_id: Number(user?.user_id),
    };

    // Create star and planet instances
    this.star = new Star(star);
    this.planets = planets.map((p) => new Planet(p));
  }

  /**
   * Returns the number of planets in the system.
   */
  get planetCount(): number {
    return this.planets.length;
  }

  /**
   * Converts the system into a serializable object with all nested data.
   */
  toObject(): PlanetarySystemFullObject {
    return {
      ...super.toObject(),
      user: this.user,
      star: this.star.toObject(),
      planets: this.planets.map((p) => p.toObject()),
      planetCount: this.planetCount,
    };
  }
}

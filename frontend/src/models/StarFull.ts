import { Star, StarProps } from "./Star";
import { PlanetarySystem, PlanetarySystemProps } from "./PlanetarySystem";
import { User } from "./User";

/**
 * Extended interface for a star that includes its associated planetary system
 * and the user who created it.
 */
interface StarFullProps extends StarProps {
  star_id: number | string; // Unique ID of the star
  system: PlanetarySystemProps & { user: User; }; // Planetary system with user info
}

/**
 * Represents a full star model including its planetary system and creator (user).
 * Inherits from the base `Star` class and adds system-level details.
 */
export class StarFull extends Star {
  star_id: number;
  system: PlanetarySystem & { user: User; };

  /**
   * Constructs a new StarFull instance.
   * It extends the base Star with its planetary system and associated user.
   *
   * @param star_id - ID of the star
   * @param system - Planetary system with embedded user information
   * @param starProps - Remaining star properties passed to the base class
   */
  constructor({ star_id, system, ...starProps }: StarFullProps) {
    super({ ...starProps, star_id });

    this.star_id = Number(star_id);

    // Initialize PlanetarySystem and explicitly cast to include 'user'
    this.system = new PlanetarySystem(system) as PlanetarySystem & { user: User; };

    // Ensure user object is well-formed and typed correctly
    this.system.user = {
      user_id: Number(system.user?.user_id),
      username: system.user?.username,
      profile_picture_url: system.user?.profile_picture_url ?? null,
    };
  }

  /**
   * Serializes the star and its planetary system (with user) into a plain object.
   */
  toObject(): Record<string, unknown> {
    return {
      ...super.toObject(),
      star_id: this.star_id,
      system: {
        ...this.system.toObject(),
        user: this.system.user,
      },
    };
  }
}

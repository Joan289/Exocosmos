/**
 * Interface defining the properties required to create a PlanetarySystem.
 */
export interface PlanetarySystemProps {
  planetary_system_id: number | string; // Unique ID of the planetary system
  name: string; // Name of the planetary system
  description?: string | null; // Optional description of the system
  distance_ly: number | string; // Distance from Earth in light-years
  thumbnail_url: string; // URL to the system's thumbnail image
  user_id: number | string; // ID of the user who created or owns the system
  star_id: number | string; // ID of the star associated with this system
  user?: User; // Optional user object with full user data
}

/**
 * Class representing a planetary system.
 * Includes both physical attributes and metadata such as user and star references.
 */
export class PlanetarySystem {
  planetary_system_id: number;
  name: string;
  description?: string | null;
  distance_ly: number;
  thumbnail_url: string;
  user_id: number;
  star_id: number;
  user?: User;

  /**
   * Creates a new PlanetarySystem instance from the given properties.
   * All numerical inputs are normalized to ensure consistent types.
   */
  constructor({
    planetary_system_id,
    name,
    description,
    distance_ly,
    thumbnail_url,
    user_id,
    star_id,
    user,
  }: PlanetarySystemProps) {
    this.planetary_system_id = Number(planetary_system_id);
    this.name = name;
    this.description = description ?? null;
    this.distance_ly = Number(distance_ly);
    this.thumbnail_url = thumbnail_url;
    this.user_id = Number(user_id);
    this.star_id = Number(star_id);
    this.user = user;
  }

  /**
   * Converts the current instance into a plain object representation.
   * Useful for serialization or API communication.
   */
  toObject(): PlanetarySystemProps {
    return {
      planetary_system_id: this.planetary_system_id,
      name: this.name,
      description: this.description,
      distance_ly: this.distance_ly,
      thumbnail_url: this.thumbnail_url,
      user_id: this.user_id,
      star_id: this.star_id,
      user: this.user,
    };
  }
}

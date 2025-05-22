import { z } from 'zod';
import { planetarySystemSchema } from './planetary-system.js';
import { starSchema } from './star.js';
import { userSchema } from './user.js';

/**
 * Schema for a full planetary system.
 * 
 * Includes:
 * - base system info (planetarySystemSchema)
 * - owner user (userSchema)
 * - associated star (starSchema)
 * - list of planets (inline schema)
 */
export const planetarySystemFullSchema = planetarySystemSchema.extend({
  user: userSchema,
  star: starSchema,
  planets: z.array(
    z.object({
      planet_id: z.number().int().positive(),
      name: z.string(),
      description: z.string().nullable(),
      mass_earth: z.number(),
      radius_earth: z.number(),
      inclination_deg: z.number(),
      rotation_speed_kms: z.number(),
      albedo: z.number(),
      star_distance_au: z.number(),
      has_rings: z.boolean(),
      moon_count: z.number().int(),
      surface_texture_url: z.string().url(),
      height_texture_url: z.string().url().nullish(),
      thumbnail_url: z.string().url(),
      planet_type_id: z.number().int().positive()
    })
  )
});

/**
 * Type inferred from the full planetary system schema.
 */
export type PlanetarySystemFull = z.infer<typeof planetarySystemFullSchema>;

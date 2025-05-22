import { z } from 'zod';
import { baseQuerySchema } from './query.js';
import { userSchema } from './user.js';
import { starSchema } from './star.js';

/**
 * Base schema for planetary system creation and updates.
 */
export const planetarySystemBaseSchema = z.object({
  name: z.string().min(1).max(20),
  description: z.string().nullable().optional(),
  distance_ly: z.number().int().positive(),
  thumbnail_url: z.string().url().max(200)
});

/**
 * Full planetary system schema including generated and foreign keys.
 */
export const planetarySystemSchema = planetarySystemBaseSchema.extend({
  planetary_system_id: z.number().int().positive(),
  user_id: z.number().int().positive(),
  star_id: z.number().int().positive()
});

/**
 * Schema for creating a planetary system (used in POST).
 * Must not include ID or foreign keys — those are handled by the backend.
 */
export const createPlanetarySystemSchema = planetarySystemBaseSchema.strict();

/**
 * Schema for full update (PUT). Same as creation.
 */
export const updatePlanetarySystemSchema = planetarySystemBaseSchema.strict();

/**
 * Schema for partial update (PATCH). All fields optional.
 */
export const patchPlanetarySystemSchema = planetarySystemBaseSchema.partial();

/**
 * Schema for validating query parameters used in filtering planetary systems.
 */
export const getPlanetarySystemQuerySchema = baseQuerySchema.extend({
  name: z.string().optional(),
  distance_ly: z.coerce.number().int().positive().optional(),
  user_id: z.coerce.number().int().positive().optional(),
  star_id: z.coerce.number().int().positive().optional(),
});

/**
 * Schema for validating path parameters (e.g. /:id).
 */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

// ---- Inferred Types ----

export type PlanetarySystem = z.infer<typeof planetarySystemSchema>;
export type PlanetarySystemInput = z.infer<typeof createPlanetarySystemSchema>;
export type PlanetarySystemUpdate = z.infer<typeof updatePlanetarySystemSchema>;
export type PlanetarySystemPatch = z.infer<typeof patchPlanetarySystemSchema>;
export type PlanetarySystemQueryParams = z.infer<typeof getPlanetarySystemQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;

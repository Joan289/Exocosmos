import { z } from 'zod';

/**
 * Base schema for creating and updating planet types.
 * 
 * Used for input validation (POST/PUT). Includes physical constraints.
 */
export const planetTypeBaseSchema = z.object({
  name: z.string().min(1).max(20),
  min_mass: z.number().int().nonnegative(),
  max_mass: z.number().int().nonnegative(),
  min_radius: z.number().int().nonnegative(),
  max_radius: z.number().int().nonnegative(),
  has_rings: z.boolean(),
  has_surface: z.boolean(),
  max_moons: z.number().int().nonnegative()
});

/**
 * Schema for a planet type returned by the API.
 * Extends the base schema with the database ID.
 */
export const planetTypeSchema = planetTypeBaseSchema.extend({
  planet_type_id: z.number().int().positive()
});

/**
 * Schema for validating `:id` route parameter.
 */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

// ---- Types inferred from schemas ----

export type PlanetType = z.infer<typeof planetTypeSchema>;
export type PlanetTypeInput = z.infer<typeof planetTypeBaseSchema>;
export type IdParam = z.infer<typeof idParamSchema>;

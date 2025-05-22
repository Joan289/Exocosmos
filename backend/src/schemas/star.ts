import { z } from 'zod';
import { decimal } from '../utils/validators.js';
import { baseQuerySchema } from './query.js';
import { planetarySystemSchema } from './planetary-system.js';
import { userSchema } from './user.js';

/**
 * Base schema for creating or updating stars.
 * Does not include the ID.
 */
export const starBaseSchema = z.object({
  name: z.string().min(1).max(20),
  description: z.string().nullable().optional(),
  mass_solar: decimal().min(0.08).max(5), // realistic star mass range
  radius_solar: decimal().min(0.1).max(100),
  thumbnail_url: z.string().url().max(200)
});

/**
 * Schema for PUT operations — requires all fields and disallows extras.
 */
export const updateStarSchema = starBaseSchema.strict();

/**
 * Schema for PATCH operations — all fields optional.
 */
export const patchStarSchema = starBaseSchema.partial();

/**
 * Full star schema — includes the generated star ID.
 */
export const starSchema = starBaseSchema.extend({
  star_id: z.number().int().positive()
});

/**
 * Query parameters for listing/filtering stars.
 */
export const getStarQuerySchema = baseQuerySchema.extend({
  name: z.string().optional(),
  mass_solar: decimal().optional(),
  radius_solar: decimal().optional()
});

/**
 * Path parameter schema for validating `:id`.
 */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

// ---- Types inferred from schemas ----

export type Star = z.infer<typeof starSchema>;
export type StarInput = z.infer<typeof starBaseSchema>;
export type StarPartialInput = z.infer<typeof patchStarSchema>;
export type StarQueryParams = z.infer<typeof getStarQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;

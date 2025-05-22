import { z } from 'zod';
import { decimal } from '../utils/validators.js';
import { baseQuerySchema } from './query.js';
import { planetarySystemSchema } from './planetary-system.js';
import { userSchema } from './user.js';
import { starSchema } from './star.js';

// ----- Subschemas -----

/**
 * Schema for a compound associated with a planet or atmosphere.
 */
const compoundRelationSchema = z.object({
  CID: z.number().int().positive(),
  percentage: decimal()
});

/**
 * Optional list of compounds with total percentage capped at 100.
 */
const compoundArraySchema = z
  .array(compoundRelationSchema)
  .optional()
  .refine(
    (arr) => {
      if (!arr) return true;
      const total = arr.reduce((sum, c) => sum + Number(c.percentage), 0);
      return total <= 100;
    },
    { message: 'Total percentage of compounds must not exceed 100' }
  );

/**
 * Schema for atmosphere-specific compounds.
 * Structurally same as planet compounds.
 */
const atmosphereCompoundSchema = compoundRelationSchema;

/**
 * Schema for a planet's atmosphere, including compound percentages.
 */
const atmosphereSchema = z
  .object({
    pressure_atm: decimal(),
    greenhouse_factor: decimal(),
    texture_url: z.string().url().max(200),
    compounds: z.array(atmosphereCompoundSchema).optional()
  })
  .refine(
    (atm) => {
      if (!atm?.compounds) return true;
      const total = atm.compounds.reduce((sum, c) => sum + Number(c.percentage), 0);
      return total <= 100;
    },
    { message: 'Total percentage of atmosphere compounds must not exceed 100' }
  );

// ----- Base planet schema -----

/**
 * Base schema for creating or updating planets.
 */
export const planetBaseSchema = z.object({
  name: z.string().min(1).max(20),
  description: z.string().nullable().optional(),
  mass_earth: decimal(),
  radius_earth: decimal(),
  inclination_deg: decimal().max(180),
  rotation_speed_kms: decimal().max(10),
  albedo: decimal().min(0).max(1),
  star_distance_au: decimal(),
  has_rings: z.boolean(),
  moon_count: z.number().int().nonnegative(),
  surface_texture_url: z.string().url().max(200),
  height_texture_url: z.string().url().nullish(),
  thumbnail_url: z.string().url().max(200),
  planetary_system_id: z.number().int().positive(),
  planet_type_id: z.number().int().positive(),
  compounds: compoundArraySchema,
  atmosphere: atmosphereSchema.optional()
});

// ----- Use cases -----

/**
 * Schema for planet creation (strict).
 */
export const createPlanetSchema = planetBaseSchema.strict();

/**
 * Schema for full updates (PUT).
 */
export const updatePlanetSchema = planetBaseSchema.strict();

/**
 * Schema for partial updates (PATCH).
 */
export const patchPlanetSchema = planetBaseSchema.partial().extend({
  atmosphere: z
    .object({
      pressure_atm: decimal(),
      greenhouse_factor: decimal(),
      texture_url: z.string().url().max(200),
      compounds: z.array(atmosphereCompoundSchema).optional()
    })
    .partial()
    .nullable()
    .optional()
});

// ----- Returned object (includes ID) -----

/**
 * Planet schema returned by the API, includes planet_id.
 */
export const planetSchema = planetBaseSchema.extend({
  planet_id: z.number().int().positive()
});

// ----- Query params (filters, sort, etc.) -----

/**
 * Query schema for filtering, sorting and paginating planets.
 */
export const getPlanetQuerySchema = baseQuerySchema.extend({
  name: z.string().optional(),
  description: z.string().optional(),
  mass_earth: decimal().optional(),
  radius_earth: decimal().optional(),
  inclination_deg: decimal().optional(),
  rotation_speed_kms: decimal().optional(),
  albedo: decimal().optional(),
  star_distance_au: decimal().optional(),
  has_rings: z.coerce.boolean().optional(),
  moon_count: z.coerce.number().int().nonnegative().optional(),
  planetary_system_id: z.coerce.number().int().positive().optional(),
  planet_type_id: z.coerce.number().int().positive().optional()
});

/**
 * Extended schema with nested planetary system, user, and star.
 */
export const planetFullSchema = planetSchema.extend({
  system: planetarySystemSchema.extend({
    user: userSchema,
    star: starSchema
  })
});

// ----- ID param -----

/**
 * Schema for validating `:id` route parameter.
 */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

// ----- Types -----

export type Planet = z.infer<typeof planetSchema>;
export type PlanetInput = z.infer<typeof planetBaseSchema>;
export type PlanetFull = z.infer<typeof planetFullSchema>;
export type PlanetPartialInput = z.infer<typeof patchPlanetSchema>;
export type PlanetQueryParams = z.infer<typeof getPlanetQuerySchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type AtmosphereInput = z.infer<typeof atmosphereSchema>;
export type AtmospherePatchInput = z.infer<typeof patchPlanetSchema.shape.atmosphere>;

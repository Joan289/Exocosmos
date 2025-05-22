import { z } from "zod";

/**
 * Returns a Zod schema for validating a planet creation or edit form.
 * Validation rules are dynamically based on the provided planet type.
 *
 * @param {Object} planetType - Object containing constraints specific to the planet type.
 * @param {number} planetType.min_mass - Minimum allowed mass (Earth masses).
 * @param {number} planetType.max_mass - Maximum allowed mass (Earth masses).
 * @param {number} planetType.min_radius - Minimum allowed radius (Earth radii).
 * @param {number} planetType.max_radius - Maximum allowed radius (Earth radii).
 * @param {boolean} planetType.has_rings - Whether this type supports rings.
 * @param {number} planetType.max_moons - Maximum allowed number of moons.
 * @param {number} planetType.planet_type_id - Fixed ID for planet type.
 *
 * @returns {z.ZodSchema} Zod object schema with field-level validation rules.
 */
export function getPlanetFormSchema(planetType) {
  return z.object({
    name: z
      .string()
      .min(1, "El nom és obligatori")
      .max(20, "Màxim 20 caràcters"),

    description: z.string().optional(),

    mass_earth: z
      .number()
      .min(planetType.min_mass, `Mínim: ${planetType.min_mass} M⊕`)
      .max(planetType.max_mass, `Màxim: ${planetType.max_mass} M⊕`),

    radius_earth: z
      .number()
      .min(planetType.min_radius, `Mínim: ${planetType.min_radius} R⊕`)
      .max(planetType.max_radius, `Màxim: ${planetType.max_radius} R⊕`),

    inclination_deg: z.number().min(0).max(180),
    rotation_speed_kms: z.number().min(0).max(10),
    albedo: z.number().min(0).max(1),
    star_distance_au: z.number().min(0),
    has_rings: z.boolean().refine((val) => planetType.has_rings || !val, {
      message: "Aquest tipus de planeta no pot tenir anells",
    }),
    moon_count: z
      .number()
      .int()
      .nonnegative()
      .max(planetType.max_moons, `Màxim: ${planetType.max_moons} llunes`),

    planet_type_id: z.literal(planetType.planet_type_id),

    compounds: z
      .array(
        z.object({
          CID: z.number().int().positive(),
          percentage: z.number().min(0).max(100),
        })
      )
      .optional(),

    atmosphere: z
      .object({
        pressure_atm: z.number().min(0),
        greenhouse_factor: z.number().min(0),
        compounds: z
          .array(
            z.object({
              CID: z.number().int().positive(),
              percentage: z.number().min(0).max(100),
            })
          )
          .optional(),
      })
      .optional(),
  });
}

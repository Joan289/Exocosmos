import { z } from "zod";

/**
 * Zod schema for validating star form data.
 *
 * Fields:
 * - name: required string, 1–20 characters
 * - description: optional string
 * - mass_solar: required number, between 0.08 and 5 solar masses (M☉)
 * - radius_solar: required number, between 0.1 and 100 solar radii (R☉)
 */
export const starFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nom és obligatori")
    .max(20, "El nom no pot superar els 20 caràcters"),

  description: z.string().optional(),

  mass_solar: z
    .number()
    .min(0.08, { message: "Mínim: 0.08 M☉" })
    .max(5, { message: "Màxim: 5 M☉" }),

  radius_solar: z
    .number()
    .min(0.1, { message: "Mínim: 0.1 R☉" })
    .max(100, { message: "Màxim: 100 R☉" }),
});

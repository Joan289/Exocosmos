import { z } from "zod";

/**
 * Zod schema for validating the creation of a planetary system.
 *
 * Fields:
 * - name: required string, 1–20 characters
 * - description: optional string
 * - distance_ly: required positive integer representing distance in light-years
 */
export const createSystemFormSchema = z.object({
  name: z
    .string()
    .min(1, "El nom és obligatori")
    .max(20, "El nom no pot superar els 20 caràcters"),
  description: z.string().optional(),
  distance_ly: z
    .number({ invalid_type_error: "La distància ha de ser un número" })
    .int("Ha de ser un número enter")
    .positive("Ha de ser positiva"),
});

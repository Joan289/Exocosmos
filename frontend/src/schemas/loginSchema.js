import { z } from "zod";

/**
 * Zod schema for validating login credentials.
 *
 * Fields:
 * - email: required, must be a valid email address, max 100 characters
 * - password: required, must be between 6 and 100 characters
 */
export const loginSchema = z.object({
  email: z.string().email("Correu electrònic invàlid").max(100),
  password: z
    .string()
    .min(6, "La contrasenya ha de tenir com a mínim 6 caràcters")
    .max(100),
});

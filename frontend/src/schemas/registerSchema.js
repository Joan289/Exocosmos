import { z } from "zod";

/**
 * Zod schema for validating user registration data.
 *
 * Fields:
 * - username: required string, between 3 and 50 characters
 * - email: required, must be a valid email address, max 100 characters
 * - password: required, 8–100 characters, must include uppercase, lowercase, numbers, and symbols
 * - profile_picture_url: optional or null, must be a valid URL if provided, max 200 characters
 */
export const registerSchema = z.object({
  username: z.string().min(3, "Mínim 3 caràcters").max(50),
  email: z.string().email("Correu electrònic invàlid").max(100),
  password: z
    .string()
    .min(8, "Mínim 8 caràcters")
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Ha d'incloure majúscules, minúscules, números i símbols"
    ),
  profile_picture_url: z
    .string()
    .url("URL no vàlida")
    .max(200)
    .optional()
    .nullable(),
});

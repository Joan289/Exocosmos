import { z } from "zod";

/**
 * Zod schema for validating partial user updates (PATCH).
 * All fields are optional, allowing partial updates.
 *
 * Fields:
 * - username: optional string, 3–50 characters
 * - email: optional, must be a valid email address, max 100 characters
 * - password: optional string (empty string is ignored);
 *   if provided, must be 8–100 characters and include uppercase, lowercase, number, and symbol
 */
export const patchUserSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().max(100).optional(),
  password: z
    .string()
    .transform((val) => (val === "" ? undefined : val)) // allow empty string
    .optional()
    .refine(
      (val) =>
        !val ||
        (val.length >= 8 &&
          val.length <= 100 &&
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/.test(val)),
      {
        message:
          "La contrasenya ha de tenir entre 8 i 100 caràcters, amb majúscules, minúscules, número i símbol",
      }
    ),
});

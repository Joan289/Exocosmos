import { z } from "zod";

/**
 * Parses a string that may contain commas and converts it to a float.
 * Throws a validation error if the result is not a valid number.
 */
export const parseCommaDecimal = z
  .string()
  .transform((val) => parseFloat(val.replace(",", ".")))
  .refine((val) => !isNaN(val), {
    message: "El valor ha de ser un número",
  });

import { z } from 'zod';

/**
 * Common decimal validator.
 * 
 * - Coerces input to number
 * - Ensures non-negative value
 * - Applies a max limit to prevent overly large numbers
 * 
 * Used for fields like mass, radius, inclination, etc.
 */
export const decimal = () =>
  z.coerce
    .number()
    .nonnegative()
    .max(99999999.99);

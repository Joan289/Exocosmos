import { z } from 'zod';
import { starSchema } from './star.js';
import { planetarySystemSchema } from './planetary-system.js';
import { userSchema } from './user.js';

/**
 * Schema for a full star object.
 * 
 * Includes:
 * - star data (starSchema)
 * - its associated planetary system (planetarySystemSchema)
 * - the user who owns that system (userSchema)
 */
export const starFullSchema = starSchema.extend({
  system: planetarySystemSchema.extend({
    user: userSchema
  })
});

/**
 * Type for full star object including system and user.
 */
export type StarFull = z.infer<typeof starFullSchema>;

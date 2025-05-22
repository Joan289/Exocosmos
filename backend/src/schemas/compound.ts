import { z } from 'zod';
import { baseQuerySchema } from './query.js';

/**
 * Full schema definition for a compound.
 * Used for data returned by the API and internal type validation.
 */
export const compoundSchema = z.object({
  CID: z.number().int().positive(),
  name: z.string().min(1).max(100),
  formula: z.string().min(1).max(50)
});

/**
 * Schema for creating a compound.
 * Only the CID is required, data will be fetched from PubChem.
 */
export const createCompoundSchema = z.object({
  CID: z.number().int().positive()
});

/**
 * Schema for validating compound ID from URL parameters.
 */
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

/**
 * Schema for query parameters when filtering compound lists.
 */
export const getCompoundQuerySchema = baseQuerySchema.extend({
  name: z.string().optional(),
  formula: z.string().optional()
});

// ---- Types ----

export type Compound = z.infer<typeof compoundSchema>;
export type CreateCompoundInput = z.infer<typeof createCompoundSchema>;
export type IdParam = z.infer<typeof idParamSchema>;
export type CompoundQueryParams = z.infer<typeof getCompoundQuerySchema>;

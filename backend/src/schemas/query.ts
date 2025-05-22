import { z } from 'zod';

/**
 * Base schema for validating common query parameters:
 * - page: pagination (positive integer)
 * - limit: number of results per page (positive integer)
 * - sort: field to sort by (can include "-" prefix for DESC)
 * - search: text to search across predefined fields
 */
export const baseQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sort: z.string().optional(),
  search: z.string().optional()
});

/**
 * Type inferred from baseQuerySchema, used for route query typing.
 */
export type BaseQueryParams = z.infer<typeof baseQuerySchema>;

import type { BaseQueryParams } from '../schemas/query.js';

/**
 * Options passed to query-building utilities and models.
 * 
 * Extends base query parameters (pagination, sort, etc.) and adds custom filters.
 */
export interface QueryOptions extends BaseQueryParams {
  filters?: Record<string, unknown>;
}

/**
 * Configuration for building dynamic SQL queries.
 * 
 * Defines which fields can be searched, filtered, or sorted.
 */
export interface QueryConfig {
  searchable: string[];   // Fields allowed in search queries
  filterable: string[];   // Fields that can be filtered
  sortable: string[];     // Fields allowed in sort parameters
  defaultSort: string;    // Default sorting field if none provided
}

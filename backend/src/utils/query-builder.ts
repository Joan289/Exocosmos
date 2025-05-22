import { QueryOptions, QueryConfig } from '../interfaces/query.js';

/**
 * Builds a SQL WHERE clause for full-text search using LIKE.
 * Applies search to all specified columns.
 */
export function buildSearchClause(search: string | undefined, columns: string[]): { sql: string; values: any[]; } {
  if (!search || !columns.length) return { sql: '', values: [] };

  const conditions = columns.map(col => `${col} LIKE ?`).join(' OR ');
  const values = columns.map(() => `%${search}%`);

  return { sql: `(${conditions})`, values };
}

/**
 * Builds a SQL WHERE clause for filters with exact matches.
 * Only includes keys that are in the allowed list.
 */
export function buildFilterClause(filters: Record<string, any>, allowed: string[]): { sql: string; values: any[]; } {
  const conditions: string[] = [];
  const values: any[] = [];

  for (const key of allowed) {
    const value = filters[key];
    if (value !== undefined) {
      conditions.push(`${key} = ?`);
      values.push(value);
    }
  }

  const sql = conditions.length ? conditions.join(' AND ') : '';
  return { sql, values };
}

/**
 * Builds an ORDER BY clause based on `sort` string and allowed fields.
 * Supports formats: `field`, `-field`, `field:desc`, `field:asc`.
 */
export function buildSortClause(sort: string | undefined, allowed: string[], fallback: string): string {
  if (!sort) return fallback;

  let column = sort;
  let direction = 'ASC';

  if (sort.startsWith('-')) {
    column = sort.slice(1);
    direction = 'DESC';
  } else if (sort.includes(':')) {
    const [col, dir] = sort.split(':');
    column = col;
    direction = dir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  }

  return allowed.includes(column) ? `${column} ${direction}` : fallback;
}

/**
 * Builds LIMIT and OFFSET clause for pagination.
 */
export function buildPaginationClause(page?: number, limit?: number): { sql: string; values: any[]; } {
  if (!page || !limit) return { sql: '', values: [] };

  const safePage = Math.max(1, +page);
  const safeLimit = Math.max(1, +limit);
  const offset = (safePage - 1) * safeLimit;

  return {
    sql: 'LIMIT ? OFFSET ?',
    values: [safeLimit, offset]
  };
}

/**
 * Builds full WHERE + ORDER BY + LIMIT SQL clauses from query options.
 * Returns concatenated SQL fragments and a list of all query values.
 */
export function buildQueryClauses(
  { search, filters = {}, page, limit, sort }: QueryOptions,
  config: QueryConfig
): {
  whereSQL: string;
  sortSQL: string;
  pageSQL: string;
  values: any[];
} {
  const { sql: searchSQL, values: searchValues } = buildSearchClause(search, config.searchable);
  const { sql: filterSQL, values: filterValues } = buildFilterClause(filters, config.filterable);

  let whereSQL = '';
  const conditions = [searchSQL, filterSQL].filter(Boolean);
  if (conditions.length) {
    whereSQL = `WHERE ${conditions.join(' AND ')}`;
  }

  const sortSQL = `ORDER BY ${buildSortClause(sort, config.sortable, config.defaultSort)}`;
  const { sql: pageSQL, values: pageValues } = buildPaginationClause(page, limit);

  const finalValues = [...searchValues, ...filterValues, ...pageValues];

  return {
    whereSQL,
    sortSQL,
    pageSQL,
    values: finalValues
  };
}

/**
 * Builds a SET clause for SQL UPDATE statements from an object.
 * Converts `{ key: value }` into `key = ?` pairs and value list.
 */
export function buildSetClause(obj: Record<string, any>): { sql: string; values: any[]; } {
  const keys = Object.keys(obj);
  const sql = keys.map(key => `${key} = ?`).join(', ');
  const values = keys.map(key => obj[key]);
  return { sql, values };
}

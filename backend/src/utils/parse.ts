import { AppError } from "../middlewares/error.js";
import { Request } from "express";

/**
 * Parses and validates `:id` route parameter as a positive integer.
 * Throws a 400 error if invalid.
 */
export const parseID = (req: Request): number => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    throw new AppError(400, 'The provided ID is not valid.');
  }
  return id;
};

/**
 * Applies custom parsers to filter values.
 * Only includes keys defined in `parsers`.
 * 
 * Throws 400 if any value is invalid or unparseable.
 */
export const parseFilters = (
  filters: Record<string, unknown>,
  parsers: Record<string, (value: unknown) => any>
): Record<string, any> => {
  const parsed: Record<string, any> = {};

  for (const key of Object.keys(parsers)) {
    const raw = filters[key];
    if (raw !== undefined) {
      try {
        const value = parsers[key](raw);

        if (typeof value === 'number' && isNaN(value)) {
          throw new AppError(400, `Invalid value for filter '${key}'. Must be a number.`);
        }

        parsed[key] = value;
      } catch {
        throw new AppError(400, `Invalid value for filter '${key}'.`);
      }
    }
  }

  return parsed;
};

/**
 * Filters a list of fields to include only those that are allowed.
 */
export function filterAllowedFields(fields: string[], allowed: Set<string>): string[] {
  return fields.filter((f) => allowed.has(f));
}

/**
 * Formats a list of fields into a SQL-safe comma-separated string.
 * Wraps each field in backticks to prevent SQL injection.
 */
export function formatSQLColumns(fields?: string[]): string {
  return (fields ?? []).map(f => `\`${f}\``).join(', ');
}

/**
 * Parses a comma-separated field list string into an array.
 * Returns undefined if not a string.
 */
export function parseFieldList(fields: unknown): string[] | undefined {
  return typeof fields === 'string' ? fields.split(',') : undefined;
}

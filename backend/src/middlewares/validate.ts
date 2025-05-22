import { ZodSchema } from 'zod';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../middlewares/error.js';

/**
 * Middleware to validate request data using a Zod schema.
 * 
 * Supports validation of body, query, or params. Replaces the request data
 * with the parsed (and possibly coerced) result.
 * 
 * @param schema - Zod schema to validate against
 * @param source - Which part of the request to validate ('body' | 'query' | 'params')
 */
export const validate = (
  schema: ZodSchema,
  source: 'body' | 'query' | 'params' = 'body'
): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and parse data using Zod
      const result = schema.parse(req[source]);

      // Overwrite request data with parsed values
      req[source] = result;
      next();
    } catch (err: any) {
      next(new AppError(400, 'Validation failed', err.errors));
    }
  };

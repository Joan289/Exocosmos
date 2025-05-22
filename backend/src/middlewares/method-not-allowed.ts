import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to return 405 Method Not Allowed for disallowed HTTP methods.
 */
export function methodNotAllowed(_req: Request, res: Response, _next: NextFunction) {
  res.status(405).json({
    status: 'error',
    message: 'Method Not Allowed'
  });
}

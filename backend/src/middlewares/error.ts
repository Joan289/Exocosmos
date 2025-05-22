import { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from 'express';

const env = process.env.NODE_ENV;

const isDev = env === 'development';
const isTest = env === 'test';
const isProd = process.env.NODE_ENV === 'production';

/**
 * Custom application error class.
 * 
 * Allows attaching a status code and optional details to an error.
 */
export class AppError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Express global error-handling middleware.
 * 
 * Handles known AppError instances, MySQL duplicate entry errors,
 * and unexpected errors, formatting responses based on environment.
 */
export const errorHandler = ((
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Print full error in development
  if (isDev) console.error(err);

  // Handle custom application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.details && { details: err.details })
    });
    return;
  }

  // Handle MySQL duplicate entry errors (e.g. unique constraint)
  if (typeof err === 'object' && err !== null && 'code' in err && (err as any).code === 'ER_DUP_ENTRY') {
    const message = (err as any).message;
    const match = message.match(/Duplicate entry '(.+)' for key '(.+)\.(.+)'/);
    const field = match?.[3] || 'unknown';

    return res.status(400).json({
      status: 'fail',
      message: `The value of field '${field}' is already in use.`
    });
  }

  // Fallback for unknown errors
  res.status(500).json({
    status: 'error',
    message: isProd ? 'Internal server error' : (err as Error).message,
    ...(isDev && (err instanceof Error) && { stack: err.stack }),
  });
}) as ErrorRequestHandler;

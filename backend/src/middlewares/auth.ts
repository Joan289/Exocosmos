import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from '../interfaces/express.js';
import { verifyToken } from '../utils/auth.js';
import { AppError } from './error.js';

/**
 * Middleware to verify JWT authentication token from cookies.
 * 
 * If valid, attaches user payload to the request object.
 * Otherwise, forwards an authentication error.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.token;

  // Reject if no token is present
  if (!token) return next(new AppError(401, 'No token provided'));

  try {
    // Verify the JWT token and attach user to request
    const user = verifyToken(token);
    (req as AuthenticatedRequest).user = user;
    next();
  } catch {
    // Token is invalid or expired
    next(new AppError(401, 'Invalid or expired token'));
  }
}

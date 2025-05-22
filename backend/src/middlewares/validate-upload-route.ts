import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.js';

// Defines which upload types are valid for each entity
const validCombinations: Record<string, string[]> = {
  planets: ['thumbnail', 'surface', 'height', 'atmosphere'],
  stars: ['thumbnail'],
  planetary_systems: ['thumbnail'],
  users: ['profile_picture']
};

/**
 * Middleware to validate the combination of entity and upload type in the route.
 * 
 * Ensures that users can only upload allowed file types for the specified entity.
 */
export function validateUploadRoute(req: Request, res: Response, next: NextFunction): void {
  const { entity, type } = req.params;

  const allowedTypes = validCombinations[entity];

  // If entity is invalid or type not permitted for it, throw error
  if (!allowedTypes || !allowedTypes.includes(type)) {
    throw new AppError(400, `Upload type '${type}' is not allowed for entity '${entity}'`);
  }

  next();
}

import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.js';
import { Star } from '../schemas/star.js';
import { StarModel } from '../models/star.js';
import { AppError } from '../middlewares/error.js';
import { parseID } from '../utils/parse.js';
import { StarModelType } from '../interfaces/star-model.js';

/**
 * Controller for Star resources.
 * 
 * Inherits standard CRUD methods from BaseController and adds a custom
 * endpoint to fetch detailed star information with related planetary systems and user.
 */
export class StarController extends BaseController<Star, StarModelType> {
  constructor() {
    super(StarModel as StarModelType);
  }

  /**
   * Retrieve a full star view including its planetary system and the user who owns it.
   * 
   * @route GET /stars/:id/full
   */
  getFull = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse star ID from request parameters
      const id = parseID(req);

      // Fetch the full star data with joins (e.g., planetary systems, user)
      const full = await this.model.getFull(id);

      // Handle not found case
      if (!full) {
        return next(new AppError(404, `Star with ID ${id} not found.`));
      }

      // Send full data as response
      res.status(200).json({
        status: 'success',
        data: full
      });
    } catch (err) {
      next(err);
    }
  };
}

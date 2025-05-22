import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.js';
import { PlanetarySystem } from '../schemas/planetary-system.js';
import { PlanetarySystemModel } from '../models/planetary-system.js';
import { AppError } from '../middlewares/error.js';
import { parseID } from '../utils/parse.js';
import { AuthenticatedRequest } from '../interfaces/express.js';
import { PlanetarySystemModelType } from '../interfaces/planetary-system-model.js';

/**
 * Controller for Planetary System resources.
 * 
 * Extends the BaseController with shared CRUD operations and
 * includes additional logic for ownership and nested data retrieval.
 */
export class PlanetarySystemController extends BaseController<PlanetarySystem, PlanetarySystemModelType> {
  constructor() {
    // Inject the PlanetarySystemModel to the base logic
    super(PlanetarySystemModel);
  }

  /**
   * Retrieve a detailed planetary system view by ID,
   * including its star and associated planets.
   *
   * @route GET /planetary-systems/:id/full
   */
  getFull = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract the planetary system ID from the request
      const id = parseID(req);

      // Extract user ID from authenticated request
      const userId = (req as AuthenticatedRequest).user.user_id;

      // Optionally check user ownership (can be extended)
      const system = await this.model.getById(id, ['user_id']);
      if (!system) {
        return next(new AppError(404, `Planetary system with ID ${id} not found.`));
      }

      // Fetch the full representation (with star and planets)
      const result = await this.model.getFull(id);

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Create a new planetary system and associate it with the authenticated user.
   *
   * @route POST /planetary-systems
   */
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Extract user ID from authenticated request
      const userId = (req as AuthenticatedRequest).user.user_id;

      // Validate presence and type of user ID
      if (!userId || typeof userId !== 'number') {
        return next(new AppError(401, 'Authentication required or invalid user data.'));
      }

      // Create the system with user ownership
      const created = await this.model.create(req.body, userId);

      res.status(201).json({
        status: 'success',
        message: 'Item created successfully',
        data: created
      });
    } catch (err) {
      next(err);
    }
  };
}

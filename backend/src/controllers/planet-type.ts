import { Request, Response, NextFunction } from 'express';
import { PlanetType } from '../schemas/planet-type.js';
import { PlanetTypeModel } from '../models/planet-type.js';
import { AppError } from '../middlewares/error.js';
import { parseID } from '../utils/parse.js';

/**
 * Controller for handling HTTP requests related to planet types.
 * 
 * This controller provides read-only access (GET methods only).
 */
export class PlanetTypeController {
  constructor(private model = PlanetTypeModel) { }

  /**
   * Retrieve all planet types.
   *
   * @route GET /planet-types
   */
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch all planet type records from the database
      const planetTypes = await this.model.getAll();

      // Send the data in a success response
      res.status(200).json({ status: 'success', data: planetTypes });
    } catch (err) {
      next(err);
    }
  };

  /**
   * Retrieve a specific planet type by its ID.
   *
   * @route GET /planet-types/:id
   */
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the numeric ID from the request parameters
      const id = parseID(req);

      // Fetch planet type by ID
      const planetType = await this.model.getById(id);

      // Handle not found case
      if (!planetType) {
        return next(new AppError(404, `Planet type with ID ${id} not found.`));
      }

      // Return the planet type in the response
      res.status(200).json({ status: 'success', data: planetType });
    } catch (err) {
      next(err);
    }
  };
}

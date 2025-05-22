import { Request, Response, NextFunction } from 'express';
import { parseID } from '../utils/parse.js';
import { AppError } from '../middlewares/error.js';
import { BaseController } from './base.js';
import { Planet } from '../schemas/planet.js';
import { PlanetModel } from '../models/planet.js';
import { PlanetModelType } from '../interfaces/planet-model.js';

/**
 * Controller for handling HTTP requests related to planets.
 * 
 * Inherits all standard CRUD operations from BaseController,
 * and adds custom logic specific to the Planet entity.
 */
export class PlanetController extends BaseController<Planet, PlanetModelType> {
  constructor() {
    // Pass the PlanetModel instance to the BaseController
    super(PlanetModel as PlanetModelType);
  }

  /**
   * Retrieve a full detailed view of a planet, including its
   * associated planetary system, the user who created it, and its star.
   * 
   * This is a custom endpoint beyond basic CRUD.
   *
   * @route GET /planets/:id/full
   */
  getFull = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse numeric ID from the route parameter
      const id = parseID(req);

      // Fetch planet with full relational data
      const planet = await this.model.getFull(id);

      // Handle not found case
      if (!planet) {
        return next(new AppError(404, `Planet with ID ${id} not found.`));
      }

      // Respond with the enriched planet data
      res.status(200).json({
        status: 'success',
        data: planet
      });
    } catch (err) {
      next(err);
    }
  };
}

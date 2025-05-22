import { Request, Response, NextFunction } from 'express';
import { BaseController } from './base.js';
import { User } from '../schemas/user.js';
import { UserModel } from '../models/user.js';
import { BaseModel } from '../interfaces/base-model.js';
import { AppError } from '../middlewares/error.js';
import { UserModelType } from '../interfaces/user-model.js';
import { parseID } from '../utils/parse.js';

/**
 * Controller for User resources.
 * 
 * Inherits basic CRUD operations from BaseController
 * and includes an additional method to fetch full user data,
 * including related planetary systems.
 */
export class UserController extends BaseController<User, UserModelType> {
  constructor() {
    // Cast UserModel to match the UserModelType interface
    super(UserModel as unknown as UserModelType);
  }

  /**
   * Retrieve user details including full planetary system data.
   * 
   * @route GET /users/:id/full
   */
  getFull = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Parse numeric user ID from request
      const id = parseID(req);

      // Retrieve user with associated planetary systems
      const user = await this.model.getFull(id);

      // Handle case when user is not found
      if (!user) {
        return next(new AppError(404, `User with ID ${id} not found.`));
      }

      // Return full user data
      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (err) {
      next(err);
    }
  };
}

import { Request, Response, NextFunction } from 'express';
import { UserAuthModel } from '../models/auth.js';
import { hashPassword } from '../utils/auth.js';
import { RegisterInput, LoginInput } from '../schemas/user.js';
import { AppError } from '../middlewares/error.js';
import { verifyPassword, generateToken } from '../utils/auth.js';
import { AuthenticatedRequest } from '../interfaces/express.js';

export class AuthController {
  /**
   * Register a new user after validating uniqueness of email and username.
   * Hashes the password before saving to the database.
   *
   * @param req - Express request object containing user registration data
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as RegisterInput;

      // Check if email is already registered
      const existingByEmail = await UserAuthModel.getByEmail(data.email);
      if (existingByEmail) {
        return next(new AppError(409, 'Email is already in use'));
      }

      // Check if username is already taken
      const existingByUsername = await UserAuthModel.getByUsername(data.username);
      if (existingByUsername) {
        return next(new AppError(409, 'Username is already in use'));
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(data.password);
      const user = await UserAuthModel.create(data, hashedPassword);

      // Respond with created user data
      res.status(201).json({
        status: 'success',
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Authenticate a user using email and password, and return a JWT token in cookie.
   *
   * @param req - Express request object containing login credentials
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as LoginInput;
      const user = await UserAuthModel.getByEmail(data.email);

      // Reject if user does not exist
      if (!user) return next(new AppError(401, 'Invalid email or password'));

      // Verify password
      const isValid = await verifyPassword(data.password, user.password);
      if (!isValid) return next(new AppError(401, 'Invalid email or password'));

      // Generate JWT token
      const token = generateToken({ user_id: user.user_id, email: user.email });

      // Set token as HTTP-only secure cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 // 1 day
      });

      // Exclude password from response
      const { password, ...safeUser } = user;

      res.status(200).json({
        status: 'success',
        message: 'Logged in successfully',
        data: safeUser
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Retrieve the authenticated user's data from JWT token.
   *
   * @param req - Express request with user ID injected by auth middleware
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  static async me(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req as AuthenticatedRequest).user.user_id;
      const user = await UserAuthModel.getById(id);

      // Handle user not found
      if (!user) return next(new AppError(404, 'User not found'));

      res.status(200).json({
        status: 'success',
        data: user
      });
    } catch (err) {
      next(err);
    }
  }

  /** 
   * Partially update the logged-in user's profile.
   * Password is re-hashed if included in the updates.
   *
   * @param req - Express request with user ID and update data
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  static async patchMe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req as AuthenticatedRequest).user.user_id;
      const updates = { ...req.body };

      // Reject if no data provided
      if (!updates || Object.keys(updates).length === 0) {
        return next(new AppError(400, 'No data provided for update'));
      }

      // Hash password if being updated
      if (updates.password) {
        updates.password = await hashPassword(updates.password);
      }

      // Apply patch update
      const ok = await UserAuthModel.patch(id, updates);
      if (!ok) return next(new AppError(404, 'User not found'));

      res.status(200).json({
        status: 'success',
        message: 'Profile updated',
        updatedFields: Object.keys(updates)
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete the authenticated user's account.
   * Clears the JWT cookie afterwards.
   *
   * @param req - Express request with authenticated user
   * @param res - Express response object
   * @param next - Express next middleware function
   */
  static async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (req as AuthenticatedRequest).user.user_id;

      // Attempt to delete user
      const deleted = await UserAuthModel.delete(id);
      if (!deleted) return next(new AppError(404, 'User not found'));

      // Clear authentication cookie
      res.clearCookie('token');

      res.status(200).json({
        status: 'success',
        message: 'Account deleted'
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Logout by clearing the JWT token cookie.
   *
   * @param req - Express request object
   * @param res - Express response object
   * @param _next - Express next middleware function (unused)
   */
  static logout(req: Request, res: Response, _next: NextFunction) {
    // Clear token cookie to log the user out
    res.clearCookie('token');
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  }
}

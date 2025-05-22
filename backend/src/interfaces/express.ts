import { Request } from 'express';
import { PrivateUser, User } from '../schemas/user.js';

/**
 * Extension of the Express Request interface to include authenticated user data.
 * 
 * Only exposes selected fields (user_id and email) from PrivateUser.
 */
export interface AuthenticatedRequest extends Request {
  user: Pick<PrivateUser, 'user_id' | 'email'>;
}

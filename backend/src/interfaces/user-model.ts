import { User } from '../schemas/user.js';
import { BaseModel } from './base-model.js';
import { PlanetarySystem } from '../schemas/planetary-system.js';

/**
 * Interface for User model with extended functionality.
 * 
 * In addition to base CRUD operations, includes a method to retrieve
 * a user along with their associated planetary systems.
 */
export interface UserModelType extends BaseModel<User> {
  getFull(userId: number): Promise<User & { planetary_systems: PlanetarySystem[]; }>;
}

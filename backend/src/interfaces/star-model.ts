import { Star } from '../schemas/star.js';
import { StarFull } from '../schemas/star.full.js';
import { BaseModel } from './base-model.js';
import { starFullSchema } from '../schemas/star.full.js';

/**
 * Interface for Star model with extended functionality.
 * 
 * Inherits standard CRUD methods and adds a method for retrieving detailed star data.
 */
export interface StarModelType extends BaseModel<Star> {
  getFull(id: number): Promise<StarFull>;
}

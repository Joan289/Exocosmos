import { PlanetarySystem } from '../schemas/planetary-system.js';
import { BaseModel } from './base-model.js';

/**
 * Interface for PlanetarySystem model with extended operations.
 * 
 * Extends the base CRUD interface and adds a method to fetch full systems with relations.
 */
export interface PlanetarySystemModelType extends BaseModel<PlanetarySystem> {
  getFull(userId: number): Promise<PlanetarySystem[]>;
}

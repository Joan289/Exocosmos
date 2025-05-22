import { Planet, PlanetFull } from '../schemas/planet.js';
import { BaseModel } from './base-model.js';

/**
 * Interface extending the base model for Planet-specific operations.
 * 
 * Includes an additional method to retrieve a planet with full related data.
 */
export interface PlanetModelType extends BaseModel<Planet> {
  getFull(id: number): Promise<PlanetFull>;
}

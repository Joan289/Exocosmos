import { BaseController } from './base.js';
import { Compound } from '../schemas/compound.js';
import { CompoundModel } from '../models/compound.js';
import { BaseModel } from '../interfaces/base-model.js';

/**
 * Controller for compounds.
 * 
 * Inherits standard CRUD operations from BaseController.
 * Binds the CompoundModel to the generic base logic.
 */
export class CompoundController extends BaseController<Compound> {
  constructor() {
    super(CompoundModel as unknown as BaseModel<Compound>);
  }
}

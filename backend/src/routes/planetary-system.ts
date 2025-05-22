import { Router } from 'express';
import { PlanetarySystemController } from '../controllers/planetary-system.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import { checkOwnership } from '../middlewares/check-ownership.js';
import {
  createPlanetarySystemSchema,
  updatePlanetarySystemSchema,
  patchPlanetarySystemSchema,
  getPlanetarySystemQuerySchema,
  idParamSchema
} from '../schemas/planetary-system.js';

export const planetarySystemRouter = Router();
const controller = new PlanetarySystemController();

planetarySystemRouter.get('/', authenticate, validate(getPlanetarySystemQuerySchema, 'query'), controller.getAll);
planetarySystemRouter.get('/:id', authenticate, validate(idParamSchema, 'params'), controller.getById);
planetarySystemRouter.get('/:id/full', authenticate, validate(idParamSchema, 'params'), controller.getFull);
planetarySystemRouter.post('/', authenticate, validate(createPlanetarySystemSchema), controller.create);
planetarySystemRouter.put('/:id', authenticate, validate(idParamSchema, 'params'), checkOwnership('planetary_system'), validate(updatePlanetarySystemSchema), controller.update);
planetarySystemRouter.patch('/:id', authenticate, validate(idParamSchema, 'params'), checkOwnership('planetary_system'), validate(patchPlanetarySystemSchema), controller.patch);
planetarySystemRouter.delete('/:id', authenticate, validate(idParamSchema, 'params'), checkOwnership('planetary_system'), controller.delete);

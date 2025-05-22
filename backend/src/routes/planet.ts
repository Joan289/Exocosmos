import { Router } from 'express';
import { PlanetController } from '../controllers/planet.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import { checkOwnership } from '../middlewares/check-ownership.js';
import { validatePlanetAgainstType } from '../middlewares/validate-planet-against-type.js';
import {
  createPlanetSchema,
  updatePlanetSchema,
  patchPlanetSchema,
  getPlanetQuerySchema,
  idParamSchema
} from '../schemas/planet.js';

export const planetRouter = Router();
const controller = new PlanetController();

planetRouter.get('/', authenticate, validate(getPlanetQuerySchema, 'query'), controller.getAll);
planetRouter.get('/:id', authenticate, validate(idParamSchema, 'params'), controller.getById);
planetRouter.get('/:id/full', authenticate, validate(idParamSchema, 'params'), controller.getFull);

planetRouter.post(
  '/',
  authenticate,
  validate(createPlanetSchema),
  checkOwnership('planetary_system', 'body'),
  validatePlanetAgainstType,
  controller.create
);

planetRouter.put(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  checkOwnership('planet'),
  validate(updatePlanetSchema),
  validatePlanetAgainstType,
  controller.update
);

planetRouter.patch(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  checkOwnership('planet'),
  validate(patchPlanetSchema),
  validatePlanetAgainstType,
  controller.patch
);

planetRouter.delete(
  '/:id',
  authenticate,
  validate(idParamSchema, 'params'),
  checkOwnership('planet'),
  controller.delete
);

import { Router, Request, Response } from 'express';
import { PlanetTypeController } from '../controllers/planet-type.js';
import { validate } from '../middlewares/validate.js';
import { idParamSchema } from '../schemas/planet-type.js';
import { authenticate } from '../middlewares/auth.js';
import { methodNotAllowed } from '../middlewares/method-not-allowed.js';

export const planetTypeRouter = Router();
const controller = new PlanetTypeController();

planetTypeRouter.get('/', authenticate, controller.getAll);
planetTypeRouter.get('/:id', authenticate, validate(idParamSchema, 'params'), controller.getById);

planetTypeRouter.post('/', methodNotAllowed);
planetTypeRouter.put('/:id', methodNotAllowed);
planetTypeRouter.patch('/:id', methodNotAllowed);
planetTypeRouter.delete('/:id', methodNotAllowed);
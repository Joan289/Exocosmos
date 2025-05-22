import { Router } from 'express';
import { StarController } from '../controllers/star.js';
import { validate } from '../middlewares/validate.js';
import { authenticate } from '../middlewares/auth.js';
import { updateStarSchema, patchStarSchema, starBaseSchema, getStarQuerySchema, idParamSchema } from '../schemas/star.js';
import { methodNotAllowed } from '../middlewares/method-not-allowed.js';

export const starRouter = Router();

const starController = new StarController();

starRouter.get('/', authenticate, validate(getStarQuerySchema, 'query'), starController.getAll);
starRouter.get('/:id', authenticate, validate(idParamSchema, 'params'), starController.getById);
starRouter.get('/:id/full', validate(idParamSchema, 'params'), starController.getFull);
starRouter.post('/', methodNotAllowed);
starRouter.put('/:id', authenticate, validate(idParamSchema, 'params'), validate(updateStarSchema), starController.update);
starRouter.patch('/:id', authenticate, validate(idParamSchema, 'params'), validate(patchStarSchema), starController.patch);
starRouter.delete('/:id', methodNotAllowed);
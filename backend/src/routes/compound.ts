import { Router } from 'express';
import { CompoundController } from '../controllers/compound.js';
import { validate } from '../middlewares/validate.js';
import { createCompoundSchema, getCompoundQuerySchema, idParamSchema } from '../schemas/compound.js';
import { authenticate } from '../middlewares/auth.js';
import { methodNotAllowed } from '../middlewares/method-not-allowed.js';

export const compoundRouter = Router();
const controller = new CompoundController();

compoundRouter.get('/', authenticate, validate(getCompoundQuerySchema, 'query'), controller.getAll);
compoundRouter.get('/:id', authenticate, validate(idParamSchema, 'params'), controller.getById);
compoundRouter.post('/', authenticate, validate(createCompoundSchema), controller.create);
compoundRouter.put('/:id', methodNotAllowed);
compoundRouter.patch('/:id', methodNotAllowed);
compoundRouter.delete('/:id', methodNotAllowed);

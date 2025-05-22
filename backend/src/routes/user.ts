import { Router } from 'express';
import { UserController } from '../controllers/user.js';
import { validate } from '../middlewares/validate.js';
import { patchUserSchema, updateUserSchema, getUserQuerySchema, idParamSchema } from '../schemas/user.js';
import { authenticate } from '../middlewares/auth.js';
import { methodNotAllowed } from '../middlewares/method-not-allowed.js';

export const userRouter = Router();
const controller = new UserController();

userRouter.get('/', authenticate, validate(getUserQuerySchema, 'query'), controller.getAll);
userRouter.get('/:id', authenticate, validate(idParamSchema, 'params'), controller.getById);
userRouter.get('/:id/full', validate(idParamSchema, 'params'), controller.getFull);
userRouter.post('/', methodNotAllowed);
userRouter.patch('/:id', methodNotAllowed);
userRouter.put('/:id', methodNotAllowed);
userRouter.delete('/:id', methodNotAllowed);

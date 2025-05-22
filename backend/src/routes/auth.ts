import { Router } from 'express';
import { AuthController } from '../controllers/auth.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, patchUserSchema, registerSchema } from '../schemas/user.js';
import { authenticate } from '../middlewares/auth.js';

export const authRouter = Router();

// Public
authRouter.post('/register', validate(registerSchema), AuthController.register);
authRouter.post('/login', validate(loginSchema), AuthController.login);

// Protected
authRouter.get('/me', authenticate, AuthController.me);
authRouter.patch('/me', authenticate, validate(patchUserSchema), AuthController.patchMe);
authRouter.delete('/me', authenticate, AuthController.deleteMe);
authRouter.post('/logout', authenticate, AuthController.logout);

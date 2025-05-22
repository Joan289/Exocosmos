import { Router } from 'express';
import { uploadImage } from '../controllers/upload.js';
import { upload } from '../middlewares/upload.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { validateUploadRoute } from '../middlewares/validate-upload-route.js';

export const uploadRouter = Router();

uploadRouter.post('/:entity/:id/:type',
  authenticate,
  validateUploadRoute,
  upload.single('file'),
  uploadImage()
);

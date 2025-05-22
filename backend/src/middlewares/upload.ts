import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { AppError } from './error.js';

// Max file size allowed: 5 MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed MIME types for image uploads
const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Determine base upload directory based on environment
const BASE_UPLOAD_DIR = process.env.NODE_ENV === 'test'
  ? path.join('tests', '__files__', 'uploads')
  : path.join('public', 'uploads');

// Multer storage configuration
const storage = multer.diskStorage({
  // Dynamically resolve the upload destination based on entity and type
  destination: (req, file, cb) => {
    const { entity, type } = req.params;

    if (!entity || !type) {
      return cb(new AppError(400, 'Missing upload path parameters'), '');
    }

    const folder = type;
    const uploadPath = path.join(BASE_UPLOAD_DIR, entity, folder);

    // Ensure upload directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },

  // Use the resource ID as filename, preserving the original extension
  filename: (req, file, cb) => {
    const { id } = req.params;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${id}${ext}`);
  }
});

// Multer middleware configuration
export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    // Validate MIME type
    if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError(415, 'Unsupported file type'));
    }
    cb(null, true);
  }
});

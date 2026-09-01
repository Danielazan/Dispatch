import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';

if (!fs.existsSync(env.UPLOAD_DIR)) {
  fs.mkdirSync(env.UPLOAD_DIR, { recursive: true });
}

const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // DELTA: carrier is a back-relation — read it via .carrier.id
    const carrierId = req.onboardingSession?.carrier?.id || 'unknown-carrier';
    const rawDocumentType = req.body?.documentType || 'document';
    const safeDocumentType = String(rawDocumentType).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const ext = path.extname(file.originalname).toLowerCase();
    const timestamp = Date.now();
    cb(null, `${carrierId}-${safeDocumentType}-${timestamp}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype) || !ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new ApiError(400, 'Only PDF, JPG, and PNG files are allowed', { code: 'invalid_file_type' }),
      false
    );
  }
  cb(null, true);
};

export const uploadDocument = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('file');
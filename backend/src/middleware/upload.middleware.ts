import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { UPLOAD_CONSTANTS } from '../utils/constants/upload.constants';

if (!fs.existsSync(UPLOAD_CONSTANTS.UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_CONSTANTS.UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_CONSTANTS.UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    cb(null, `photo-${uniqueSuffix}${sanitizedExt}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: {
    fileSize: UPLOAD_CONSTANTS.MAX_FILE_SIZE,
  },
});

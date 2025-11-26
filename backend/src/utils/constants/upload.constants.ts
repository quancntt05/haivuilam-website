import { env } from '../../config/env';

export const UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: env.MAX_FILE_SIZE, // 5MB default
  ALLOWED_MIME_TYPES: env.ALLOWED_FILE_TYPES,
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  UPLOAD_DIR: env.UPLOAD_DIR,
} as const;

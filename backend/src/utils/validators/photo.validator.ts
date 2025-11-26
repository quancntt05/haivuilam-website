import { UPLOAD_CONSTANTS } from '../constants/upload.constants';

export const validateFileType = (mimeType: string): boolean => {
  return UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES.includes(mimeType);
};

export const validateFileSize = (size: number): boolean => {
  return size > 0 && size <= UPLOAD_CONSTANTS.MAX_FILE_SIZE;
};

export const validatePhotoUpload = (
  file: Express.Multer.File | undefined
): {
  isValid: boolean;
  error?: string;
} => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }

  if (!validateFileType(file.mimetype)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${UPLOAD_CONSTANTS.ALLOWED_MIME_TYPES.join(', ')}`,
    };
  }

  if (!validateFileSize(file.size)) {
    const maxSizeMB = UPLOAD_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024);
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${maxSizeMB}MB`,
    };
  }

  return { isValid: true };
};

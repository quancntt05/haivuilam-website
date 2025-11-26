import fs from 'fs/promises';
import path from 'path';
import { UPLOAD_CONSTANTS } from '../constants/upload.constants';

export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    const fullPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(UPLOAD_CONSTANTS.UPLOAD_DIR, filePath);
    await fs.unlink(fullPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
};

export const getFileUrl = (filename: string): string => {
  return `/uploads/photos/${filename}`;
};

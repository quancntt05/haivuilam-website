import { Router } from 'express';
import {
  uploadPhotoHandler,
  getPhotos,
  getPhoto,
  getUserPhotosHandler,
  deletePhotoHandler,
} from '../controllers/photo.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { uploadMiddleware } from '../middleware/upload.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  validateUUID,
  validatePagination,
  validateUserId,
} from '../utils/validators/common.validator';

const router = Router();

router.post('/upload', authMiddleware, uploadMiddleware.single('photo'), uploadPhotoHandler);
router.get('/', validate(validatePagination()), getPhotos);
router.get('/:id', validate([validateUUID()]), getPhoto);
router.get(
  '/user/:userId',
  validate([validateUserId(), ...validatePagination()]),
  getUserPhotosHandler
);
router.delete('/:id', authMiddleware, validate([validateUUID()]), deletePhotoHandler);

export default router;

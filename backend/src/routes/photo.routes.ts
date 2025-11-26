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

const router = Router();

router.post('/upload', authMiddleware, uploadMiddleware.single('photo'), uploadPhotoHandler);
router.get('/', getPhotos);
router.get('/:id', getPhoto);
router.get('/user/:userId', getUserPhotosHandler);
router.delete('/:id', authMiddleware, deletePhotoHandler);

export default router;

import { Router } from 'express';
import {
  createCommentHandler,
  getCommentsByPhotoHandler,
  updateCommentHandler,
  deleteCommentHandler,
} from '../controllers/comment.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authMiddleware, createCommentHandler);
router.get('/photo/:photoId', getCommentsByPhotoHandler);
router.put('/:id', authMiddleware, updateCommentHandler);
router.delete('/:id', authMiddleware, deleteCommentHandler);

export default router;

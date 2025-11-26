import { Router } from 'express';
import {
  createCommentHandler,
  getCommentsByPhotoHandler,
  updateCommentHandler,
  deleteCommentHandler,
} from '../controllers/comment.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  validateUUID,
  validatePagination,
  validatePhotoId,
} from '../utils/validators/common.validator';
import { body } from 'express-validator';

const router = Router();

router.post(
  '/',
  authMiddleware,
  validate([
    validatePhotoId(),
    body('content')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Comment content must be between 1 and 1000 characters'),
  ]),
  createCommentHandler
);

router.get(
  '/photo/:photoId',
  validate([validateUUID('photoId'), ...validatePagination()]),
  getCommentsByPhotoHandler
);

router.put(
  '/:id',
  authMiddleware,
  validate([
    validateUUID(),
    body('content')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Comment content must be between 1 and 1000 characters'),
  ]),
  updateCommentHandler
);

router.delete('/:id', authMiddleware, validate([validateUUID()]), deleteCommentHandler);

export default router;

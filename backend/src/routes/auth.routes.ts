import { Router } from 'express';
import { handleGoogleCallback, refreshToken, logout } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/google/callback', handleGoogleCallback);
router.post('/refresh', refreshToken);
router.post('/logout', authMiddleware, logout);

export default router;

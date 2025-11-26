import { Response } from 'express';
import {
  createComment,
  getCommentsByPhotoId,
  updateComment,
  deleteComment,
} from '../services/comment.service';
import {
  validateCommentCreation,
  validateCommentContent,
} from '../utils/validators/comment.validator';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth.middleware';

export const createCommentHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized',
      };
      res.status(401).json(response);
      return;
    }

    const { photoId, content } = req.body;

    const validation = validateCommentCreation({ photoId, content });
    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        message: validation.error || 'Validation failed',
      };
      res.status(400).json(response);
      return;
    }

    const comment = await createComment({
      photoId,
      userId: req.user.userId,
      content,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Comment created successfully',
      data: comment,
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to create comment',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const getCommentsByPhotoHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { photoId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const result = await getCommentsByPhotoId(photoId, page, limit);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch comments',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const updateCommentHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized',
      };
      res.status(401).json(response);
      return;
    }

    const { id } = req.params;
    const { content } = req.body;

    const validation = validateCommentContent(content);
    if (!validation.isValid) {
      const response: ApiResponse = {
        success: false,
        message: validation.error || 'Validation failed',
      };
      res.status(400).json(response);
      return;
    }

    const comment = await updateComment(id, req.user.userId, { content });

    if (!comment) {
      const response: ApiResponse = {
        success: false,
        message: 'Comment not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Comment updated successfully',
      data: comment,
    };

    res.status(200).json(response);
  } catch (error) {
    const statusCode = error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500;
    const response: ApiResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update comment',
    };
    res.status(statusCode).json(response);
  }
};

export const deleteCommentHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized',
      };
      res.status(401).json(response);
      return;
    }

    const { id } = req.params;

    const deleted = await deleteComment(id, req.user.userId);

    if (!deleted) {
      const response: ApiResponse = {
        success: false,
        message: 'Comment not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      message: 'Comment deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    const statusCode = error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500;
    const response: ApiResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete comment',
    };
    res.status(statusCode).json(response);
  }
};

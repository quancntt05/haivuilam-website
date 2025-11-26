import { Response } from 'express';
import {
  uploadPhoto,
  getPhotoById,
  getUserPhotos,
  getAllPhotos,
  deletePhoto,
} from '../services/photo.service';
import { getFileUrl } from '../utils/helpers/file.helper';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth.middleware';

export const uploadPhotoHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      const response: ApiResponse = {
        success: false,
        message: 'No file uploaded',
      };
      res.status(400).json(response);
      return;
    }

    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized',
      };
      res.status(401).json(response);
      return;
    }

    const photoData = {
      userId: req.user.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: getFileUrl(req.file.filename),
    };

    const photo = await uploadPhoto(photoData);

    const response: ApiResponse = {
      success: true,
      message: 'Photo uploaded successfully',
      data: photo,
    };

    res.status(201).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to upload photo',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const getPhotos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await getAllPhotos(page, limit);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch photos',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const getPhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const photo = await getPhotoById(id);

    if (!photo) {
      const response: ApiResponse = {
        success: false,
        message: 'Photo not found',
      };
      res.status(404).json(response);
      return;
    }

    const response: ApiResponse = {
      success: true,
      data: photo,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch photo',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const getUserPhotosHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await getUserPhotos(userId, page, limit);

    const response: ApiResponse = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Failed to fetch user photos',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const deletePhotoHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Unauthorized',
      };
      res.status(401).json(response);
      return;
    }

    await deletePhoto(id, req.user.userId);

    const response: ApiResponse = {
      success: true,
      message: 'Photo deleted successfully',
    };

    res.status(200).json(response);
  } catch (error) {
    const statusCode = error instanceof Error && error.message.includes('Unauthorized') ? 403 : 500;
    const response: ApiResponse = {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete photo',
    };
    res.status(statusCode).json(response);
  }
};

import { Response } from 'express';
import { findOrCreateUser, generateUserTokens, GoogleUserData } from '../services/auth.service';
import { verifyRefreshToken, generateTokens } from '../utils/helpers/jwt.helper';
import { ApiResponse } from '../types';
import { AuthRequest } from '../middleware/auth.middleware';

export const handleGoogleCallback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const googleData: GoogleUserData = req.body;

    if (!googleData.email || !googleData.providerId) {
      const response: ApiResponse = {
        success: false,
        message: 'Missing required Google user data',
      };
      res.status(400).json(response);
      return;
    }

    const user = await findOrCreateUser(googleData);
    const tokens = generateUserTokens(user.id, user.email);

    const response: ApiResponse = {
      success: true,
      message: 'Authentication successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        ...tokens,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
    res.status(500).json(response);
  }
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: 'Refresh token is required',
      };
      res.status(400).json(response);
      return;
    }

    const decoded = verifyRefreshToken(token);
    const tokens = generateTokens({
      userId: decoded.userId,
      email: decoded.email,
    });

    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: tokens,
    };

    res.status(200).json(response);
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      message: 'Invalid or expired refresh token',
    };
    res.status(401).json(response);
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  const response: ApiResponse = {
    success: true,
    message: 'Logout successful',
  };
  res.status(200).json(response);
};

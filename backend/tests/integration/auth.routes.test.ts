import request from 'supertest';
import express from 'express';
import { createTestApp } from '../helpers/test-app';
import { prisma } from '../../src/config/database';
import { generateTokens, verifyRefreshToken } from '../../src/utils/helpers/jwt.helper';
import { MockPrisma } from '../helpers/prisma-mock';

jest.mock('../../src/config/database');
jest.mock('../../src/utils/helpers/jwt.helper');

const mockPrisma = prisma as unknown as MockPrisma;

describe('Auth Routes', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/google/callback', () => {
    it('should create user and return tokens for new user', async () => {
      const googleData = {
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/image.jpg',
        providerId: 'google-123',
      };

      const mockUser = {
        id: 'user-123',
        email: googleData.email,
        name: googleData.name,
        image: googleData.image,
        provider: 'google',
        providerId: googleData.providerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      mockPrisma.user.upsert.mockResolvedValue(mockUser as any);
      (generateTokens as jest.Mock).mockReturnValue(mockTokens);

      const response = await request(app)
        .post('/api/v1/auth/google/callback')
        .send(googleData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(response.body.data.user.email).toBe(googleData.email);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/v1/auth/google/callback')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('should return new tokens for valid refresh token', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
      };

      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      (verifyRefreshToken as jest.Mock).mockReturnValue(mockPayload);
      (generateTokens as jest.Mock).mockReturnValue(mockTokens);

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('should return 401 for invalid refresh token', async () => {
      (verifyRefreshToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const response = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

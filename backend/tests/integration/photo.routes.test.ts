import request from 'supertest';
import express from 'express';
import { createTestApp } from '../helpers/test-app';
import { prisma } from '../../src/config/database';
import { verifyAccessToken } from '../../src/utils/helpers/jwt.helper';
import { MockPrisma } from '../helpers/prisma-mock';

jest.mock('../../src/config/database');
jest.mock('../../src/utils/helpers/jwt.helper');

const mockPrisma = prisma as unknown as MockPrisma;

describe('Photo Routes', () => {
  let app: express.Application;
  const mockAccessToken = 'valid-access-token';
  const mockUserId = '123e4567-e89b-12d3-a456-426614174002';

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
    (verifyAccessToken as jest.Mock).mockReturnValue({
      userId: mockUserId,
      email: 'test@example.com',
    });
  });

  describe('GET /api/v1/photos', () => {
    it('should return paginated photos', async () => {
      const mockPhotos = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: 'user-123',
          filename: 'photo-1.jpg',
          originalName: 'test1.jpg',
          mimeType: 'image/jpeg',
          size: 1024,
          url: '/uploads/photos/photo-1.jpg',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            image: null,
          },
          _count: {
            comments: 0,
          },
        },
      ];

      mockPrisma.photo.findMany.mockResolvedValue(mockPhotos as any);
      mockPrisma.photo.count.mockResolvedValue(1);

      const response = await request(app).get('/api/v1/photos?page=1&limit=20').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('photos');
      expect(response.body.data).toHaveProperty('pagination');
      expect(response.body.data.photos).toHaveLength(1);
    });

    it('should return 400 for invalid pagination parameters', async () => {
      const response = await request(app).get('/api/v1/photos?page=0&limit=20').expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/photos/:id', () => {
    it('should return photo by id', async () => {
      const photoId = '123e4567-e89b-12d3-a456-426614174000';
      const mockPhoto = {
        id: photoId,
        userId: '123e4567-e89b-12d3-a456-426614174002',
        filename: 'photo-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        url: '/uploads/photos/photo-123.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          email: 'test@example.com',
          name: 'Test User',
          image: null,
        },
        comments: [],
      };

      mockPrisma.photo.findUnique.mockResolvedValue(mockPhoto as any);

      const response = await request(app).get(`/api/v1/photos/${photoId}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(photoId);
    });

    it('should return 404 if photo not found', async () => {
      const photoId = '123e4567-e89b-12d3-a456-426614174001';

      mockPrisma.photo.findUnique.mockResolvedValue(null);

      const response = await request(app).get(`/api/v1/photos/${photoId}`).expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app).get('/api/v1/photos/invalid-id').expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/photos/:id', () => {
    it('should delete photo if user is owner', async () => {
      const photoId = '123e4567-e89b-12d3-a456-426614174000';
      const mockPhoto = {
        id: photoId,
        userId: mockUserId,
        filename: 'photo-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        url: '/uploads/photos/photo-123.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.photo.findUnique.mockResolvedValue(mockPhoto as any);
      mockPrisma.photo.delete.mockResolvedValue(mockPhoto as any);

      const response = await request(app)
        .delete(`/api/v1/photos/${photoId}`)
        .set('Authorization', `Bearer ${mockAccessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 if not authenticated', async () => {
      const photoId = 'photo-123';

      const response = await request(app).delete(`/api/v1/photos/${photoId}`).expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

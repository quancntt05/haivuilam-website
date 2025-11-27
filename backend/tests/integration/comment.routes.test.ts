import request from 'supertest';
import express from 'express';
import { createTestApp } from '../helpers/test-app';
import { prisma } from '../../src/config/database';
import { verifyAccessToken } from '../../src/utils/helpers/jwt.helper';
import { MockPrisma } from '../helpers/prisma-mock';

jest.mock('../../src/config/database');
jest.mock('../../src/utils/helpers/jwt.helper');

const mockPrisma = prisma as unknown as MockPrisma;

describe('Comment Routes', () => {
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

  describe('POST /api/v1/comments', () => {
    it('should create a new comment', async () => {
      const commentData = {
        photoId: '123e4567-e89b-12d3-a456-426614174000',
        content: 'Great photo!',
      };

      const mockComment = {
        id: '123e4567-e89b-12d3-a456-426614174003',
        photoId: commentData.photoId,
        userId: mockUserId,
        content: commentData.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: mockUserId,
          email: 'test@example.com',
          name: 'Test User',
          image: null,
        },
        photo: {
          id: commentData.photoId,
          url: '/uploads/photos/photo.jpg',
        },
      };

      mockPrisma.comment.create.mockResolvedValue(mockComment as any);

      const response = await request(app)
        .post('/api/v1/comments')
        .set('Authorization', `Bearer ${mockAccessToken}`)
        .send(commentData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe(commentData.content);
    });

    it('should return 401 if not authenticated', async () => {
      const commentData = {
        photoId: 'photo-123',
        content: 'Great photo!',
      };

      const response = await request(app).post('/api/v1/comments').send(commentData).expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 if content is missing', async () => {
      const commentData = {
        photoId: 'photo-123',
      };

      const response = await request(app)
        .post('/api/v1/comments')
        .set('Authorization', `Bearer ${mockAccessToken}`)
        .send(commentData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/comments/photo/:photoId', () => {
    it('should return comments by photoId', async () => {
      const photoId = '123e4567-e89b-12d3-a456-426614174000';
      const mockComments = [
        {
          id: '123e4567-e89b-12d3-a456-426614174003',
          photoId: photoId,
          userId: mockUserId,
          content: 'Great photo!',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: mockUserId,
            email: 'test@example.com',
            name: 'Test User',
            image: null,
          },
        },
      ];

      mockPrisma.comment.findMany.mockResolvedValue(mockComments as any);
      mockPrisma.comment.count.mockResolvedValue(1);

      const response = await request(app).get(`/api/v1/comments/photo/${photoId}`).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('comments');
      expect(response.body.data.comments).toHaveLength(1);
    });

    it('should return 400 for invalid photoId UUID', async () => {
      const response = await request(app).get('/api/v1/comments/photo/invalid-id').expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/comments/:id', () => {
    it('should update comment if user is owner', async () => {
      const commentId = '123e4567-e89b-12d3-a456-426614174003';
      const updateData = {
        content: 'Updated comment',
      };

      const mockComment = {
        id: commentId,
        photoId: '123e4567-e89b-12d3-a456-426614174000',
        userId: mockUserId,
        content: 'Old content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedComment = {
        ...mockComment,
        content: updateData.content,
        user: {
          id: mockUserId,
          email: 'test@example.com',
          name: 'Test User',
          image: null,
        },
        photo: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          url: '/uploads/photos/photo.jpg',
        },
      };

      mockPrisma.comment.findUnique.mockResolvedValue(mockComment as any);
      mockPrisma.comment.update.mockResolvedValue(updatedComment as any);

      const response = await request(app)
        .put(`/api/v1/comments/${commentId}`)
        .set('Authorization', `Bearer ${mockAccessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBe(updateData.content);
    });

    it('should return 401 if not authenticated', async () => {
      const commentId = '123e4567-e89b-12d3-a456-426614174003';
      const updateData = {
        content: 'Updated comment',
      };

      const response = await request(app)
        .put(`/api/v1/comments/${commentId}`)
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/v1/comments/:id', () => {
    it('should delete comment if user is owner', async () => {
      const commentId = '123e4567-e89b-12d3-a456-426614174003';
      const mockComment = {
        id: commentId,
        photoId: '123e4567-e89b-12d3-a456-426614174000',
        userId: mockUserId,
        content: 'Test comment',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.comment.findUnique.mockResolvedValue(mockComment as any);
      mockPrisma.comment.delete.mockResolvedValue(mockComment as any);

      const response = await request(app)
        .delete(`/api/v1/comments/${commentId}`)
        .set('Authorization', `Bearer ${mockAccessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 401 if not authenticated', async () => {
      const commentId = '123e4567-e89b-12d3-a456-426614174003';

      const response = await request(app).delete(`/api/v1/comments/${commentId}`).expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

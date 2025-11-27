import {
  createComment,
  getCommentsByPhotoId,
  updateComment,
  deleteComment,
} from '../../../src/services/comment.service';
import { prisma } from '../../../src/config/database';
import { sanitizeComment } from '../../../src/utils/helpers/sanitize.helper';
import { MockPrisma } from '../../helpers/prisma-mock';

jest.mock('../../../src/config/database');
jest.mock('../../../src/utils/helpers/sanitize.helper');

const mockPrisma = prisma as unknown as MockPrisma;

describe('Comment Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createComment', () => {
    it('should create a new comment with sanitized content', async () => {
      const commentData = {
        photoId: 'photo-123',
        userId: 'user-123',
        content: '<script>alert("xss")</script>Hello World',
      };

      const sanitizedContent = 'Hello World';
      const mockComment = {
        id: 'comment-123',
        ...commentData,
        content: sanitizedContent,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          image: null,
        },
        photo: {
          id: 'photo-123',
          url: '/uploads/photos/photo-123.jpg',
        },
      };

      (sanitizeComment as jest.Mock).mockReturnValue(sanitizedContent);
      mockPrisma.comment.create.mockResolvedValue(mockComment as any);

      const result = await createComment(commentData);

      expect(sanitizeComment).toHaveBeenCalledWith(commentData.content);
      expect(mockPrisma.comment.create).toHaveBeenCalledWith({
        data: {
          photoId: commentData.photoId,
          userId: commentData.userId,
          content: sanitizedContent,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
          photo: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      });

      expect(result).toEqual(mockComment);
    });
  });

  describe('getCommentsByPhotoId', () => {
    it('should return paginated comments for a photo', async () => {
      const photoId = 'photo-123';
      const page = 1;
      const limit = 50;

      const mockComments = [
        {
          id: 'comment-1',
          photoId: photoId,
          userId: 'user-123',
          content: 'Great photo!',
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
            image: null,
          },
        },
      ];

      mockPrisma.comment.findMany.mockResolvedValue(mockComments as any);
      mockPrisma.comment.count.mockResolvedValue(1);

      const result = await getCommentsByPhotoId(photoId, page, limit);

      expect(mockPrisma.comment.findMany).toHaveBeenCalledWith({
        where: { photoId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
        skip: 0,
        take: limit,
      });

      expect(result.comments).toEqual(mockComments);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 50,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe('updateComment', () => {
    it('should update comment if user is owner', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';
      const updateData = {
        content: '<script>alert("xss")</script>Updated comment',
      };

      const sanitizedContent = 'Updated comment';
      const mockComment = {
        id: commentId,
        photoId: 'photo-123',
        userId: userId,
        content: 'Old content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedComment = {
        ...mockComment,
        content: sanitizedContent,
        user: {
          id: userId,
          email: 'test@example.com',
          name: 'Test User',
          image: null,
        },
        photo: {
          id: 'photo-123',
          url: '/uploads/photos/photo-123.jpg',
        },
      };

      mockPrisma.comment.findUnique.mockResolvedValue(mockComment as any);
      (sanitizeComment as jest.Mock).mockReturnValue(sanitizedContent);
      mockPrisma.comment.update.mockResolvedValue(updatedComment as any);

      const result = await updateComment(commentId, userId, updateData);

      expect(mockPrisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id: commentId },
      });
      expect(sanitizeComment).toHaveBeenCalledWith(updateData.content);
      expect(mockPrisma.comment.update).toHaveBeenCalledWith({
        where: { id: commentId },
        data: {
          content: sanitizedContent,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
          photo: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      });

      expect(result).toEqual(updatedComment);
    });

    it('should return null if comment not found', async () => {
      const commentId = 'non-existent';
      const userId = 'user-123';
      const updateData = { content: 'Updated' };

      mockPrisma.comment.findUnique.mockResolvedValue(null);

      const result = await updateComment(commentId, userId, updateData);

      expect(result).toBeNull();
      expect(mockPrisma.comment.update).not.toHaveBeenCalled();
    });

    it('should throw error if user is not owner', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';
      const otherUserId = 'user-456';
      const updateData = { content: 'Updated' };

      const mockComment = {
        id: commentId,
        photoId: 'photo-123',
        userId: otherUserId,
        content: 'Old content',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.comment.findUnique.mockResolvedValue(mockComment as any);

      await expect(updateComment(commentId, userId, updateData)).rejects.toThrow(
        'Unauthorized: You can only update your own comments'
      );

      expect(mockPrisma.comment.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteComment', () => {
    it('should delete comment if user is owner', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';

      const mockComment = {
        id: commentId,
        photoId: 'photo-123',
        userId: userId,
        content: 'Test comment',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.comment.findUnique.mockResolvedValue(mockComment as any);
      mockPrisma.comment.delete.mockResolvedValue(mockComment as any);

      const result = await deleteComment(commentId, userId);

      expect(mockPrisma.comment.findUnique).toHaveBeenCalledWith({
        where: { id: commentId },
      });
      expect(mockPrisma.comment.delete).toHaveBeenCalledWith({
        where: { id: commentId },
      });
      expect(result).toBe(true);
    });

    it('should return false if comment not found', async () => {
      const commentId = 'non-existent';
      const userId = 'user-123';

      mockPrisma.comment.findUnique.mockResolvedValue(null);

      const result = await deleteComment(commentId, userId);

      expect(result).toBe(false);
      expect(mockPrisma.comment.delete).not.toHaveBeenCalled();
    });

    it('should throw error if user is not owner', async () => {
      const commentId = 'comment-123';
      const userId = 'user-123';
      const otherUserId = 'user-456';

      const mockComment = {
        id: commentId,
        photoId: 'photo-123',
        userId: otherUserId,
        content: 'Test comment',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.comment.findUnique.mockResolvedValue(mockComment as any);

      await expect(deleteComment(commentId, userId)).rejects.toThrow(
        'Unauthorized: You can only delete your own comments'
      );

      expect(mockPrisma.comment.delete).not.toHaveBeenCalled();
    });
  });
});

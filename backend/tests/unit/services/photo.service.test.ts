import {
  uploadPhoto,
  getPhotoById,
  getAllPhotos,
  deletePhoto,
} from '../../../src/services/photo.service';
import { prisma } from '../../../src/config/database';
import { deleteFile } from '../../../src/utils/helpers/file.helper';
import { MockPrisma } from '../../helpers/prisma-mock';

jest.mock('../../../src/config/database');
jest.mock('../../../src/utils/helpers/file.helper');

const mockPrisma = prisma as unknown as MockPrisma;

describe('Photo Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadPhoto', () => {
    it('should create a new photo', async () => {
      const photoData = {
        userId: 'user-123',
        filename: 'photo-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        url: '/uploads/photos/photo-123.jpg',
      };

      const mockPhoto = {
        ...photoData,
        id: 'photo-123',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          image: null,
        },
      };

      mockPrisma.photo.create.mockResolvedValue(mockPhoto as any);

      const result = await uploadPhoto(photoData);

      expect(mockPrisma.photo.create).toHaveBeenCalledWith({
        data: photoData,
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
      });

      expect(result).toEqual(mockPhoto);
    });
  });

  describe('getPhotoById', () => {
    it('should return photo with user and comments', async () => {
      const photoId = 'photo-123';
      const mockPhoto = {
        id: photoId,
        userId: 'user-123',
        filename: 'photo-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        url: '/uploads/photos/photo-123.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
          image: null,
        },
        comments: [],
      };

      mockPrisma.photo.findUnique.mockResolvedValue(mockPhoto as any);

      const result = await getPhotoById(photoId);

      expect(mockPrisma.photo.findUnique).toHaveBeenCalledWith({
        where: { id: photoId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
          comments: {
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
              createdAt: 'desc',
            },
          },
        },
      });

      expect(result).toEqual(mockPhoto);
    });

    it('should return null if photo not found', async () => {
      const photoId = 'non-existent';

      mockPrisma.photo.findUnique.mockResolvedValue(null);

      const result = await getPhotoById(photoId);

      expect(result).toBeNull();
    });
  });

  describe('getAllPhotos', () => {
    it('should return paginated photos', async () => {
      const page = 1;
      const limit = 20;
      const mockPhotos = [
        {
          id: 'photo-1',
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
            comments: 5,
          },
        },
      ];

      mockPrisma.photo.findMany.mockResolvedValue(mockPhotos as any);
      mockPrisma.photo.count.mockResolvedValue(1);

      const result = await getAllPhotos(page, limit);

      expect(mockPrisma.photo.findMany).toHaveBeenCalledWith({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: 0,
        take: limit,
      });

      expect(result.photos).toEqual(mockPhotos);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      });
    });
  });

  describe('deletePhoto', () => {
    it('should delete photo if user is owner', async () => {
      const photoId = 'photo-123';
      const userId = 'user-123';
      const mockPhoto = {
        id: photoId,
        userId: userId,
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
      (deleteFile as jest.Mock).mockResolvedValue(undefined);

      const result = await deletePhoto(photoId, userId);

      expect(mockPrisma.photo.findUnique).toHaveBeenCalledWith({
        where: { id: photoId },
      });
      expect(deleteFile).toHaveBeenCalledWith(mockPhoto.filename);
      expect(mockPrisma.photo.delete).toHaveBeenCalledWith({
        where: { id: photoId },
      });
      expect(result).toBe(true);
    });

    it('should return false if photo not found', async () => {
      const photoId = 'non-existent';
      const userId = 'user-123';

      mockPrisma.photo.findUnique.mockResolvedValue(null);

      const result = await deletePhoto(photoId, userId);

      expect(result).toBe(false);
      expect(deleteFile).not.toHaveBeenCalled();
      expect(mockPrisma.photo.delete).not.toHaveBeenCalled();
    });

    it('should throw error if user is not owner', async () => {
      const photoId = 'photo-123';
      const userId = 'user-123';
      const otherUserId = 'user-456';
      const mockPhoto = {
        id: photoId,
        userId: otherUserId,
        filename: 'photo-123.jpg',
        originalName: 'test.jpg',
        mimeType: 'image/jpeg',
        size: 1024,
        url: '/uploads/photos/photo-123.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.photo.findUnique.mockResolvedValue(mockPhoto as any);

      await expect(deletePhoto(photoId, userId)).rejects.toThrow(
        'Unauthorized: You can only delete your own photos'
      );

      expect(deleteFile).not.toHaveBeenCalled();
      expect(mockPrisma.photo.delete).not.toHaveBeenCalled();
    });
  });
});

import { prisma } from '../config/database';
import { deleteFile } from '../utils/helpers/file.helper';

export interface PhotoData {
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export const uploadPhoto = async (photoData: PhotoData) => {
  const photo = await prisma.photo.create({
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

  return photo;
};

export const getPhotoById = async (id: string) => {
  const photo = await prisma.photo.findUnique({
    where: { id },
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

  return photo;
};

export const getUserPhotos = async (userId: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [photos, total] = await Promise.all([
    prisma.photo.findMany({
      where: { userId },
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
      skip,
      take: limit,
    }),
    prisma.photo.count({
      where: { userId },
    }),
  ]);

  return {
    photos,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAllPhotos = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [photos, total] = await Promise.all([
    prisma.photo.findMany({
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
      skip,
      take: limit,
    }),
    prisma.photo.count(),
  ]);

  return {
    photos,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const deletePhoto = async (id: string, userId: string): Promise<boolean> => {
  const photo = await prisma.photo.findUnique({
    where: { id },
  });

  if (!photo) {
    return false;
  }

  if (photo.userId !== userId) {
    throw new Error('Unauthorized: You can only delete your own photos');
  }

  await deleteFile(photo.filename);

  await prisma.photo.delete({
    where: { id },
  });

  return true;
};

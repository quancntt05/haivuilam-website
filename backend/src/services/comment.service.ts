import { prisma } from '../config/database';
import { sanitizeCommentContent } from '../utils/validators/comment.validator';

export interface CreateCommentData {
  photoId: string;
  userId: string;
  content: string;
}

export interface UpdateCommentData {
  content: string;
}

export const createComment = async (data: CreateCommentData) => {
  const sanitizedContent = sanitizeCommentContent(data.content);

  const comment = await prisma.comment.create({
    data: {
      photoId: data.photoId,
      userId: data.userId,
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

  return comment;
};

export const getCommentsByPhotoId = async (
  photoId: string,
  page: number = 1,
  limit: number = 50
) => {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
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
      skip,
      take: limit,
    }),
    prisma.comment.count({
      where: { photoId },
    }),
  ]);

  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getCommentById = async (id: string) => {
  const comment = await prisma.comment.findUnique({
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
      photo: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  return comment;
};

export const updateComment = async (id: string, userId: string, data: UpdateCommentData) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    return null;
  }

  if (comment.userId !== userId) {
    throw new Error('Unauthorized: You can only update your own comments');
  }

  const sanitizedContent = sanitizeCommentContent(data.content);

  const updatedComment = await prisma.comment.update({
    where: { id },
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

  return updatedComment;
};

export const deleteComment = async (id: string, userId: string): Promise<boolean> => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });

  if (!comment) {
    return false;
  }

  if (comment.userId !== userId) {
    throw new Error('Unauthorized: You can only delete your own comments');
  }

  await prisma.comment.delete({
    where: { id },
  });

  return true;
};

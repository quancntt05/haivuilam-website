import { ApiResponse } from '@/types';
import { Comment, CommentListResponse, CommentCreate, CommentUpdate } from '@/types/comment.types';
import { PaginationParams } from '@/types';

export const commentApi = {
  async getCommentsByPhotoId(
    photoId: string,
    params?: PaginationParams
  ): Promise<CommentListResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('photoId', photoId);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const url = `/api/comments?${searchParams.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }

    const data: ApiResponse<CommentListResponse> = await response.json();
    return data.data || { comments: [], pagination: { page: 1, limit: 50, total: 0, totalPages: 0 } };
  },

  async createComment(data: CommentCreate, accessToken: string): Promise<Comment> {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create comment');
    }

    const result: ApiResponse<Comment> = await response.json();
    if (!result.data) {
      throw new Error('Comment creation failed');
    }
    return result.data;
  },

  async updateComment(id: string, data: CommentUpdate, accessToken: string): Promise<Comment> {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update comment');
    }

    const result: ApiResponse<Comment> = await response.json();
    if (!result.data) {
      throw new Error('Comment update failed');
    }
    return result.data;
  },

  async deleteComment(id: string, accessToken: string): Promise<void> {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete comment');
    }
  },
};


'use client';

import { useState, useCallback } from 'react';
import { commentApi } from '@/lib/api/comment.api';
import { Comment, CommentListResponse, CommentCreate, CommentUpdate } from '@/types/comment.types';
import { PaginationParams } from '@/types';
import { useAuth } from './useAuth';

export function useComments() {
  const { accessToken } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(
    async (photoId: string, params?: PaginationParams) => {
      setLoading(true);
      setError(null);
      try {
        const data = await commentApi.getCommentsByPhotoId(photoId, params);
        setComments(data.comments);
        setPagination(data.pagination);
        return data;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch comments');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createComment = useCallback(
    async (data: CommentCreate) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      setLoading(true);
      setError(null);
      try {
        const newComment = await commentApi.createComment(data, accessToken);
        setComments(prev => [...prev, newComment]);
        return newComment;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create comment');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  const updateComment = useCallback(
    async (id: string, data: CommentUpdate) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      setLoading(true);
      setError(null);
      try {
        const updatedComment = await commentApi.updateComment(id, data, accessToken);
        setComments(prev => prev.map(c => (c.id === id ? updatedComment : c)));
        return updatedComment;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update comment');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  const deleteComment = useCallback(
    async (id: string) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      setLoading(true);
      setError(null);
      try {
        await commentApi.deleteComment(id, accessToken);
        setComments(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete comment');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  return {
    comments,
    pagination,
    loading,
    error,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
  };
}


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

      // Optimistic update
      const optimisticComment: Comment = {
        id: `temp-${Date.now()}`,
        photoId: data.photoId,
        userId: 'temp',
        content: data.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        user: undefined,
      };

      setComments(prev => [...prev, optimisticComment]);
      setLoading(true);
      setError(null);

      try {
        const newComment = await commentApi.createComment(data, accessToken);
        // Replace optimistic comment with real one
        setComments(prev => prev.map(c => (c.id === optimisticComment.id ? newComment : c)));
        return newComment;
      } catch (err) {
        // Rollback optimistic update
        setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
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

      // Optimistic update
      const originalComment = comments.find(c => c.id === id);
      if (originalComment) {
        setComments(prev =>
          prev.map(c =>
            c.id === id
              ? { ...c, content: data.content, updatedAt: new Date().toISOString() }
              : c
          )
        );
      }

      setLoading(true);
      setError(null);

      try {
        const updatedComment = await commentApi.updateComment(id, data, accessToken);
        setComments(prev => prev.map(c => (c.id === id ? updatedComment : c)));
        return updatedComment;
      } catch (err) {
        // Rollback optimistic update
        if (originalComment) {
          setComments(prev => prev.map(c => (c.id === id ? originalComment : c)));
        }
        const error = err instanceof Error ? err : new Error('Failed to update comment');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, comments]
  );

  const deleteComment = useCallback(
    async (id: string) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      // Optimistic update
      const originalComment = comments.find(c => c.id === id);
      setComments(prev => prev.filter(c => c.id !== id));

      setLoading(true);
      setError(null);

      try {
        await commentApi.deleteComment(id, accessToken);
      } catch (err) {
        // Rollback optimistic update
        if (originalComment) {
          setComments(prev => [...prev, originalComment]);
        }
        const error = err instanceof Error ? err : new Error('Failed to delete comment');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, comments]
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

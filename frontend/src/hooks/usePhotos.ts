'use client';

import { useState, useCallback } from 'react';
import { photoApi } from '@/lib/api/photo.api';
import { Photo, PhotoListResponse, PhotoDetail } from '@/types/photo.types';
import { PaginationParams } from '@/types';
import { useAuth } from './useAuth';

export function usePhotos() {
  const { accessToken } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photo, setPhoto] = useState<PhotoDetail | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPhotos = useCallback(async (params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await photoApi.getPhotos(params);
      setPhotos(data.photos);
      setPagination(data.pagination);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch photos');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPhotoById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await photoApi.getPhotoById(id);
      setPhoto(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch photo');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserPhotos = useCallback(async (userId: string, params?: PaginationParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await photoApi.getUserPhotos(userId, params);
      setPhotos(data.photos);
      setPagination(data.pagination);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch user photos');
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadPhoto = useCallback(
    async (file: File) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      setLoading(true);
      setError(null);
      try {
        const newPhoto = await photoApi.uploadPhoto(file, accessToken);
        setPhotos(prev => [newPhoto, ...prev]);
        return newPhoto;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to upload photo');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  const deletePhoto = useCallback(
    async (id: string) => {
      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      setLoading(true);
      setError(null);
      try {
        await photoApi.deletePhoto(id, accessToken);
        setPhotos(prev => prev.filter(p => p.id !== id));
        if (photo?.id === id) {
          setPhoto(null);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete photo');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [accessToken, photo]
  );

  return {
    photos,
    photo,
    pagination,
    loading,
    error,
    fetchPhotos,
    getPhotoById,
    getUserPhotos,
    uploadPhoto,
    deletePhoto,
  };
}

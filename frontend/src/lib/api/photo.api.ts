import { ApiResponse } from '@/types';
import { Photo, PhotoListResponse, PhotoDetail } from '@/types/photo.types';
import { PaginationParams } from '@/types';

export const photoApi = {
  async getPhotos(params?: PaginationParams): Promise<PhotoListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const url = `/api/photos${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }

    const data: ApiResponse<PhotoListResponse> = await response.json();
    return data.data || { photos: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  async getPhotoById(id: string): Promise<PhotoDetail> {
    const response = await fetch(`/api/photos/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch photo');
    }

    const data: ApiResponse<PhotoDetail> = await response.json();
    if (!data.data) {
      throw new Error('Photo not found');
    }
    return data.data;
  },

  async getUserPhotos(userId: string, params?: PaginationParams): Promise<PhotoListResponse> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const url = `/api/photos/user/${userId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch user photos');
    }

    const data: ApiResponse<PhotoListResponse> = await response.json();
    return data.data || { photos: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } };
  },

  async uploadPhoto(file: File, accessToken: string): Promise<Photo> {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await fetch('/api/photos/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload photo');
    }

    const data: ApiResponse<Photo> = await response.json();
    if (!data.data) {
      throw new Error('Upload failed');
    }
    return data.data;
  },

  async deletePhoto(id: string, accessToken: string): Promise<void> {
    const response = await fetch(`/api/photos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete photo');
    }
  },
};

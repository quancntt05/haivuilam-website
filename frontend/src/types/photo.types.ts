import { User } from './auth.types';
import { Comment } from './comment.types';

export interface Photo {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  _count?: {
    comments: number;
  };
}

export interface PhotoUpload {
  photo: File;
}

export interface PhotoCreate {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

export interface PhotoListResponse {
  photos: Photo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PhotoDetail extends Photo {
  comments?: Comment[];
}

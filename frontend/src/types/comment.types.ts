import { User } from './auth.types';

export interface Comment {
  id: string;
  photoId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  photo?: {
    id: string;
    url: string;
  };
}

export interface CommentCreate {
  photoId: string;
  content: string;
}

export interface CommentUpdate {
  content: string;
}

export interface CommentListResponse {
  comments: Comment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

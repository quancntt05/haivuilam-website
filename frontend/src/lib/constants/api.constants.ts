export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  AUTH: {
    GOOGLE_CALLBACK: `/api/${API_VERSION}/auth/google/callback`,
    REFRESH: `/api/${API_VERSION}/auth/refresh`,
    LOGOUT: `/api/${API_VERSION}/auth/logout`,
  },
  PHOTOS: {
    BASE: `/api/${API_VERSION}/photos`,
    UPLOAD: `/api/${API_VERSION}/photos/upload`,
    BY_ID: (id: string) => `/api/${API_VERSION}/photos/${id}`,
    BY_USER: (userId: string) => `/api/${API_VERSION}/photos/user/${userId}`,
  },
  COMMENTS: {
    BASE: `/api/${API_VERSION}/comments`,
    BY_PHOTO: (photoId: string) =>
      `/api/${API_VERSION}/comments/photo/${photoId}`,
    BY_ID: (id: string) => `/api/${API_VERSION}/comments/${id}`,
  },
} as const;


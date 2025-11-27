import { Session as NextAuthSession, User as NextAuthUser } from 'next-auth';

export interface User extends NextAuthUser {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

export interface Session extends NextAuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
  error?: string;
}

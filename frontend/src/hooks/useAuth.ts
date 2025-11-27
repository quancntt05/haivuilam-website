'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { Session } from '@/types/auth.types';

export function useAuth() {
  const { data: session, status } = useSession();

  const user = session?.user;
  const accessToken = session?.accessToken;
  const refreshToken = session?.refreshToken;

  const login = () => {
    signIn('google', { callbackUrl: '/' });
  };

  const logout = async () => {
    if (accessToken) {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        await fetch(`${API_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    signOut({ callbackUrl: '/login' });
  };

  return {
    user,
    session: (session as Session) || null,
    accessToken,
    refreshToken,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login,
    logout,
  };
}


import { User } from '@/types/auth.types';

export const authApi = {
  async getSession(): Promise<User | null> {
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
      return session?.user || null;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
};

import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { API_BASE_URL, API_ENDPOINTS } from '@/lib/constants/api.constants';
import { AuthResponse } from '@/types/auth.types';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        try {
          const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.GOOGLE_CALLBACK}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name || '',
              image: user.image || null,
              providerId: account.providerAccountId,
            }),
          });

          const data: AuthResponse = await response.json();

          if (data.success && data.data) {
            user.id = data.data.user.id;
            user.accessToken = data.data.accessToken;
            user.refreshToken = data.data.refreshToken;
            return true;
          }

          return false;
        } catch (error) {
          console.error('Sign in error:', error);
          return false;
        }
      }
      return false;
    },
    async jwt({ token, user }) {
      if (user && user.accessToken) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.userId = user.id;
        token.email = user.email || undefined;
        token.name = user.name || undefined;
        token.image = user.image || undefined;
        token.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
      }

      if (token.refreshToken && token.expiresAt && Date.now() > token.expiresAt) {
        try {
          const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              refreshToken: token.refreshToken,
            }),
          });

          const data = await response.json();

          if (data.success && data.data) {
            token.accessToken = data.data.accessToken;
            token.refreshToken = data.data.refreshToken;
            token.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
          }
        } catch (error) {
          console.error('Token refresh error:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user && token.userId) {
        session.accessToken = token.accessToken;
        session.refreshToken = token.refreshToken;
        session.user.id = token.userId;
        session.user.email = token.email || '';
        session.user.name = token.name || '';
        session.user.image = typeof token.image === 'string' ? token.image : '';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

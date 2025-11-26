import { prisma } from '../config/database';
import { generateTokens, TokenPair, verifyAccessToken } from '../utils/helpers/jwt.helper';

export interface GoogleUserData {
  email: string;
  name: string;
  image?: string;
  providerId: string;
}

export const findOrCreateUser = async (
  googleData: GoogleUserData
): Promise<{ id: string; email: string; name: string | null }> => {
  const user = await prisma.user.upsert({
    where: { providerId: googleData.providerId },
    update: {
      email: googleData.email,
      name: googleData.name,
      image: googleData.image,
    },
    create: {
      email: googleData.email,
      name: googleData.name,
      image: googleData.image,
      provider: 'google',
      providerId: googleData.providerId,
    },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
};

export const generateUserTokens = (userId: string, email: string): TokenPair => {
  return generateTokens({ userId, email });
};

export const verifyToken = (token: string): { userId: string; email: string } | null => {
  try {
    return verifyAccessToken(token);
  } catch {
    return null;
  }
};

import {
  findOrCreateUser,
  generateUserTokens,
  verifyToken,
} from '../../../src/services/auth.service';
import { prisma } from '../../../src/config/database';
import { generateTokens, verifyAccessToken } from '../../../src/utils/helpers/jwt.helper';
import { MockPrisma } from '../../helpers/prisma-mock';

jest.mock('../../../src/config/database');
jest.mock('../../../src/utils/helpers/jwt.helper');

const mockPrisma = prisma as unknown as MockPrisma;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreateUser', () => {
    it('should create a new user if not exists', async () => {
      const googleData = {
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/image.jpg',
        providerId: 'google-123',
      };

      const mockUser = {
        id: 'user-123',
        email: googleData.email,
        name: googleData.name,
        image: googleData.image,
        provider: 'google',
        providerId: googleData.providerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.upsert.mockResolvedValue(mockUser as any);

      const result = await findOrCreateUser(googleData);

      expect(mockPrisma.user.upsert).toHaveBeenCalledWith({
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

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
      });
    });

    it('should update existing user if providerId exists', async () => {
      const googleData = {
        email: 'updated@example.com',
        name: 'Updated User',
        image: 'https://example.com/new-image.jpg',
        providerId: 'google-123',
      };

      const mockUser = {
        id: 'user-123',
        email: googleData.email,
        name: googleData.name,
        image: googleData.image,
        provider: 'google',
        providerId: googleData.providerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.user.upsert.mockResolvedValue(mockUser as any);

      const result = await findOrCreateUser(googleData);

      expect(mockPrisma.user.upsert).toHaveBeenCalled();
      expect(result.email).toBe(googleData.email);
      expect(result.name).toBe(googleData.name);
    });
  });

  describe('generateUserTokens', () => {
    it('should generate access and refresh tokens', () => {
      const userId = 'user-123';
      const email = 'test@example.com';
      const mockTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };

      (generateTokens as jest.Mock).mockReturnValue(mockTokens);

      const result = generateUserTokens(userId, email);

      expect(generateTokens).toHaveBeenCalledWith({ userId, email });
      expect(result).toEqual(mockTokens);
    });
  });

  describe('verifyToken', () => {
    it('should verify and return token payload for valid token', () => {
      const token = 'valid-token';
      const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
      };

      (verifyAccessToken as jest.Mock).mockReturnValue(mockPayload);

      const result = verifyToken(token);

      expect(verifyAccessToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockPayload);
    });

    it('should return null for invalid token', () => {
      const token = 'invalid-token';

      (verifyAccessToken as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = verifyToken(token);

      expect(result).toBeNull();
    });
  });
});

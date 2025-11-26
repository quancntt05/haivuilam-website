import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt';

export interface TokenPayload {
  userId: string;
  email: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

const getSecret = (): string => {
  if (!jwtConfig.secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwtConfig.secret;
};

const getRefreshSecret = (): string => {
  if (!jwtConfig.refreshSecret) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }
  return jwtConfig.refreshSecret;
};

export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = getSecret();
  return jwt.sign(payload, secret, {
    expiresIn: jwtConfig.expiresIn,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = getRefreshSecret();
  return jwt.sign(payload, secret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  } as jwt.SignOptions);
};

export const generateTokens = (payload: TokenPayload): TokenPair => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, getSecret()) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, getRefreshSecret()) as TokenPayload;
};

import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export interface TokenPayload {
  sub: string; // user id
}

export function signAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessTtl,
  } as SignOptions);
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshTtl,
  } as SignOptions);
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwt.accessSecret) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwt.refreshSecret) as TokenPayload;
}

export function issueTokens(userId: string) {
  return {
    accessToken: signAccessToken(userId),
    refreshToken: signRefreshToken(userId),
  };
}

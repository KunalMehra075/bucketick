import dotenv from 'dotenv';

dotenv.config();

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  mongoUri: required('MONGODB_URI'),
  port: Number(process.env.PORT ?? 8090),
  jwt: {
    accessSecret: required('JWT_ACCESS_SECRET', 'dev_access_secret'),
    refreshSecret: required('JWT_REFRESH_SECRET', 'dev_refresh_secret'),
    accessTtl: process.env.ACCESS_TOKEN_TTL ?? '15m',
    refreshTtl: process.env.REFRESH_TOKEN_TTL ?? '30d',
  },
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  isProd: process.env.NODE_ENV === 'production',
};

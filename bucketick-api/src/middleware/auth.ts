import { NextFunction, Request, Response } from 'express';
import { unauthorized } from '../utils/http';
import { verifyAccessToken } from '../utils/tokens';

// Attach the authenticated user id to the request object.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(unauthorized('Missing bearer token'));
  }
  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    next();
  } catch {
    next(unauthorized('Invalid or expired token'));
  }
}

import { NextFunction, Request, Response } from 'express';

/** Wraps success payloads in the { data } envelope the frontend expects. */
export function ok<T>(res: Response, data: T, status = 200): Response {
  return res.status(status).json({ data });
}

/** A typed API error the error handler turns into a JSON body. */
export class ApiError extends Error {
  status: number;
  errorCode?: string;
  details?: unknown;
  constructor(status: number, message: string, errorCode?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
    this.details = details;
  }
}

export const badRequest = (msg: string, details?: unknown) =>
  new ApiError(400, msg, 'bad_request', details);
export const unauthorized = (msg = 'Not authenticated') => new ApiError(401, msg, 'unauthorized');
export const forbidden = (msg = 'Not allowed') => new ApiError(403, msg, 'forbidden');
export const notFound = (msg = 'Not found') => new ApiError(404, msg, 'not_found');
export const conflict = (msg: string) => new ApiError(409, msg, 'conflict');

/** Removes the try/catch boilerplate from async route handlers. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
}

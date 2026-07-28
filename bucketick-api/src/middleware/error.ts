import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/http';

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ message: 'Route not found', errorCode: 'not_found' });
}

/** Final error handler. Turns everything into the frontend's error shape. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      message: err.message,
      errorCode: err.errorCode,
      details: err.details,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      errorCode: 'validation_error',
      details: err.flatten(),
    });
    return;
  }

  // Mongo duplicate key.
  if (typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000) {
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue ?? {})[0];
    res.status(409).json({
      message: field ? `That ${field} is already taken` : 'Duplicate value',
      errorCode: 'conflict',
    });
    return;
  }

  // eslint-disable-next-line no-console
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Something went wrong', errorCode: 'internal_error' });
}

import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../types';
import { isDevelopment } from '../config';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string | undefined;
  public readonly details?: unknown;

  constructor(message: string, statusCode = 500, code?: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}

// Converts all errors into consistent API response format
export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response<ApiResponse>,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code: string | undefined;
  let details: unknown;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = error.code;
    details = error.details;
  }

  if (isDevelopment) {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      statusCode,
      code,
      details,
      url: req.url,
      method: req.method,
    });
  }

  const response: ApiResponse = {
    success: false,
    error: {
      message,
      ...(code && { code }),
      ...(isDevelopment && { details: error.stack }),
    },
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  _res: Response<ApiResponse>,
  next: NextFunction
): void => {
  const error = new AppError(
    `Route ${req.method} ${req.originalUrl} not found`,
    404,
    'ROUTE_NOT_FOUND'
  );
  next(error);
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 
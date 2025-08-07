import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

/**
 * Global error handler middleware
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error occurred:', error);

  const apiError: ApiError = {
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    statusCode: 500,
  };

  res.status(apiError.statusCode).json(apiError);
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  const apiError: ApiError = {
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
  };

  res.status(apiError.statusCode).json(apiError);
}
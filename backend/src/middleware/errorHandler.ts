import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../types';

export const errorHandler = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error('Error:', err);

  // Default error values
  let status = 500;
  let message = 'Internal server error';
  let details = undefined;

  // Handle custom errors
  if (err instanceof CustomError) {
    status = err.status;
    message = err.message;
    details = err.details;
  } else if (err instanceof Error) {
    message = err.message;
  }

  // Send error response
  res.status(status).json({
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === 'development' && details && { details }),
      timestamp: new Date().toISOString(),
    },
  });
};

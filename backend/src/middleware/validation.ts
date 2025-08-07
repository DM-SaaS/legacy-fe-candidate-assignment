import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../types';

/**
 * Middleware to validate JSON request body exists
 */
export function validateJsonBody(req: Request, res: Response, next: NextFunction): void {
  if (req.method === 'POST' && !req.body) {
    const error: ApiError = {
      error: 'Bad Request',
      message: 'Request body is required',
      statusCode: 400,
    };
    res.status(error.statusCode).json(error);
    return;
  }
  
  next();
}

/**
 * Middleware to validate content type for POST requests
 */
export function validateContentType(req: Request, res: Response, next: NextFunction): void {
  if (req.method === 'POST') {
    const contentType = req.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const error: ApiError = {
        error: 'Bad Request',
        message: 'Content-Type must be application/json',
        statusCode: 400,
      };
      res.status(error.statusCode).json(error);
      return;
    }
  }
  
  next();
}
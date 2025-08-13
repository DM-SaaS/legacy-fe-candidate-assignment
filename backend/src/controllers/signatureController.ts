import { Request, Response } from 'express';
import { verifyMessageSignature, validateSignatureRequest } from '../utils/signatureVerifier';
import { ApiError, HealthCheckResponse } from '../types';

/**
 * Controller for verifying message signatures
 */
export class SignatureController {
  /**
   * Health check endpoint
   */
  static async healthCheck(req: Request, res: Response): Promise<void> {
    const response: HealthCheckResponse = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
    
    res.json(response);
  }

  /**
   * Verify a message signature
   * POST /verify-signature
   */
  static async verifySignature(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body structure
      if (!validateSignatureRequest(req.body)) {
        const error: ApiError = {
          error: 'Bad Request',
          message: 'Invalid request body. Expected: { message: string, signature: string }',
          statusCode: 400,
        };
        res.status(error.statusCode).json(error);
        return;
      }

      const { message, signature } = req.body;

      // Additional validation for empty strings
      if (message.trim().length === 0) {
        const error: ApiError = {
          error: 'Bad Request',
          message: 'Message cannot be empty',
          statusCode: 400,
        };
        res.status(error.statusCode).json(error);
        return;
      }

      if (signature.trim().length === 0) {
        const error: ApiError = {
          error: 'Bad Request',
          message: 'Signature cannot be empty',
          statusCode: 400,
        };
        res.status(error.statusCode).json(error);
        return;
      }

      // Verify the signature (trim whitespace from inputs)
      const result = await verifyMessageSignature(message.trim(), signature.trim());

      // Return the result
      res.json(result);
    } catch (error) {
      console.error('Error in verifySignature controller:', error);
      
      const apiError: ApiError = {
        error: 'Internal Server Error',
        message: 'Failed to verify signature',
        statusCode: 500,
      };
      
      res.status(apiError.statusCode).json(apiError);
    }
  }
}
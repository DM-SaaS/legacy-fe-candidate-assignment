import type { Request, Response } from 'express';
import { SignatureService } from '../services/signatureService';
import type { ApiResponse, SignatureVerificationResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

export class SignatureController {
  private signatureService: SignatureService;

  constructor() {
    this.signatureService = new SignatureService();
  }

  verifySignature = async (
    req: Request,
    res: Response<ApiResponse<SignatureVerificationResponse>>
  ): Promise<void> => {
    const { message, signature } = req.body;

    if (!this.signatureService.isValidSignatureFormat(signature)) {
      throw new AppError(
        'Signature format is invalid. Need 0x followed by 130 hex characters.',
        400,
        'INVALID_SIGNATURE_FORMAT'
      );
    }

    try {
      const result = await this.signatureService.verifySignature(message, signature);

      const response: ApiResponse<SignatureVerificationResponse> = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      throw new AppError(
        'Something went wrong verifying the signature',
        500,
        'SIGNATURE_VERIFICATION_ERROR',
        error
      );
    }
  };

  healthCheck = async (
    _req: Request,
    res: Response<ApiResponse<{ status: string; timestamp: string }>>
  ): Promise<void> => {
    const response: ApiResponse<{ status: string; timestamp: string }> = {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  };
} 
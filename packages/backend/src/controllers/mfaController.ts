import type { Request, Response } from 'express';
import { MfaService } from '../services/mfaService';
import type { ApiResponse, TotpSetup, MfaValidationResult, MfaTimeRemainingResult } from '../types';
import { AppError } from '../middleware/errorHandler';

export class MfaController {
  private mfaService: MfaService;

  constructor() {
    this.mfaService = new MfaService();
  }

  generateSetup = async (
    req: Request,
    res: Response<ApiResponse<TotpSetup>>
  ): Promise<void> => {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      throw new AppError(
        'Email address is required',
        400,
        'MISSING_EMAIL'
      );
    }

    try {
      const setup = await this.mfaService.generateSetup(email);

      const response: ApiResponse<TotpSetup> = {
        success: true,
        data: setup,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      throw new AppError(
        'Failed to generate MFA setup',
        500,
        'MFA_SETUP_ERROR',
        error
      );
    }
  };

  validateToken = async (
    req: Request,
    res: Response<ApiResponse<MfaValidationResult>>
  ): Promise<void> => {
    const { token, secret } = req.body;

    if (!token || typeof token !== 'string') {
      throw new AppError(
        'Token is required',
        400,
        'MISSING_TOKEN'
      );
    }

    if (!secret || typeof secret !== 'string') {
      throw new AppError(
        'Secret is required',
        400,
        'MISSING_SECRET'
      );
    }

    try {
      const result = this.mfaService.validateToken(token, secret);

      const response: ApiResponse<MfaValidationResult> = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      throw new AppError(
        'Failed to validate MFA token',
        500,
        'MFA_VALIDATION_ERROR',
        error
      );
    }
  };

  validateTokenWithWindow = async (
    req: Request,
    res: Response<ApiResponse<MfaValidationResult>>
  ): Promise<void> => {
    const { token, secret, windowSize } = req.body;

    if (!token || typeof token !== 'string') {
      throw new AppError(
        'Token is required',
        400,
        'MISSING_TOKEN'
      );
    }

    if (!secret || typeof secret !== 'string') {
      throw new AppError(
        'Secret is required',
        400,
        'MISSING_SECRET'
      );
    }

    try {
      const result = this.mfaService.validateTokenWithWindow(
        token, 
        secret, 
        windowSize || 1
      );

      const response: ApiResponse<MfaValidationResult> = {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      throw new AppError(
        'Failed to validate MFA token with window',
        500,
        'MFA_VALIDATION_ERROR',
        error
      );
    }
  };

  getTimeRemaining = async (
    _req: Request,
    res: Response<ApiResponse<MfaTimeRemainingResult>>
  ): Promise<void> => {
    try {
      const timeRemaining = MfaService.getTimeRemaining();

      const response: ApiResponse<MfaTimeRemainingResult> = {
        success: true,
        data: { timeRemaining },
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (error) {
      throw new AppError(
        'Failed to get time remaining',
        500,
        'MFA_TIME_ERROR',
        error
      );
    }
  };
} 
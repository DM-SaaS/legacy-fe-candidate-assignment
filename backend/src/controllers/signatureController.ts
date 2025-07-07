import { Request, Response, NextFunction } from 'express';
import { SignatureService } from '../services/signatureService';
import { VerifySignatureRequest } from '../types';

export class SignatureController {
  /**
   * POST /verify-signature
   * Verifies an Ethereum signature
   */
  static async verifySignature(
    req: Request<{}, {}, VerifySignatureRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await SignatureService.verifySignature(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

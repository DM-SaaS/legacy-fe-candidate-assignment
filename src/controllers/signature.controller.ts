import { Request, Response } from 'express';
import { verifyMessage } from 'ethers';

export class SignatureController {
  public async verifySignature(req: Request, res: Response): Promise<void> {
    try {
      const { message, signature } = req.body;

      if (!message || !signature) {
        res.status(400).json({ error: 'Message and signature are required' });
        return;
      }

      const signer = verifyMessage(message, signature);

      res.json({
        isValid: true,
        signer,
        originalMessage: message,
      });
    } catch (error) {
      res.status(400).json({
        isValid: false,
        error: `Invalid signature ${error}`,
      });
    }
  }
}

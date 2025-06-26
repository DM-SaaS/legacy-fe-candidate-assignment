import { Request, Response, NextFunction } from 'express';
import { VerifySignatureDTO } from '../dtos/verifySignatureDTO';

export const validateRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { message, signature } = req.body;

  // Manual validation logic
  if (!message || typeof message !== 'string') {
    return res
      .status(400)
      .json({ error: 'Invalid or missing "message" field.' });
  }

  if (!signature || typeof signature !== 'string') {
    return res
      .status(400)
      .json({ error: 'Invalid or missing "signature" field.' });
  }

  // Attach validated DTO to request object
  const dto: VerifySignatureDTO = { message, signature };
  req.body = dto;

  next();
};

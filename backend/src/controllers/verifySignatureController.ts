import { Response } from 'express';
import { CustomRequest, VerifySignatureDTO } from '../dtos';
import { getSignaturesBasedOnUsersService, verifySignatureService } from '../services';

export const verifySignatureController = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  try {
    const { message, signature } = req.body;
    const result = verifySignatureService(
      { message, signature } as VerifySignatureDTO,
      req?.email,
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSignaturesBasedOnUsers = async (
  req: CustomRequest,
  res: Response,
): Promise<void> => {
  const email = req?.email;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const result = await getSignaturesBasedOnUsersService(email);
  res.json(result);
};

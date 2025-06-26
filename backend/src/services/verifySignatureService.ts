import { VerifySignatureDTO } from '../dtos/verifySignatureDTO';
import { hashMessage, recoverAddress } from 'ethers';
import { logger } from './logService';

// Store users data in a mock Database Map
const usersSignaturesDb = new Map<
  string,
  { originalMessage: string; signedMessage: string }[]
>();

export const verifySignatureService = async (
  dto: VerifySignatureDTO,
  email: string,
): Promise<{
  isValid: boolean;
  signer: string;
  originalMessage: string;
}> => {

  logger.info(`Generating HASH for message: ${dto.message}`);
  const messageHash = hashMessage(dto.message);
  
  logger.info(`Recovering address from signature: ${dto.signature}`);
  const signer = recoverAddress(messageHash, dto.signature);

  const existingSignatures = usersSignaturesDb.get(email) || [];
  usersSignaturesDb.set(email, [
    ...existingSignatures,
    { originalMessage: dto.message, signedMessage: dto.signature },
  ]);

  return {
    isValid: !!signer,
    signer,
    originalMessage: dto.message,
  };
};

export const getSignaturesBasedOnUsersService = (email: string) => {
  const signatures = usersSignaturesDb.get(email);
  return signatures ?? [];
};

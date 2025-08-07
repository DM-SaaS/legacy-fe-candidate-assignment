import { ethers } from 'ethers';
import { VerifySignatureRequest, VerifySignatureResponse } from '../types';

/**
 * Verifies an Ethereum message signature and recovers the signer address
 * @param message - The original message that was signed
 * @param signature - The signature to verify
 * @returns Promise containing verification result with signer address
 */
export async function verifyMessageSignature(
  message: string,
  signature: string
): Promise<VerifySignatureResponse> {
  try {
    // Validate inputs
    if (!message || typeof message !== 'string') {
      return {
        isValid: false,
        signer: null,
        originalMessage: message,
      };
    }

    if (!signature || typeof signature !== 'string') {
      return {
        isValid: false,
        signer: null,
        originalMessage: message,
      };
    }

    // Validate signature format (should be 65 bytes = 130 hex chars + 0x prefix)
    if (!signature.startsWith('0x') || signature.length !== 132) {
      return {
        isValid: false,
        signer: null,
        originalMessage: message,
      };
    }

    // Recover the signer address from the signature
    // This automatically handles the Ethereum signed message prefix
    const recoveredAddress = ethers.verifyMessage(message, signature);

    return {
      isValid: true,
      signer: recoveredAddress.toLowerCase(),
      originalMessage: message,
    };
  } catch (error) {
    // If signature verification fails, it's invalid
    console.error('Signature verification failed:', error);
    return {
      isValid: false,
      signer: null,
      originalMessage: message,
    };
  }
}

/**
 * Validates the structure of a signature verification request
 * @param body - The request body to validate
 * @returns boolean indicating if the request is valid
 */
export function validateSignatureRequest(body: any): body is VerifySignatureRequest {
  return (
    body !== null &&
    body !== undefined &&
    typeof body === 'object' &&
    typeof body.message === 'string' &&
    typeof body.signature === 'string' &&
    body.message.length > 0 &&
    body.signature.length > 0
  );
}
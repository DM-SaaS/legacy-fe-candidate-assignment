import { ethers } from 'ethers';
import { CustomError, VerifySignatureRequest, VerifySignatureResponse } from '../types';

export class SignatureService {
  /**
   * Verifies an Ethereum signature
   */
  static async verifySignature(data: VerifySignatureRequest): Promise<VerifySignatureResponse> {
    const { message, signature } = data;

    try {
      // Validate inputs
      if (!message || typeof message !== 'string') {
        throw new CustomError('Invalid message provided', 400);
      }

      if (!signature || typeof signature !== 'string') {
        throw new CustomError('Invalid signature provided', 400);
      }

      // Check if signature is valid hex
      if (!ethers.isHexString(signature)) {
        throw new CustomError('Signature must be a valid hex string', 400);
      }

      // Recover the signer's address
      let recoveredAddress: string;

      try {
        // Try to recover address from the message
        // ethers v6 uses verifyMessage which handles the Ethereum signed message prefix
        recoveredAddress = ethers.verifyMessage(message, signature);
      } catch (error) {
        // If recovery fails, the signature is invalid
        return {
          isValid: false,
          signer: null,
          originalMessage: message,
          timestamp: new Date().toISOString(),
          error: 'Failed to recover signer address',
        };
      }

      // Validate that we got a valid address
      if (!ethers.isAddress(recoveredAddress)) {
        return {
          isValid: false,
          signer: null,
          originalMessage: message,
          timestamp: new Date().toISOString(),
          error: 'Recovered address is invalid',
        };
      }

      // Success - signature is valid
      return {
        isValid: true,
        signer: recoveredAddress.toLowerCase(),
        originalMessage: message,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }

      // Log unexpected errors
      console.error('Signature verification error:', error);

      throw new CustomError(
        'An error occurred while verifying the signature',
        500,
        process.env.NODE_ENV === 'development' ? error : undefined
      );
    }
  }

  /**
   * Validates Ethereum address format
   */
  static isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }

  /**
   * Formats an address with checksum
   */
  static formatAddress(address: string): string {
    try {
      return ethers.getAddress(address);
    } catch {
      return address;
    }
  }
}

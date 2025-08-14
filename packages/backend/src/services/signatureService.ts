import { ethers } from 'ethers';
import type { SignatureVerificationResponse } from '../types';

export class SignatureService {
  // Main signature verification - recovers wallet address from signed message
  async verifySignature(
    message: string,
    signature: string
  ): Promise<SignatureVerificationResponse> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      
      return {
        isValid: true,
        signer: recoveredAddress,
        originalMessage: message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Any ethers error means invalid signature
      return {
        isValid: false,
        signer: null,
        originalMessage: message,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Quick format check before attempting verification
  isValidSignatureFormat(signature: string): boolean {
    return /^0x[a-fA-F0-9]{130}$/.test(signature);
  }

  isValidAddress(address: string): boolean {
    return ethers.isAddress(address);
  }
} 
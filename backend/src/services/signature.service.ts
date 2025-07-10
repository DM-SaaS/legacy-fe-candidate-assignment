import { ethers } from "ethers";
import {
  SignatureVerificationRequest,
  SignatureVerificationResponse,
} from "../types";
import { logger } from "../utils/logger";

export class SignatureService {
  async verifySignature(
    data: SignatureVerificationRequest
  ): Promise<SignatureVerificationResponse> {
    try {
      const { message, signature } = data;

      // Recover the signer address
      const recoveredAddress = ethers.verifyMessage(message, signature);

      logger.info("Signature verified", {
        message:
          message.length > 50 ? message.substring(0, 50) + "..." : message,
        signer: recoveredAddress,
      });

      return {
        isValid: true,
        signer: recoveredAddress,
        originalMessage: message,
        timestamp: Date.now(),
      };
    } catch (error) {
      logger.error("Signature verification failed", { error });

      return {
        isValid: false,
        signer: "",
        originalMessage: data.message,
        timestamp: Date.now(),
      };
    }
  }
}

export const signatureService = new SignatureService();

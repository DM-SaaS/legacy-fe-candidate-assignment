import { recoverMessageAddress } from "viem";
import type { Address } from "../types";
import { IVerifySignatureResponse } from "../types";

export async function verifySignature(
  message: string,
  signature: Address
): Promise<IVerifySignatureResponse> {
  const signer = await recoverMessageAddress({ message, signature });
  return {
    isValid: !!signer,
    signer,
    originalMessage: message,
  };
}

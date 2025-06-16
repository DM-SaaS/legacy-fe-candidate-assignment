export type Address = `0x${string}`;

export interface SignatureVerificationResult {
  isValid: boolean;
  signer: Address;
  message: string;
}

export interface HistoryEntry {
  message: string;
  signature: string;
  result: SignatureVerificationResult;
}

export interface WalletError extends Error {
  code?: number;
}
export interface Props {
  address: `0x${string}`;
}

export interface SignatureVerificationResult {
  isValid: boolean;
  signer: `0x${string}`;
  originalMessage: string;
}

export interface HistoryEntry {
  message: string;
  signature: string;
  result: SignatureVerificationResult;
}

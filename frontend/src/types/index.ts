export interface SignedMessage {
  message: string;
  signature: string;
  timestamp: number;
}

export interface VerificationResult {
  isValid: boolean;
  signer: string | null;
  originalMessage: string;
  isMockSignature?: boolean;
  error?: string;
} 
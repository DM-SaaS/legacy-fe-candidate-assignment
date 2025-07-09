export interface SignatureVerificationRequest {
  message: string;
  signature: string;
}

export interface SignatureVerificationResponse {
  isValid: boolean;
  signer: string;
  originalMessage: string;
  timestamp?: number;
}

export interface SignedMessage {
  id: string;
  message: string;
  signature: string;
  signer: string;
  timestamp: number;
  verified: boolean;
}

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

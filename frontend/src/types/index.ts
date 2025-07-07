export interface SignedMessage {
  id: string;
  message: string;
  signature: string;
  signer: string;
  timestamp: string;
  verified?: boolean;
  verifiedAt?: string;
}

export interface VerifySignatureRequest {
  message: string;
  signature: string;
}

export interface VerifySignatureResponse {
  isValid: boolean;
  signer: string | null;
  originalMessage: string;
  timestamp?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}

export interface User {
  email: string;
  address: string;
  isAuthenticated: boolean;
}

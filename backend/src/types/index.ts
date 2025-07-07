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

export class CustomError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number = 500, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

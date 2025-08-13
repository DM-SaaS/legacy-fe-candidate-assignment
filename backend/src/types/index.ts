export interface VerifySignatureRequest {
  message: string;
  signature: string;
}

export interface VerifySignatureResponse {
  isValid: boolean;
  signer: string | null;
  originalMessage: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface HealthCheckResponse {
  status: 'healthy';
  timestamp: string;
  version: string;
}
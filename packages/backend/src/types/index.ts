export interface SignatureVerificationRequest {
  message: string;
  signature: string;
}

export interface SignatureVerificationResponse {
  isValid: boolean;
  signer: string | null;
  originalMessage: string;
  timestamp: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface ErrorDetails {
  message: string;
  code?: string;
  statusCode: number;
  details?: unknown;
}

// MFA Types
export interface TotpSetup {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
  backupCodes: string[];
}

export interface MfaSetupRequest {
  email: string;
}

export interface MfaValidationRequest {
  token: string;
  secret: string;
  windowSize?: number;
}

export interface MfaValidationResult {
  isValid: boolean;
  timestamp: string;
}

export interface MfaTimeRemainingResult {
  timeRemaining: number;
} 
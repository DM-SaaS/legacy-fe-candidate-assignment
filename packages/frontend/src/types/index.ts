export interface SignatureRequest {
  message: string;
  signature: string;
}

export interface SignatureResponse {
  success: boolean;
  data?: {
    isValid: boolean;
    signer: string | null;
    originalMessage: string;
    timestamp: string;
  };
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface SignedMessage {
  id: string;
  message: string;
  signature: string;
  signer: string | null;
  isValid: boolean;
  timestamp: string;
  verificationResult?: SignatureResponse['data'];
}

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface WalletInfo {
  address: string;
  chainId?: number;
  balance?: string;
}

// Dynamic.xyz wallet interface - compatible with actual Dynamic wallet type
export interface DynamicWallet {
  address: string;
  chain: string;
  publicKey?: string;
  connector: {
    name: string;
    type?: string;
    [key: string]: unknown; // Allow additional properties
  };
  signMessage?: (message: string) => Promise<string>;
  signTransaction?: (transaction: unknown) => Promise<string>;
  [key: string]: unknown; // Allow additional properties from Dynamic
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
}

export interface TotpSetup {
  secret: string;
  qrCodeUrl: string;
  manualEntryKey: string;
  backupCodes: string[];
}

export interface MfaSetupRequest {
  email: string;
}

export interface MfaSetupResponse {
  success: boolean;
  data?: TotpSetup;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  timestamp: string;
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

export interface MfaValidationResponse {
  success: boolean;
  data?: MfaValidationResult;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  timestamp: string;
}

export interface MfaTimeRemainingResponse {
  success: boolean;
  data?: {
    timeRemaining: number;
  };
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  timestamp: string;
} 
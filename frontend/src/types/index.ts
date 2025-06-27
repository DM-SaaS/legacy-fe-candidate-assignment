export interface SignatureVerificationRequest {
    message: string;
    signature: string;
}

export interface SignatureVerificationResponse {
    isValid: boolean;
    signer?: string;
    originalMessage: string;
    error?: string;
}

export interface SignedMessage {
    id: string;
    message: string;
    signature: string;
    timestamp: Date;
    signer?: string;
    isVerified?: boolean;
}

export interface WalletInfo {
    address: string;
    ensName?: string;
    network?: string;
}

export interface ApiError {
    message: string;
    code?: string;
    details?: any;
} 
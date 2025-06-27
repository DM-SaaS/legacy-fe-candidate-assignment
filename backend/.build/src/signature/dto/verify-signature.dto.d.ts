export declare class VerifySignatureDto {
    message: string;
    signature: string;
}
export declare class VerifySignatureResponseDto {
    isValid: boolean;
    signer?: string;
    originalMessage: string;
    error?: string;
}

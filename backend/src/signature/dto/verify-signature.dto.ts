import { IsString, IsNotEmpty } from 'class-validator';

export class VerifySignatureDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsNotEmpty()
    signature: string;
}

export class VerifySignatureResponseDto {
    isValid: boolean;
    signer?: string;
    originalMessage: string;
    error?: string;
} 
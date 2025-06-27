import { VerifySignatureDto, VerifySignatureResponseDto } from './dto/verify-signature.dto';
export declare class SignatureService {
    private readonly logger;
    verifySignature(verifySignatureDto: VerifySignatureDto): Promise<VerifySignatureResponseDto>;
    getMessageHash(message: string): Promise<string>;
}

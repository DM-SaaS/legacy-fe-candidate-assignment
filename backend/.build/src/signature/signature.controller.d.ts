import { SignatureService } from './signature.service';
import { VerifySignatureDto, VerifySignatureResponseDto } from './dto/verify-signature.dto';
export declare class SignatureController {
    private readonly signatureService;
    private readonly logger;
    constructor(signatureService: SignatureService);
    verifySignature(verifySignatureDto: VerifySignatureDto): Promise<VerifySignatureResponseDto>;
    healthCheck(): Promise<{
        status: string;
        timestamp: string;
        service: string;
    }>;
}

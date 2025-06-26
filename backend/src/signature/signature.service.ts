import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { VerifySignatureDto, VerifySignatureResponseDto } from './dto/verify-signature.dto';

@Injectable()
export class SignatureService {
    private readonly logger = new Logger(SignatureService.name);

    async verifySignature(verifySignatureDto: VerifySignatureDto): Promise<VerifySignatureResponseDto> {
        const { message, signature } = verifySignatureDto;

        try {
            this.logger.log(`Verifying signature for message: "${message}"`);

            // Recover the signer address from the signature
            const signerAddress = ethers.verifyMessage(message, signature);

            this.logger.log(`Signature verified successfully. Signer: ${signerAddress}`);

            return {
                isValid: true,
                signer: signerAddress,
                originalMessage: message,
            };
        } catch (error) {
            this.logger.error(`Signature verification failed: ${error.message}`);

            return {
                isValid: false,
                originalMessage: message,
                error: 'Invalid signature or message',
            };
        }
    }

    async getMessageHash(message: string): Promise<string> {
        try {
            // This returns the hash that would be signed
            return ethers.hashMessage(message);
        } catch (error) {
            this.logger.error(`Failed to generate message hash: ${error.message}`);
            throw new Error('Failed to generate message hash');
        }
    }
} 
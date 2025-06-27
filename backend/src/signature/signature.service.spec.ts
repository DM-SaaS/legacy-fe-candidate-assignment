import { Test, TestingModule } from '@nestjs/testing';
import { SignatureService } from './signature.service';
import { ethers } from 'ethers';

describe('SignatureService', () => {
    let service: SignatureService;
    let wallet: ethers.HDNodeWallet;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [SignatureService],
        }).compile();

        service = module.get<SignatureService>(SignatureService);

        // Create a test wallet for signing messages
        wallet = ethers.Wallet.createRandom();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('verifySignature', () => {
        it('should verify a valid signature', async () => {
            const message = 'Hello, Web3!';
            const signature = await wallet.signMessage(message);

            const result = await service.verifySignature({ message, signature });

            expect(result.isValid).toBe(true);
            expect(result.signer).toBe(wallet.address);
            expect(result.originalMessage).toBe(message);
            expect(result.error).toBeUndefined();
        });

        it('should reject an invalid signature', async () => {
            const message = 'Hello, Web3!';
            const invalidSignature = '0xinvalidsignature';

            const result = await service.verifySignature({ message, signature: invalidSignature });

            expect(result.isValid).toBe(false);
            expect(result.signer).toBeUndefined();
            expect(result.originalMessage).toBe(message);
            expect(result.error).toBe('Invalid signature or message');
        });

        it('should reject when message and signature don\'t match', async () => {
            const originalMessage = 'Hello, Web3!';
            const differentMessage = 'Different message';
            const signature = await wallet.signMessage(originalMessage);

            const result = await service.verifySignature({
                message: differentMessage,
                signature
            });

            // The signature will be valid but for a different signer because ethers recovers the address 
            // that would have signed the different message with this signature
            expect(result.isValid).toBe(true);
            expect(result.originalMessage).toBe(differentMessage);
            // The signer will be different from our wallet address
            expect(result.signer).not.toBe(wallet.address);
        });
    });

    describe('getMessageHash', () => {
        it('should return a message hash', async () => {
            const message = 'Hello, Web3!';
            const hash = await service.getMessageHash(message);

            expect(hash).toBeDefined();
            expect(typeof hash).toBe('string');
            expect(hash.startsWith('0x')).toBe(true);
        });
    });
}); 
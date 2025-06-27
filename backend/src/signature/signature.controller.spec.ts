import { Test, TestingModule } from '@nestjs/testing';
import { SignatureController } from './signature.controller';
import { SignatureService } from './signature.service';
import { ethers } from 'ethers';

describe('SignatureController', () => {
    let controller: SignatureController;
    let service: SignatureService;
    let wallet: ethers.HDNodeWallet;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SignatureController],
            providers: [SignatureService],
        }).compile();

        controller = module.get<SignatureController>(SignatureController);
        service = module.get<SignatureService>(SignatureService);
        wallet = ethers.Wallet.createRandom();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('verifySignature', () => {
        it('should verify a valid signature', async () => {
            const message = 'Hello from controller test!';
            const signature = await wallet.signMessage(message);

            const result = await controller.verifySignature({ message, signature });

            expect(result.isValid).toBe(true);
            expect(result.signer).toBe(wallet.address);
            expect(result.originalMessage).toBe(message);
        });

        it('should handle invalid signature', async () => {
            const message = 'Hello from controller test!';
            const invalidSignature = '0xinvalid';

            const result = await controller.verifySignature({
                message,
                signature: invalidSignature
            });

            expect(result.isValid).toBe(false);
            expect(result.error).toBe('Invalid signature or message');
        });
    });
}); 
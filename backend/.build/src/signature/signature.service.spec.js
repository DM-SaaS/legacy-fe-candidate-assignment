"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const signature_service_1 = require("./signature.service");
const ethers_1 = require("ethers");
describe('SignatureService', () => {
    let service;
    let wallet;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [signature_service_1.SignatureService],
        }).compile();
        service = module.get(signature_service_1.SignatureService);
        wallet = ethers_1.ethers.Wallet.createRandom();
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
            expect(result.isValid).toBe(true);
            expect(result.originalMessage).toBe(differentMessage);
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
//# sourceMappingURL=signature.service.spec.js.map
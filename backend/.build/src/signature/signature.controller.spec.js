"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const signature_controller_1 = require("./signature.controller");
const signature_service_1 = require("./signature.service");
const ethers_1 = require("ethers");
describe('SignatureController', () => {
    let controller;
    let service;
    let wallet;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            controllers: [signature_controller_1.SignatureController],
            providers: [signature_service_1.SignatureService],
        }).compile();
        controller = module.get(signature_controller_1.SignatureController);
        service = module.get(signature_service_1.SignatureService);
        wallet = ethers_1.ethers.Wallet.createRandom();
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
    describe('healthCheck', () => {
        it('should return health status', async () => {
            const result = await controller.healthCheck();
            expect(result.status).toBe('ok');
            expect(result.service).toBe('Web3 Signature Verification Backend');
            expect(result.timestamp).toBeDefined();
        });
    });
});
//# sourceMappingURL=signature.controller.spec.js.map
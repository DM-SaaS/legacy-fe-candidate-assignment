"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SignatureService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureService = void 0;
const common_1 = require("@nestjs/common");
const ethers_1 = require("ethers");
let SignatureService = SignatureService_1 = class SignatureService {
    constructor() {
        this.logger = new common_1.Logger(SignatureService_1.name);
    }
    async verifySignature(verifySignatureDto) {
        const { message, signature } = verifySignatureDto;
        try {
            this.logger.log(`Verifying signature for message: "${message}"`);
            const signerAddress = ethers_1.ethers.verifyMessage(message, signature);
            this.logger.log(`Signature verified successfully. Signer: ${signerAddress}`);
            return {
                isValid: true,
                signer: signerAddress,
                originalMessage: message,
            };
        }
        catch (error) {
            this.logger.error(`Signature verification failed: ${error.message}`);
            return {
                isValid: false,
                originalMessage: message,
                error: 'Invalid signature or message',
            };
        }
    }
    async getMessageHash(message) {
        try {
            return ethers_1.ethers.hashMessage(message);
        }
        catch (error) {
            this.logger.error(`Failed to generate message hash: ${error.message}`);
            throw new Error('Failed to generate message hash');
        }
    }
};
exports.SignatureService = SignatureService;
exports.SignatureService = SignatureService = SignatureService_1 = __decorate([
    (0, common_1.Injectable)()
], SignatureService);
//# sourceMappingURL=signature.service.js.map
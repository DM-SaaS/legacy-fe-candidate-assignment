"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SignatureController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureController = void 0;
const common_1 = require("@nestjs/common");
const signature_service_1 = require("./signature.service");
const verify_signature_dto_1 = require("./dto/verify-signature.dto");
let SignatureController = SignatureController_1 = class SignatureController {
    constructor(signatureService) {
        this.signatureService = signatureService;
        this.logger = new common_1.Logger(SignatureController_1.name);
    }
    async verifySignature(verifySignatureDto) {
        this.logger.log('POST /api/verify-signature called');
        return this.signatureService.verifySignature(verifySignatureDto);
    }
    async healthCheck() {
        this.logger.log('GET /api/health called');
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'Web3 Signature Verification Backend',
        };
    }
};
exports.SignatureController = SignatureController;
__decorate([
    (0, common_1.Post)('verify-signature'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_signature_dto_1.VerifySignatureDto]),
    __metadata("design:returntype", Promise)
], SignatureController.prototype, "verifySignature", null);
__decorate([
    (0, common_1.Get)('health'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SignatureController.prototype, "healthCheck", null);
exports.SignatureController = SignatureController = SignatureController_1 = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [signature_service_1.SignatureService])
], SignatureController);
//# sourceMappingURL=signature.controller.js.map
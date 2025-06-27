"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest_1 = __importDefault(require("supertest"));
const ethers_1 = require("ethers");
const app_module_1 = require("./../src/app.module");
describe('AppController (e2e)', () => {
    let app;
    let wallet;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
        wallet = ethers_1.ethers.Wallet.createRandom();
    });
    afterEach(async () => {
        await app.close();
    });
    describe('/api/health (GET)', () => {
        it('should return health status', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/api/health')
                .expect(200)
                .expect((res) => {
                expect(res.body.status).toBe('ok');
                expect(res.body.service).toBe('Web3 Signature Verification Backend');
                expect(res.body.timestamp).toBeDefined();
            });
        });
    });
    describe('/api/verify-signature (POST)', () => {
        it('should verify a valid signature', async () => {
            const message = 'Hello, Web3 e2e test!';
            const signature = await wallet.signMessage(message);
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/api/verify-signature')
                .send({ message, signature })
                .expect(200)
                .expect((res) => {
                expect(res.body.isValid).toBe(true);
                expect(res.body.signer).toBe(wallet.address);
                expect(res.body.originalMessage).toBe(message);
                expect(res.body.error).toBeUndefined();
            });
        });
        it('should reject an invalid signature', () => {
            const message = 'Hello, Web3 e2e test!';
            const invalidSignature = '0xinvalidsignature';
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/api/verify-signature')
                .send({ message, signature: invalidSignature })
                .expect(200)
                .expect((res) => {
                expect(res.body.isValid).toBe(false);
                expect(res.body.signer).toBeUndefined();
                expect(res.body.originalMessage).toBe(message);
                expect(res.body.error).toBe('Invalid signature or message');
            });
        });
        it('should reject request with missing message', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/api/verify-signature')
                .send({ signature: '0x123' })
                .expect(400);
        });
        it('should reject request with missing signature', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/api/verify-signature')
                .send({ message: 'test' })
                .expect(400);
        });
        it('should reject request with empty message', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/api/verify-signature')
                .send({ message: '', signature: '0x123' })
                .expect(400);
        });
        it('should reject request with empty signature', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/api/verify-signature')
                .send({ message: 'test', signature: '' })
                .expect(400);
        });
    });
});
//# sourceMappingURL=app.e2e-spec.js.map
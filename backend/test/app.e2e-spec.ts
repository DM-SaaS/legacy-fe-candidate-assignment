import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { ethers } from 'ethers';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let wallet: ethers.HDNodeWallet;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));

        await app.init();

        // Create a test wallet for signing messages
        wallet = ethers.Wallet.createRandom();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('/api/health (GET)', () => {
        it('should return health status', () => {
            return request(app.getHttpServer())
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

            return request(app.getHttpServer())
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

            return request(app.getHttpServer())
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
            return request(app.getHttpServer())
                .post('/api/verify-signature')
                .send({ signature: '0x123' })
                .expect(400);
        });

        it('should reject request with missing signature', () => {
            return request(app.getHttpServer())
                .post('/api/verify-signature')
                .send({ message: 'test' })
                .expect(400);
        });

        it('should reject request with empty message', () => {
            return request(app.getHttpServer())
                .post('/api/verify-signature')
                .send({ message: '', signature: '0x123' })
                .expect(400);
        });

        it('should reject request with empty signature', () => {
            return request(app.getHttpServer())
                .post('/api/verify-signature')
                .send({ message: 'test', signature: '' })
                .expect(400);
        });
    });
}); 
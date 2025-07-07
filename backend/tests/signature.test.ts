import request from 'supertest';
import express from 'express';
import { ethers } from 'ethers';
import signatureRoutes from '../src/routes/signature';
import { errorHandler } from '../src/middleware/errorHandler';

// Create test app
const app = express();
app.use(express.json());
app.use('/api', signatureRoutes);
app.use(errorHandler);

describe('Signature Verification API', () => {
  let wallet: ethers.Wallet;
  let testMessage: string;
  let testSignature: string;

  beforeAll(async () => {
    // Create a test wallet
    wallet = ethers.Wallet.createRandom();
    testMessage = 'Hello, Web3!';
    testSignature = await wallet.signMessage(testMessage);
  });

  describe('POST /api/verify-signature', () => {
    it('should verify a valid signature', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .send({
          message: testMessage,
          signature: testSignature,
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        isValid: true,
        signer: wallet.address.toLowerCase(),
        originalMessage: testMessage,
      });
      expect(response.body.timestamp).toBeDefined();
    });

    it('should reject an invalid signature', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .send({
          message: testMessage,
          signature: '0x' + 'a'.repeat(130), // Invalid signature
        });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        isValid: false,
        signer: null,
        originalMessage: testMessage,
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Validation failed');
    });

    it('should validate message field', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .send({
          signature: testSignature,
        });

      expect(response.status).toBe(400);
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({
          field: 'message',
          message: 'Message is required',
        })
      );
    });

    it('should validate signature format', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .send({
          message: testMessage,
          signature: 'invalid-signature',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({
          field: 'signature',
          message: 'Signature must be a valid hex string starting with 0x',
        })
      );
    });

    it('should handle very long messages', async () => {
      const longMessage = 'a'.repeat(5000);
      const longSignature = await wallet.signMessage(longMessage);

      const response = await request(app)
        .post('/api/verify-signature')
        .send({
          message: longMessage,
          signature: longSignature,
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      expect(response.body.signer).toBe(wallet.address.toLowerCase());
    });

    it('should reject messages that are too long', async () => {
      const tooLongMessage = 'a'.repeat(10001);

      const response = await request(app)
        .post('/api/verify-signature')
        .send({
          message: tooLongMessage,
          signature: testSignature,
        });

      expect(response.status).toBe(400);
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({
          field: 'message',
          message: 'Message must be between 1 and 10000 characters',
        })
      );
    });
  });
});

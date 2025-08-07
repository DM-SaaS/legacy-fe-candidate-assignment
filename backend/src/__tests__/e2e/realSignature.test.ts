import { ethers } from 'ethers';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import routes from '../../routes';

// Create test app without starting server
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

describe('Real Signature E2E Tests', () => {
  let wallet: ethers.HDNodeWallet;
  let testMessage: string;
  let validSignature: string;

  beforeAll(async () => {
    // Create a test wallet
    wallet = ethers.Wallet.createRandom();
    testMessage = 'Hello, Web3 World!';
    
    // Sign the message
    validSignature = await wallet.signMessage(testMessage);
  });

  describe('Real signature verification', () => {
    it('should successfully verify a real Ethereum signature', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({
          message: testMessage,
          signature: validSignature,
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      expect(response.body.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
      expect(response.body.originalMessage).toBe(testMessage);
    });

    it('should fail verification with wrong message', async () => {
      const wrongMessage = 'Different message from what was signed';
      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({
          message: wrongMessage,
          signature: validSignature,
        });

      expect(response.status).toBe(200);
      expect(response.body.originalMessage).toBe(wrongMessage);
      
      // The signature should either be invalid OR recover to a different address
      if (response.body.isValid) {
        expect(response.body.signer.toLowerCase()).not.toBe(wallet.address.toLowerCase());
      } else {
        expect(response.body.isValid).toBe(false);
        expect(response.body.signer).toBeNull();
      }
    });

    it('should handle Unicode messages correctly', async () => {
      const unicodeMessage = 'Hello 世界! 🌍 Ω α β';
      const unicodeSignature = await wallet.signMessage(unicodeMessage);

      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({
          message: unicodeMessage,
          signature: unicodeSignature,
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      expect(response.body.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
      expect(response.body.originalMessage).toBe(unicodeMessage);
    });

    it('should handle empty message validation', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({
          message: '',
          signature: validSignature,
        });

      // This should fail validation due to empty message
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid request body. Expected: { message: string, signature: string }');
    });

    it('should handle very long messages', async () => {
      const longMessage = 'A'.repeat(1000);
      const longSignature = await wallet.signMessage(longMessage);

      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({
          message: longMessage,
          signature: longSignature,
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      expect(response.body.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
      expect(response.body.originalMessage).toBe(longMessage);
    });

    it('should verify signatures from different wallets correctly', async () => {
      const wallet2 = ethers.Wallet.createRandom();
      const message = 'Test message for wallet comparison';
      
      const signature1 = await wallet.signMessage(message);
      const signature2 = await wallet2.signMessage(message);

      // Verify first signature
      const response1 = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({ message, signature: signature1 });

      expect(response1.status).toBe(200);
      expect(response1.body.isValid).toBe(true);
      expect(response1.body.signer.toLowerCase()).toBe(wallet.address.toLowerCase());

      // Verify second signature
      const response2 = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({ message, signature: signature2 });

      expect(response2.status).toBe(200);
      expect(response2.body.isValid).toBe(true);
      expect(response2.body.signer.toLowerCase()).toBe(wallet2.address.toLowerCase());

      // Ensure they're different
      expect(response1.body.signer.toLowerCase()).not.toBe(response2.body.signer.toLowerCase());
    });

    it('should handle newlines and special characters in messages', async () => {
      const specialMessage = 'Line 1\nLine 2\r\nLine 3\tTabbed\\"Quoted\\"';
      const specialSignature = await wallet.signMessage(specialMessage);

      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({
          message: specialMessage,
          signature: specialSignature,
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(true);
      expect(response.body.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
      expect(response.body.originalMessage).toBe(specialMessage);
    });
  });

  describe('Signature format validation', () => {
    it('should reject signature with invalid format', async () => {
      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({
          message: testMessage,
          signature: '0xinvalid',
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(false);
      expect(response.body.signer).toBeNull();
    });

    it('should reject signature without 0x prefix', async () => {
      const signatureWithoutPrefix = validSignature.slice(2);
      
      const response = await request(app)
        .post('/api/verify-signature')
        .set('Content-Type', 'application/json')
        .send({
          message: testMessage,
          signature: signatureWithoutPrefix,
        });

      expect(response.status).toBe(200);
      expect(response.body.isValid).toBe(false);
      expect(response.body.signer).toBeNull();
    });
  });
});
import request from 'supertest';
import express from 'express';
import { SignatureController } from '../../controllers/signatureController';
import * as signatureVerifier from '../../utils/signatureVerifier';

// Create test app
const app = express();
app.use(express.json());
app.get('/health', SignatureController.healthCheck);
app.post('/verify-signature', SignatureController.verifySignature);

// Mock the signature verifier
jest.mock('../../utils/signatureVerifier');
const mockVerifyMessageSignature = signatureVerifier.verifyMessageSignature as jest.MockedFunction<
  typeof signatureVerifier.verifyMessageSignature
>;
const mockValidateSignatureRequest = signatureVerifier.validateSignatureRequest as jest.MockedFunction<
  typeof signatureVerifier.validateSignatureRequest
>;

describe('SignatureController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
    });
  });

  describe('POST /verify-signature', () => {
    const validRequest = {
      message: 'Hello World',
      signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    };

    it('should successfully verify a valid signature', async () => {
      const mockResult = {
        isValid: true,
        signer: '0x742d35cc6bb3c0532925a3b8d8cf6e8e1d47e5c1',
        originalMessage: 'Hello World',
      };

      mockValidateSignatureRequest.mockReturnValue(true);
      mockVerifyMessageSignature.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/verify-signature')
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
      expect(mockValidateSignatureRequest).toHaveBeenCalledWith(validRequest);
      expect(mockVerifyMessageSignature).toHaveBeenCalledWith(
        validRequest.message,
        validRequest.signature
      );
    });

    it('should return invalid result for invalid signature', async () => {
      const mockResult = {
        isValid: false,
        signer: null,
        originalMessage: 'Hello World',
      };

      mockValidateSignatureRequest.mockReturnValue(true);
      mockVerifyMessageSignature.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/verify-signature')
        .send(validRequest);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
    });

    it('should return 400 for invalid request body structure', async () => {
      mockValidateSignatureRequest.mockReturnValue(false);

      const response = await request(app)
        .post('/verify-signature')
        .send({ invalid: 'request' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('message', 'Invalid request body. Expected: { message: string, signature: string }');
      expect(mockVerifyMessageSignature).not.toHaveBeenCalled();
    });

    it('should return 400 for empty message', async () => {
      mockValidateSignatureRequest.mockReturnValue(true);

      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: '   ', // Whitespace only
          signature: validRequest.signature,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('message', 'Message cannot be empty');
      expect(mockVerifyMessageSignature).not.toHaveBeenCalled();
    });

    it('should return 400 for empty signature', async () => {
      mockValidateSignatureRequest.mockReturnValue(true);

      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: validRequest.message,
          signature: '   ', // Whitespace only
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Bad Request');
      expect(response.body).toHaveProperty('message', 'Signature cannot be empty');
      expect(mockVerifyMessageSignature).not.toHaveBeenCalled();
    });

    it('should handle verification errors gracefully', async () => {
      mockValidateSignatureRequest.mockReturnValue(true);
      mockVerifyMessageSignature.mockRejectedValue(new Error('Verification failed'));

      const response = await request(app)
        .post('/verify-signature')
        .send(validRequest);

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', 'Internal Server Error');
      expect(response.body).toHaveProperty('message', 'Failed to verify signature');
    });

    it('should handle missing request body', async () => {
      mockValidateSignatureRequest.mockReturnValue(false);
      
      const response = await request(app)
        .post('/verify-signature')
        .send();

      expect(response.status).toBe(400);
      expect(mockVerifyMessageSignature).not.toHaveBeenCalled();
    });

    it('should trim whitespace from valid inputs', async () => {
      const mockResult = {
        isValid: true,
        signer: '0x742d35cc6bb3c0532925a3b8d8cf6e8e1d47e5c1',
        originalMessage: 'Hello World',
      };

      mockValidateSignatureRequest.mockReturnValue(true);
      mockVerifyMessageSignature.mockResolvedValue(mockResult);

      const response = await request(app)
        .post('/verify-signature')
        .send({
          message: '  Hello World  ',
          signature: '  ' + validRequest.signature + '  ',
        });

      expect(response.status).toBe(200);
      expect(mockVerifyMessageSignature).toHaveBeenCalledWith(
        'Hello World',
        validRequest.signature
      );
    });
  });
});
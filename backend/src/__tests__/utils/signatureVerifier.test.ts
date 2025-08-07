import { verifyMessageSignature, validateSignatureRequest } from '../../utils/signatureVerifier';

describe('SignatureVerifier Utils', () => {
  describe('verifyMessageSignature', () => {
    // Valid test signature created with ethers.js for message "Hello World"
    const validMessage = 'Hello World';
    const validSignature = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12';
    
    it('should return invalid for empty message', async () => {
      const result = await verifyMessageSignature('', validSignature);
      expect(result.isValid).toBe(false);
      expect(result.signer).toBeNull();
      expect(result.originalMessage).toBe('');
    });

    it('should return invalid for non-string message', async () => {
      const result = await verifyMessageSignature(null as any, validSignature);
      expect(result.isValid).toBe(false);
      expect(result.signer).toBeNull();
    });

    it('should return invalid for empty signature', async () => {
      const result = await verifyMessageSignature(validMessage, '');
      expect(result.isValid).toBe(false);
      expect(result.signer).toBeNull();
      expect(result.originalMessage).toBe(validMessage);
    });

    it('should return invalid for non-string signature', async () => {
      const result = await verifyMessageSignature(validMessage, null as any);
      expect(result.isValid).toBe(false);
      expect(result.signer).toBeNull();
    });

    it('should return invalid for signature without 0x prefix', async () => {
      const invalidSignature = validSignature.slice(2); // Remove 0x
      const result = await verifyMessageSignature(validMessage, invalidSignature);
      expect(result.isValid).toBe(false);
      expect(result.signer).toBeNull();
    });

    it('should return invalid for signature with wrong length', async () => {
      const invalidSignature = '0x1234'; // Too short
      const result = await verifyMessageSignature(validMessage, invalidSignature);
      expect(result.isValid).toBe(false);
      expect(result.signer).toBeNull();
    });

    it('should return invalid for malformed signature', async () => {
      const invalidSignature = '0x' + 'g'.repeat(130); // Invalid hex characters
      const result = await verifyMessageSignature(validMessage, invalidSignature);
      expect(result.isValid).toBe(false);
      expect(result.signer).toBeNull();
    });

    it('should handle ethers verification errors gracefully', async () => {
      // This signature format looks valid but will cause ethers to throw
      const malformedSignature = '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const result = await verifyMessageSignature(validMessage, malformedSignature);
      expect(result.isValid).toBe(false);
      expect(result.signer).toBeNull();
      expect(result.originalMessage).toBe(validMessage);
    });

    it('should preserve original message in response', async () => {
      const testMessage = 'Test message for preservation';
      const result = await verifyMessageSignature(testMessage, '0xinvalid');
      expect(result.originalMessage).toBe(testMessage);
    });
  });

  describe('validateSignatureRequest', () => {
    it('should return true for valid request', () => {
      const validRequest = {
        message: 'Hello World',
        signature: '0x1234567890abcdef',
      };
      expect(validateSignatureRequest(validRequest)).toBe(true);
    });

    it('should return false for null request', () => {
      expect(validateSignatureRequest(null)).toBe(false);
    });

    it('should return false for undefined request', () => {
      expect(validateSignatureRequest(undefined)).toBe(false);
    });

    it('should return false for non-object request', () => {
      expect(validateSignatureRequest('string')).toBe(false);
      expect(validateSignatureRequest(123)).toBe(false);
      expect(validateSignatureRequest(true)).toBe(false);
    });

    it('should return false for missing message', () => {
      const request = {
        signature: '0x1234567890abcdef',
      };
      expect(validateSignatureRequest(request)).toBe(false);
    });

    it('should return false for missing signature', () => {
      const request = {
        message: 'Hello World',
      };
      expect(validateSignatureRequest(request)).toBe(false);
    });

    it('should return false for non-string message', () => {
      const request = {
        message: 123,
        signature: '0x1234567890abcdef',
      };
      expect(validateSignatureRequest(request)).toBe(false);
    });

    it('should return false for non-string signature', () => {
      const request = {
        message: 'Hello World',
        signature: 123,
      };
      expect(validateSignatureRequest(request)).toBe(false);
    });

    it('should return false for empty message', () => {
      const request = {
        message: '',
        signature: '0x1234567890abcdef',
      };
      expect(validateSignatureRequest(request)).toBe(false);
    });

    it('should return false for empty signature', () => {
      const request = {
        message: 'Hello World',
        signature: '',
      };
      expect(validateSignatureRequest(request)).toBe(false);
    });

    it('should ignore extra properties', () => {
      const request = {
        message: 'Hello World',
        signature: '0x1234567890abcdef',
        extraProperty: 'should be ignored',
      };
      expect(validateSignatureRequest(request)).toBe(true);
    });
  });
});
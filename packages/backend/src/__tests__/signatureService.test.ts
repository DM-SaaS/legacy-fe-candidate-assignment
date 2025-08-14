import { SignatureService } from '../services/signatureService';

describe('SignatureService', () => {
  let signatureService: SignatureService;

  beforeEach(() => {
    signatureService = new SignatureService();
  });

  describe('verifySignature', () => {
    it('returns proper structure', async () => {
      const message = 'Hello World';
      const signature = '0x1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890';
      
      const result = await signatureService.verifySignature(message, signature);
      
      expect(result).toHaveProperty('isValid');
      expect(result).toHaveProperty('signer');
      expect(result).toHaveProperty('originalMessage', message);
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });

    it('rejects bad signatures', async () => {
      const message = 'Hello World';
      const invalidSignature = '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      
      const result = await signatureService.verifySignature(message, invalidSignature);
      
      expect(result.isValid).toBe(false);
      expect(result.signer).toBe(null);
      expect(result.originalMessage).toBe(message);
    });

    it('handles garbage input gracefully', async () => {
      const message = 'Hello World';
      const malformedSignature = 'not-a-signature';
      
      const result = await signatureService.verifySignature(message, malformedSignature);
      
      expect(result.isValid).toBe(false);
      expect(result.signer).toBe(null);
    });
  });

  describe('isValidSignatureFormat', () => {
    it('accepts valid signatures', () => {
      const validSignature = '0x' + 'a'.repeat(130);
      
      expect(signatureService.isValidSignatureFormat(validSignature)).toBe(true);
    });

    it('rejects invalid formats', () => {
      expect(signatureService.isValidSignatureFormat('invalid')).toBe(false);
      expect(signatureService.isValidSignatureFormat('0x123')).toBe(false);
      expect(signatureService.isValidSignatureFormat('')).toBe(false);
    });
  });

  describe('isValidAddress', () => {
    it('accepts valid Ethereum addresses', () => {
      const validAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
      
      expect(signatureService.isValidAddress(validAddress)).toBe(true);
    });

    it('rejects invalid addresses', () => {
      expect(signatureService.isValidAddress('invalid')).toBe(false);
      expect(signatureService.isValidAddress('0x123')).toBe(false);
      expect(signatureService.isValidAddress('')).toBe(false);
    });
  });
}); 
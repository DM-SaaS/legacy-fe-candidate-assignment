import { ethers } from 'ethers';
import { verifySignature } from '../../utils/signatureUtils';

describe('Signature Verification Utils', () => {
  const wallet = ethers.Wallet.createRandom();
  const message = 'Test message to sign';
  
  it('should verify a valid signature correctly', async () => {
    const signature = await wallet.signMessage(message);
    
    const result = await verifySignature(message, signature);
    
    expect(result.isValid).toBe(true);
    expect(result.signer).toBe(wallet.address);
    expect(result.originalMessage).toBe(message);
  });
  
  it('should reject an invalid signature', async () => {
    const differentMessage = 'Different message';
    const signature = await wallet.signMessage(differentMessage);
    
    const result = await verifySignature(message, signature);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
  
  it('should reject a malformed signature', async () => {
    const invalidSignature = 'invalid-signature';
    
    const result = await verifySignature(message, invalidSignature);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
}); 
import request from 'supertest';
import { ethers } from 'ethers';
import app from '../../index';

describe('Signature Routes', () => {
  const wallet = ethers.Wallet.createRandom();
  const message = 'Test message for API verification';
  
  it('should verify a valid signature through the API endpoint', async () => {
    const signature = await wallet.signMessage(message);
    
    const response = await request(app)
      .post('/api/verify-signature')
      .send({
        message,
        signature
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      isValid: true,
      signer: wallet.address,
      originalMessage: message
    });
  });
  
  it('should return an error for invalid signature', async () => {
    const differentMessage = 'Different message for testing';
    const signature = await wallet.signMessage(differentMessage);
    
    const response = await request(app)
      .post('/api/verify-signature')
      .send({
        message,
        signature
      });
    
    expect(response.status).toBe(200);
    expect(response.body.isValid).toBe(false);
  });
  
  it('should return a 400 error when missing required parameters', async () => {
    const responseNoMessage = await request(app)
      .post('/api/verify-signature')
      .send({
        signature: 'some-signature'
      });
    
    expect(responseNoMessage.status).toBe(400);
    
    const responseNoSignature = await request(app)
      .post('/api/verify-signature')
      .send({
        message: 'some-message'
      });
    
    expect(responseNoSignature.status).toBe(400);
  });
}); 
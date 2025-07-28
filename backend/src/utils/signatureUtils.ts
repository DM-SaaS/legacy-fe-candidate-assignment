import { ethers } from 'ethers';

export const verifySignature = async (message: string, signature: string) => {
  try {
    const recoveredAddress = await ethers.verifyMessage(message, signature);
    
    return {
      isValid: true,
      signer: recoveredAddress,
      originalMessage: message
    };
  } catch (error) {
    console.error('Signature verification failed:', error);
    return {
      isValid: false,
      signer: null,
      originalMessage: message,
      error: 'Invalid signature'
    };
  }
}; 
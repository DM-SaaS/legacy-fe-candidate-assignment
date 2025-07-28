import axios from 'axios';
import type { VerificationResult } from '../types';

// Create an Axios instance with the base URL for our API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Verify a message signature with the backend
 * @param message The original message that was signed
 * @param signature The signature to verify
 * @returns The verification result from the backend
 */
export const verifySignature = async (message: string, signature: string): Promise<VerificationResult> => {
  try {
    const response = await api.post<VerificationResult>('/verify-signature', {
      message,
      signature,
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying signature:', error);
    return {
      isValid: false,
      signer: null,
      originalMessage: message,
      error: 'Failed to verify signature with the server',
    };
  }
};

export default api; 
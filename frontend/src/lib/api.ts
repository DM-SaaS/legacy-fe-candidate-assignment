import axios from 'axios';
import { VerifySignatureRequest, VerifySignatureResponse } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.error) {
      // Use the error message from the server
      throw new Error(error.response.data.error.message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred.');
    }
  }
);

export const api = {
  verifySignature: async (
    data: VerifySignatureRequest
  ): Promise<VerifySignatureResponse> => {
    const response = await apiClient.post<VerifySignatureResponse>(
      '/verify-signature',
      data
    );
    return response.data;
  },
};

import axios, { AxiosError } from 'axios';
import { SignatureVerificationRequest, SignatureVerificationResponse, ApiError } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const apiError: ApiError = {
            message: error.message || 'An unexpected error occurred',
            code: error.code,
            details: error.response?.data,
        };
        return Promise.reject(apiError);
    }
);

export class ApiService {
    static async verifySignature(
        request: SignatureVerificationRequest
    ): Promise<SignatureVerificationResponse> {
        try {
            const response = await apiClient.post<SignatureVerificationResponse>(
                '/api/verify-signature',
                request
            );
            return response.data;
        } catch (error) {
            console.error('Error verifying signature:', error);
            throw error;
        }
    }

    static async healthCheck(): Promise<{ status: string; timestamp: string; service: string }> {
        try {
            const response = await apiClient.get('/api/health');
            return response.data;
        } catch (error) {
            console.error('Error checking backend health:', error);
            throw error;
        }
    }
}

export default ApiService; 
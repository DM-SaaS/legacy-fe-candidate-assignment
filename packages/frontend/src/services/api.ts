import axios from 'axios';
import type { AxiosResponse } from 'axios';
import type { 
  SignatureRequest, 
  SignatureResponse, 
  ApiError,
  MfaSetupRequest,
  MfaSetupResponse,
  MfaValidationRequest,
  MfaValidationResponse,
  MfaTimeRemainingResponse
} from '../types';
import { API_ENDPOINTS } from '../constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<SignatureResponse>) => {
    return response;
  },
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.error?.message || error.message || 'An unexpected error occurred',
      code: error.response?.data?.error?.code || error.code,
      statusCode: error.response?.status || 500,
    };
    
    return Promise.reject(apiError);
  }
);

export const apiService = {
  async verifySignature(request: SignatureRequest): Promise<SignatureResponse> {
    try {
      const response = await apiClient.post<SignatureResponse>(API_ENDPOINTS.VERIFY_SIGNATURE, request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await apiClient.get(API_ENDPOINTS.HEALTH_CHECK);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  async generateMfaSetup(request: MfaSetupRequest): Promise<MfaSetupResponse> {
    try {
      const response = await apiClient.post<MfaSetupResponse>(API_ENDPOINTS.MFA_SETUP, request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async validateMfaToken(request: MfaValidationRequest): Promise<MfaValidationResponse> {
    try {
      const response = await apiClient.post<MfaValidationResponse>(API_ENDPOINTS.MFA_VALIDATE, request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async validateMfaTokenWithWindow(request: MfaValidationRequest): Promise<MfaValidationResponse> {
    try {
      const response = await apiClient.post<MfaValidationResponse>(API_ENDPOINTS.MFA_VALIDATE_WITH_WINDOW, request);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getMfaTimeRemaining(): Promise<MfaTimeRemainingResponse> {
    try {
      const response = await apiClient.get<MfaTimeRemainingResponse>(API_ENDPOINTS.MFA_TIME_REMAINING);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default apiService; 
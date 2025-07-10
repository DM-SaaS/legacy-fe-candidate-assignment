import axios, { AxiosError, AxiosResponse } from "axios";
import {
  SignatureVerificationRequest,
  SignatureVerificationResponse,
} from "../types";
import { toast } from "sonner";

// Extend the AxiosRequestConfig to include metadata
declare module "axios" {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Create axios instance with default configuration
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor to add request ID and auth headers
api.interceptors.request.use(
  config => {
    // Add unique request ID for tracking
    config.headers["X-Request-ID"] = crypto.randomUUID();

    // Add timestamp for request timing
    config.metadata = { startTime: Date.now() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(
        `🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`,
        {
          data: config.data,
          params: config.params,
        }
      );
    }

    return config;
  },
  error => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      const duration = Date.now() - (response.config.metadata?.startTime || 0);
      console.log(
        `✅ API Response: ${response.status} ${response.config.url} (${duration}ms)`,
        {
          data: response.data,
        }
      );
    }

    return response;
  },
  (error: AxiosError) => {
    const message =
      (error.response?.data as { error?: string })?.error ||
      error.message ||
      "An unexpected error occurred";

    // Log error in development
    if (import.meta.env.DEV) {
      console.error("❌ API Error:", {
        status: error.response?.status,
        message,
        url: error.config?.url,
        data: error.response?.data,
      });
    }

    // Handle different error types
    if (error.code === "ECONNABORTED") {
      toast.error("Request timeout - please try again");
    } else if (!error.response) {
      toast.error("Network error - please check your connection");
    } else if (error.response.status >= 500) {
      toast.error("Server error - please try again later");
    } else if (error.response.status === 401) {
      toast.error("Authentication required");
      // Could redirect to login here
    } else if (error.response.status === 403) {
      toast.error("Access denied");
    } else if (error.response.status === 404) {
      toast.error("Resource not found");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

// Generic API request wrapper with better error handling
export const apiRequest = async <T>(
  requestFn: () => Promise<AxiosResponse<T>>
): Promise<T> => {
  const response = await requestFn();
  return response.data;
};

// Signature verification function
export const verifySignature = async (
  data: SignatureVerificationRequest
): Promise<SignatureVerificationResponse> => {
  return apiRequest(() =>
    api.post<SignatureVerificationResponse>("/api/verify-signature", data)
  );
};

// Health check function
export const healthCheck = async (): Promise<{
  status: string;
  timestamp: string;
}> => {
  return apiRequest(() =>
    api.get<{ status: string; timestamp: string }>("/api/health")
  );
};

// Get server status
export const getServerStatus = async (): Promise<{
  uptime: number;
  version: string;
  environment: string;
}> => {
  return apiRequest(() =>
    api.get<{
      uptime: number;
      version: string;
      environment: string;
    }>("/api/status")
  );
};

// Upload file utility (if needed in the future)
export const uploadFile = async (
  file: File,
  endpoint: string = "/api/upload"
): Promise<{ url: string; filename: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  return apiRequest(() =>
    api.post<{ url: string; filename: string }>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  );
};

// Generic GET request
export const get = <T>(
  url: string,
  params?: Record<string, unknown>
): Promise<T> => {
  return apiRequest(() => api.get<T>(url, { params }));
};

// Generic POST request
export const post = <T>(url: string, data?: unknown): Promise<T> => {
  return apiRequest(() => api.post<T>(url, data));
};

// Generic PUT request
export const put = <T>(url: string, data?: unknown): Promise<T> => {
  return apiRequest(() => api.put<T>(url, data));
};

// Generic DELETE request
export const del = <T>(url: string): Promise<T> => {
  return apiRequest(() => api.delete<T>(url));
};

// Export configured axios instance for custom requests
export { api as apiClient };

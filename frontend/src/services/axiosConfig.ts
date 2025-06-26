import axios from 'axios';
import { localStorageUtils } from './localStorageService';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '../constants';
import { useAuth } from '../context';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorageUtils.getItem<string>(TOKEN_STORAGE_KEY);
  if (token) {
    if (config.headers && 'set' in config.headers) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { logout } = useAuth();
      logout();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

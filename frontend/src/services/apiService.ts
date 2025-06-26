import axiosInstance from './axiosConfig';

export const getRequest = async <T, P = Record<string, unknown>>(
  url: string,
  params?: P
): Promise<T> => {
  try {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  } catch (error) {
    console.error('GET request error:', error);
    throw error;
  }
};

export const postRequest = async <T, D = unknown>(
  url: string,
  data?: D
): Promise<T> => {
  try {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  } catch (error) {
    console.error('POST request error:', error);
    throw error;
  }
};

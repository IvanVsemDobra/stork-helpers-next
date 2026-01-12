import axios, { AxiosInstance, AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export const api: AxiosInstance = axios.create({
  baseURL: '/api/proxy',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ Сесія недійсна або користувач не залогінений');
    }
    return Promise.reject(error);
  }
);
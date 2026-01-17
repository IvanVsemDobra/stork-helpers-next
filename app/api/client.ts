import axios, { AxiosInstance, AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

const BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || 'https://stork-helpers-api.onrender.com/api';

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
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
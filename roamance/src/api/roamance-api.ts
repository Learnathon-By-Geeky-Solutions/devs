import { routes } from '@/constants';
import { USER_AUTH_ENDPOINTS, USER_ENDPOINTS } from '@/constants/api';
import { ENV_VARS } from '@/constants/keys';
import { authService } from '@/service/auth-service';
import { ApiResponse } from '@/types';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiError } from './errors';

const PUBLIC_ENDPOINTS = [
  USER_AUTH_ENDPOINTS.LOGIN,
  USER_ENDPOINTS.REGISTER,
  USER_AUTH_ENDPOINTS.REFRESH_TOKEN,
];
class Api {
  private readonly instance: AxiosInstance;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = ENV_VARS.API_URL;

    this.instance = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 seconds
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Skip token only for POST login and register endpoints
        if (
          config.method?.toLowerCase() === 'post' &&
          PUBLIC_ENDPOINTS.includes(config.url || '')
        ) {
          return config;
        }

        // Add token to request headers if available
        const token = this.getToken();
        if (token && config.headers) {
          // Ensure the token is properly formatted
          config.headers.Authorization = `Bearer ${token}`;
          // For debugging
          console.log(
            'Request with token:',
            config.url,
            token.substring(0, 10) + '...'
          );
        } else {
          console.warn('No token available for request:', config.url);
        }

        return config;
      },
      (error: AxiosError<ApiResponse>) => {
        const errorResponse = error.response?.data;
        const status = errorResponse?.status || error.response?.status || 500;
        const message =
          errorResponse?.message || error.message || 'Unknown error occurred';
        return Promise.reject(new ApiError(message, status));
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiResponse>) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // Attempt token refresh on 401 errors (excluding auth endpoints)
        if (
          error.response?.status === 401 &&
          originalRequest &&
          !originalRequest._retry &&
          !(
            originalRequest.method?.toLowerCase() === 'post' &&
            [
              USER_AUTH_ENDPOINTS.LOGIN,
              USER_ENDPOINTS.REGISTER,
              USER_AUTH_ENDPOINTS.REFRESH_TOKEN,
            ].includes(originalRequest.url || '')
          )
        ) {
          originalRequest._retry = true;
          try {
            const authResponse = await authService.refreshToken();
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${authResponse.access_token}`;
            return this.instance.request(originalRequest);
          } catch (refreshError) {
            if (typeof window !== 'undefined') {
              authService.logout();
              window.location.href = routes.signIn.href;
            }
            return Promise.reject(refreshError);
          }
        }

        // Standard error handling using ApiResponse type
        const errorResponse = error.response?.data;
        const status = errorResponse?.status || error.response?.status || 500;
        const message =
          errorResponse?.message || error.message || 'Unknown error occurred';
        const success = errorResponse?.success || false;

        console.error(
          'API Error:',
          message,
          'Status:',
          status,
          'Success:',
          success
        );
        return Promise.reject(new ApiError(message, status));
      }
    );
  }

  private getToken(): string | null {
    try {
      // Use authService method instead of manual cookie access
      const token = authService.getAccessToken();
      if (!token) {
        console.warn('No token found in cookies');
        return null;
      }

      console.log('Token retrieved from cookies');
      return token;
    } catch (error) {
      console.error('Error accessing token:', error);
      return null;
    }
  }

  // Expose the axios instance methods
  get<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.instance.get<T, R>(url, config);
  }

  post<T, K, R = AxiosResponse<T>>(
    url: string,
    data?: K,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.instance.post<T, R>(url, data, config);
  }

  put<T, K, R = AxiosResponse<T>>(
    url: string,
    data?: K,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.instance.put<T, R>(url, data, config);
  }

  delete<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    return this.instance.delete<T, R>(url, config);
  }

  // Expose the axios instance directly if needed
  getInstance() {
    return this.instance;
  }
}

// Create and export the API singleton
export const api = new Api();
export default api;

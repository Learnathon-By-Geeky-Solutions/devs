import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { AuthResponse, User } from '../types';

// Custom API error
export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// API Service
export class ApiService {
  private api: AxiosInstance;

  constructor(
    baseURL: string = process.env.REACT_APP_API_URL ||
      'http://localhost:5000/api'
  ) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Request interceptor for adding auth token
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const message =
            (error.response.data as { message?: string })?.message ||
            'An error occurred';
          throw new ApiError(
            message,
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // The request was made but no response was received
          throw new ApiError('No response from server', 503);
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new ApiError(
            error.message || 'Request configuration error',
            500
          );
        }
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }
}

// Auth Service
export class AuthService {
  private apiService: ApiService;
  private tokenExpiryKey = 'tokenExpiry';

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.apiService.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      this.saveAuthData(response);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw error;
    }
  }

  async register(userData: Partial<User>): Promise<AuthResponse> {
    try {
      const response = await this.apiService.post<AuthResponse>(
        '/auth/register',
        userData
      );
      this.saveAuthData(response);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem(this.tokenExpiryKey);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    const expiryStr = localStorage.getItem(this.tokenExpiryKey);

    if (!token || !expiryStr) return false;

    const expiry = new Date(expiryStr);
    return expiry > new Date();
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  private saveAuthData(authData: AuthResponse): void {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));

    // Set token expiry (default: 24 hours from now)
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    localStorage.setItem(this.tokenExpiryKey, expiry.toISOString());
  }
}

// Storage Service
export class StorageService {
  setItem(key: string, value: unknown): void {
    try {
      if (value === undefined) {
        localStorage.removeItem(key);
        return;
      }

      const serialized =
        typeof value === 'object' ? JSON.stringify(value) : String(value);

      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error storing item ${key}:`, error);
    }
  }

  getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;

      // Only try to parse if the value looks like JSON
      if (value.startsWith('{') || value.startsWith('[')) {
        return JSON.parse(value) as T;
      }

      // Handle primitive types appropriately
      if (value === 'true') return true as unknown as T;
      if (value === 'false') return false as unknown as T;
      if (!isNaN(Number(value))) return Number(value) as unknown as T;

      return value as unknown as T;
    } catch (error) {
      console.error(`Error retrieving item ${key}:`, error);
      return defaultValue;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}

// Create and export service instances
const apiService = new ApiService();
const authService = new AuthService(apiService);
const storageService = new StorageService();

export { apiService, authService, storageService };

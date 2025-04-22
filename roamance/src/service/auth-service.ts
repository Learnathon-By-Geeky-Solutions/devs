import Cookies from 'js-cookie';
import { ApiError } from '../api/errors';
import { USER_AUTH_ENDPOINTS, USER_ENDPOINTS } from '../constants/api';
import { COOKIE_KEYS } from '../constants/keys';
import { AuthResponse, UserRequest } from '../types';
import { RefreshTokenRequest } from '../types/auth';
import axios, { AxiosInstance } from 'axios';
import { ENV_VARS } from '../constants/keys';

const ACCESS_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 1 day
const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export class AuthService {
  private apiInstance: AxiosInstance;

  constructor() {
    // Create a simple axios instance for auth operations to avoid circular dependency
    this.apiInstance = axios.create({
      baseURL: ENV_VARS.API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 15000, // 15 seconds
    });
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await this.apiInstance.post<AuthResponse>(
        USER_AUTH_ENDPOINTS.LOGIN,
        {
          email,
          password,
        }
      );
      this.saveAuthData(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw error;
    }
  }

  async register(userData: Partial<UserRequest>): Promise<AuthResponse> {
    try {
      const response = await this.apiInstance.post<AuthResponse>(
        USER_ENDPOINTS.REGISTER,
        userData
      );
      this.saveAuthData(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw error;
    }
  }

  logout(): void {
    Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
    Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN);
  }

  isAuthenticated(): boolean {
    const accessToken = Cookies.get(COOKIE_KEYS.ACCESS_TOKEN);
    return !!accessToken;
  }

  getCurrentUser(): UserRequest | null {
    const accessToken = this.getAccessToken();
    if (!accessToken) return null;

    try {
      return {
        id: 'authenticated',
        email: 'authenticated@user.com',
      } as UserRequest;
    } catch (e) {
      console.error('Failed to get current user:', e);
      return null;
    }
  }

  getAccessToken(): string | null {
    return Cookies.get(COOKIE_KEYS.ACCESS_TOKEN) || null;
  }

  getRefreshToken(): string | null {
    return Cookies.get(COOKIE_KEYS.REFRESH_TOKEN) || null;
  }

  async refreshToken(): Promise<AuthResponse> {
    const token = this.getRefreshToken();
    if (!token) throw new Error('No refresh token available');
    const requestBody: RefreshTokenRequest = { refresh_token: token };
    try {
      const response = await this.apiInstance.post<AuthResponse>(
        USER_AUTH_ENDPOINTS.REFRESH_TOKEN,
        requestBody
      );
      this.saveAuthData(response.data);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Token refresh failed: ${error.message}`);
      }
      throw error;
    }
  }

  private saveAuthData(authData: AuthResponse): void {
    const accessTokenExpiry = new Date(
      new Date().getTime() + ACCESS_TOKEN_EXPIRY * 60 * 60 * 1000
    ); // 24 hours
    const refreshTokenExpiry = new Date(
      new Date().getTime() + REFRESH_TOKEN_EXPIRY * 24 * 60 * 60 * 1000
    ); // 7 days

    const cookieOptions = {
      secure: window.location.protocol === 'https:', // More reliable than checking NODE_ENV
      sameSite: 'strict',
      path: '/',
    } as Cookies.CookieAttributes;

    if (authData.access_token) {
      Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, authData.access_token, {
        ...cookieOptions,
        expires: accessTokenExpiry,
      });
    }

    if (authData.refresh_token) {
      Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, authData.refresh_token, {
        ...cookieOptions,
        expires: refreshTokenExpiry,
      });
    }
  }
}

export const authService = new AuthService();

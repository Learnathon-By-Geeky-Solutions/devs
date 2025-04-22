import { ApiResponse } from './api';

export interface UserAuthForm {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface UserRegisterForm extends UserAuthForm {
  name: string;
  confirmPassword: string;
}

export interface UserRequest {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

export interface AuthResponse extends ApiResponse {
  access_token: string;
  refresh_token: string;
}

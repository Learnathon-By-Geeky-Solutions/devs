// Auth Types
export interface UserAuthForm {
  email: string;
  password: string;
}

export interface UserRegisterForm extends UserAuthForm {
  name: string;
  confirmPassword: string;
}

// API Response and User interfaces
export interface ApiResponse {
  status: number;
  success: boolean;
  message: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: unknown;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// New interface to extend ApiResponse with a generic data property

export interface ApiAuthUserResponse extends ApiResponse {
  access_token: string;
  refresh_token: string;
}

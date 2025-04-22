import axios from 'axios';
import { USER_ENDPOINTS } from '@/constants/api';
import {
  ApiAuthUserResponse,
  ApiResponse,
  UserAuthForm,
  UserRegisterForm,
} from '@/types/auth';

/**
 * Register a new user
 */
export async function registerUser(
  data: UserRegisterForm
): Promise<ApiResponse> {
  try {
    const response = await axios.post(USER_ENDPOINTS.REGISTER, data);
    return response.data;
  } catch (error) {
    console.error('Failed to register user', error);
    return {
      status: 500,
      success: false,
      message: 'Failed to register user',
    };
  }
}

/**
 * Login a user
 */
export async function loginUser(
  data: UserAuthForm
): Promise<ApiAuthUserResponse> {
  try {
    const response = await axios.post(USER_ENDPOINTS.LOGIN, data);
    return response.data;
  } catch (error) {
    console.error('Failed to login user', error);
    return {
      status: 500,
      success: false,
      message: 'Failed to login',
      access_token: '',
      refresh_token: '',
    };
  }
}

// Base API URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// User related endpoints
export const USER_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/users/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
};

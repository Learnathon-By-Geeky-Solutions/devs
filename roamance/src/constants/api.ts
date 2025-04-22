import { ENV_VARS } from './keys';

export const API_BASE_URL = ENV_VARS.API_URL;

const USERS = `${API_BASE_URL}/users`;
export const USER_ENDPOINTS = {
  REGISTER: USERS,
  UPDATE: USERS,
  DELETE: USERS,
  PROFILE: `${USERS}/me`,
} as const;


const USER_AUTH = `${API_BASE_URL}/auth`;
export const USER_AUTH_ENDPOINTS = {
  ROOT: USER_AUTH,
  LOGIN: `${USER_AUTH}/login`,
  REFRESH_TOKEN: `${USER_AUTH}/refresh-token`,
} as const;

const USER_INFO = `${USERS}/info`;
export const USER_INFO_ENDPOINTS = {
  ROOT: USER_INFO,
  ME: `${USER_INFO}/me`,
  UPDATE: `${USER_INFO}`,
  DELETE: `${USER_INFO}`,
};

const USER_PREFERENCES = `${USERS}/preferences`;
export const USER_PREFERENCES_ENDPOINTS = {
  ROOT: USER_PREFERENCES,
  ME: `${USER_PREFERENCES}/me`,
  UPDATE: `${USER_PREFERENCES}`,
  DELETE: `${USER_PREFERENCES}`,
};

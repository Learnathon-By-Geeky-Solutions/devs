import { ApiError } from '../api/errors';
import { api } from '../api/roamance-api';
import { USER_ENDPOINTS, USER_INFO_ENDPOINTS, USER_PREFERENCES_ENDPOINTS } from '../constants/api';
import { User, UserInfo, UserInfoResponse, UserPreferencesWithAudit, UserPreferencesResponse, UserPreferencesUpdateRequest, UserResponse } from '../types';

export class UserService {
  private apiService: typeof api;

  constructor(apiService: typeof api) {
    this.apiService = apiService;
  }

  /**
   * Fetches the basic user profile data
   */
  async getUserProfile(): Promise<User> {
    try {
      const response = await this.apiService.get<UserResponse>(USER_ENDPOINTS.PROFILE);
      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch user profile: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Updates basic user profile (name, profile_image, etc.)
   */
  async updateUserProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await this.apiService.put<UserResponse, Partial<User>>(
        USER_ENDPOINTS.UPDATE,
        data
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to update user profile: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Fetches the extended user information
   */
  async getUserInfo(): Promise<UserInfo> {
    try {
      const response = await this.apiService.get<UserInfoResponse>(USER_INFO_ENDPOINTS.ME);
      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch user info: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Fetches both user profile and extended info in parallel
   */
  async getFullUserProfile(): Promise<{ user: User; userInfo: UserInfo }> {
    try {
      const [userProfile, userInfo] = await Promise.all([
        this.getUserProfile(),
        this.getUserInfo(),
      ]);

      return {
        user: userProfile,
        userInfo: userInfo,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch full user profile: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Updates the extended user information
   */
  async updateUserInfo(userInfo: Partial<UserInfo>): Promise<UserInfo> {
    try {
      const response = await this.apiService.put<UserInfoResponse, Partial<UserInfo>>(
        USER_INFO_ENDPOINTS.UPDATE,
        userInfo
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to update user info: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Fetches user preferences
   */
  async getUserPreferences(): Promise<UserPreferencesWithAudit> {
    try {
      const response = await this.apiService.get<UserPreferencesResponse>(USER_PREFERENCES_ENDPOINTS.ME);
      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to fetch user preferences: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Updates user preferences
   * Converts camelCase properties to snake_case for API compatibility
   */
  async updateUserPreferences(preferences: Partial<UserPreferencesWithAudit>): Promise<UserPreferencesWithAudit> {
    try {
      const response = await this.apiService.put<UserPreferencesResponse, Partial<UserPreferencesUpdateRequest>>(
        USER_PREFERENCES_ENDPOINTS.UPDATE,
        preferences
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(`Failed to update user preferences: ${error.message}`);
      }
      throw error;
    }
  }
}

export const userService = new UserService(api);

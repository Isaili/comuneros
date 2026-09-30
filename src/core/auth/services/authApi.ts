import { apiClient } from '@/core/api/apiClient';
import { AuthUser, LoginResponse } from '../models/auth.model';
import { tokenStorage } from './tokenStorage';
import { userStorage } from './userStorage';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthUser> => {
    const { data } = await apiClient.post<ApiEnvelope<LoginResponse>>('/auth/login', { email, password });
    tokenStorage.setAccessToken(data.data.accessToken);
    userStorage.setUser(data.data.user);
    return data.data.user;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      tokenStorage.clearAccessToken();
      userStorage.clearUser();
    }
  },

  logoutAll: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout-all');
    } finally {
      tokenStorage.clearAccessToken();
      userStorage.clearUser();
    }
  },

  changePassword: (currentPassword: string, newPassword: string) =>
    apiClient.patch('/auth/change-password', { currentPassword, newPassword }),
};

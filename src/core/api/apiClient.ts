console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../auth/services/tokenStorage';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// TODO: ajustar la ruta cuando Norberto entregue el endpoint real de refresh.
const REFRESH_ENDPOINT = '/auth/refresh';

export const apiClient = axios.create({ baseURL: BASE_URL });

// Cliente sin interceptores para no reintentar el propio refresh en bucle.
const refreshClient = axios.create({ baseURL: BASE_URL });

interface RequestConfigConReintento extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refrescando = false;
let colaEsperandoRefresh: Array<(nuevoAccessToken: string | null) => void> = [];

const resolverCola = (nuevoAccessToken: string | null) => {
  colaEsperandoRefresh.forEach((callback) => callback(nuevoAccessToken));
  colaEsperandoRefresh = [];
};

const irALogin = () => {
  tokenStorage.clearTokens();
  if (typeof window !== 'undefined') window.location.href = '/login';
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfigConReintento | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      irALogin();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (refrescando) {
      return new Promise((resolve, reject) => {
        colaEsperandoRefresh.push((nuevoAccessToken) => {
          if (!nuevoAccessToken) {
            reject(error);
            return;
          }
          originalRequest.headers.Authorization = `Bearer ${nuevoAccessToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    refrescando = true;
    try {
      const response = await refreshClient.post(REFRESH_ENDPOINT, { refreshToken });
      const { accessToken, refreshToken: nuevoRefreshToken } = response.data.data ?? response.data;
      tokenStorage.setTokens(accessToken, nuevoRefreshToken);
      resolverCola(accessToken);
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      resolverCola(null);
      irALogin();
      return Promise.reject(refreshError);
    } finally {
      refrescando = false;
    }
  }
);

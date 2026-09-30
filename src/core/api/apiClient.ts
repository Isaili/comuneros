console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '../auth/services/tokenStorage';
import { userStorage } from '../auth/services/userStorage';
import { LoginResponse } from '../auth/models/auth.model';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const REFRESH_ENDPOINT = '/auth/refresh';

// withCredentials: true envía/recibe la cookie httpOnly del refresh token en cada request.
export const apiClient = axios.create({ baseURL: BASE_URL, withCredentials: true });

// Cliente sin interceptores para no reintentar el propio refresh en bucle.
const refreshClient = axios.create({ baseURL: BASE_URL, withCredentials: true });

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
  tokenStorage.clearAccessToken();
  userStorage.clearUser();
  if (typeof window !== 'undefined') window.location.href = '/login';
};

// Reutilizable por cualquier cliente HTTP (axios o fetch) que reciba un 401.
// El refresh token va solo en la cookie httpOnly "refresh_token" (withCredentials/credentials:'include'), no en el body.
export const refrescarAccessToken = async (): Promise<string | null> => {
  if (refrescando) {
    return new Promise((resolve) => {
      colaEsperandoRefresh.push(resolve);
    });
  }

  refrescando = true;
  try {
    const response = await refreshClient.post<{ data: LoginResponse } | LoginResponse>(REFRESH_ENDPOINT);
    const { accessToken, user } = 'data' in response.data ? response.data.data : response.data;
    tokenStorage.setAccessToken(accessToken);
    userStorage.setUser(user);
    resolverCola(accessToken);
    return accessToken;
  } catch (refreshError) {
    resolverCola(null);
    irALogin();
    return null;
  } finally {
    refrescando = false;
  }
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RequestConfigConReintento | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const nuevoAccessToken = await refrescarAccessToken();
    if (!nuevoAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${nuevoAccessToken}`;
    return apiClient(originalRequest);
  }
);



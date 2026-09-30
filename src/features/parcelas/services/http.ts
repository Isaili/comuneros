/**
 * Wrapper mínimo sobre fetch para toda la app.
 * Ajusta NEXT_PUBLIC_API_URL en tu .env(.local) a la base de tu API,
 * ej. NEXT_PUBLIC_API_URL=https://api.tuejido.mx
 */
import { tokenStorage } from '@/core/auth/services/tokenStorage';
import { refrescarAccessToken } from '@/core/api/apiClient';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://comiseria-production.up.railway.app';
const API_BASE_URL = BASE_URL.replace(/\/+$/, '');

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

const solicitar = async (path: string, options: RequestInit, token: string | null) =>
  fetch(`${API_BASE_URL}/${path.replace(/^\/+/, '')}`, {
    ...options,
    cache: options.cache ?? 'no-store',
    // credentials: 'include' manda/recibe la cookie httpOnly del refresh token, igual que withCredentials en axios.
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

export async function http<T>(path: string, options: RequestInit = {}, _retry = false): Promise<T> {
  const res = await solicitar(path, options, tokenStorage.getAccessToken());

  if (res.status === 401 && !_retry) {
    const nuevoAccessToken = await refrescarAccessToken();
    if (nuevoAccessToken) {
      return http<T>(path, options, true);
    }
  }

  const contentType = res.headers.get('content-type') ?? '';
  const body = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : null;

  if (!res.ok) {
    const mensaje = (body as { message?: string } | null)?.message
      ?? `Error ${res.status} al conectar con el servidor.`;
    throw new ApiError(mensaje, res.status, body);
  }

  return body as T;
}
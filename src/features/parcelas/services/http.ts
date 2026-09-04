/**
 * Wrapper mínimo sobre fetch para toda la app.
 * Ajusta NEXT_PUBLIC_API_URL en tu .env(.local) a la base de tu API,
 * ej. NEXT_PUBLIC_API_URL=https://api.tuejido.mx
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
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

export async function http<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/${path.replace(/^\/+/, '')}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

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
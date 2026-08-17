import { apiClient } from '@/core/api/apiClient';
import {
  ApiEnvelope,
  Comunero,
  CrearComuneroPayload,
  PaginatedListDTO,
  PersonaBackendDTO,
} from '../types/types';
import { mapearComuneroDesdeBackend } from './comunero.mapper';

export const generarQrUnico = (seed?: string): string => {
  const normalizedSeed = (seed || `${Date.now()}-${Math.random().toString(16).slice(2)}`)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .slice(0, 12)
    .toUpperCase();

  const baseSeed = normalizedSeed || 'MIEMBRO';

  const stableHash = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }
    return hash.toString(16).toUpperCase().padStart(12, '0');
  };

  const randomPart = seed
    ? stableHash(seed)
    : (typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()
      : `${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 8).toUpperCase()}`);

  return `COM-${baseSeed}-${randomPart}`.slice(0, 28);
};

export const resolverQrCode = (valor?: string | null, seed?: string): string => {
  const valorLimpio = (valor ?? '').trim();
  if (valorLimpio) return valorLimpio.toUpperCase();

  const seedBase = seed || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return generarQrUnico(seedBase).toUpperCase();
};

const construirFormData = (payload: Partial<CrearComuneroPayload>, fotoFile?: File | Blob | null): FormData => {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  });
  if (fotoFile) {
    formData.append('photo', fotoFile);
  }
  return formData;
};

export const comunerosApi = {
  crear: async (payload: CrearComuneroPayload, fotoFile?: File | Blob | null): Promise<Comunero> => {
    const formData = construirFormData(payload, fotoFile);
    const { data } = await apiClient.post<ApiEnvelope<PersonaBackendDTO>>('/people', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapearComuneroDesdeBackend(data.data);
  },

  listar: async (
    page: number = 1,
    limit: number = 10
  ): Promise<{ comuneros: Comunero[]; total: number; totalPages: number }> => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedListDTO<PersonaBackendDTO>>>('/people', {
      params: { page, limit },
    });

    const { items, total, limit: limitRespuesta } = data.data;
    const limitNumerico = Number(limitRespuesta) || limit;
    const totalPages = Math.max(1, Math.ceil(total / limitNumerico));

    return {
      comuneros: items.map(mapearComuneroDesdeBackend),
      total,
      totalPages,
    };
  },

  actualizar: async (
    id: string,
    payload: Partial<CrearComuneroPayload>,
    fotoFile?: File | Blob | null
  ): Promise<Comunero> => {
    // Si hay foto nueva, la enviamos por FormData a PATCH /people/:id
    if (fotoFile) {
      const formData = construirFormData(payload, fotoFile);
      const { data } = await apiClient.patch<ApiEnvelope<PersonaBackendDTO>>(`/people/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return mapearComuneroDesdeBackend(data.data);
    }

    // Si no hay foto, enviamos JSON plano directamente a PATCH /people/:id
    const { data } = await apiClient.patch<ApiEnvelope<PersonaBackendDTO>>(`/people/${id}`, payload);
    return mapearComuneroDesdeBackend(data.data);
  },

  eliminar: (id: string) => apiClient.delete(`/people/${id}`),
};
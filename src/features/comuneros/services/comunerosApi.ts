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
    const { data } = await apiClient.post<ApiEnvelope<PersonaBackendDTO>>('/persons', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return mapearComuneroDesdeBackend(data.data);
  },

  listar: async (
    page: number = 1,
    limit: number = 10,
    filters?: { fullName?: string; personType?: PersonaBackendDTO['personType']; status?: PersonaBackendDTO['status'] },
    options?: { incluirDetalle?: boolean }
  ): Promise<{ comuneros: Comunero[]; total: number; totalPages: number }> => {
    const { data } = await apiClient.get<ApiEnvelope<PaginatedListDTO<PersonaBackendDTO>>>('/persons', {
      params: { page, limit, status: filters?.status ?? 'ACTIVE', ...filters },
    });

    const { items, total, limit: limitRespuesta } = data.data;
    const limitNumerico = Number(limitRespuesta) || limit;
    const totalPages = Math.max(1, Math.ceil(total / limitNumerico));

    const comuneros = items.map(mapearComuneroDesdeBackend);
    const comunerosConDetalle = options?.incluirDetalle
      ? await Promise.all(comuneros.map(async (comunero) => comunerosApi.obtenerPorId(comunero.id)))
      : comuneros;

    return {
      comuneros: comunerosConDetalle,
      total,
      totalPages,
    };
  },

  obtenerPorId: async (id: string): Promise<Comunero> => {
    const { data } = await apiClient.get<ApiEnvelope<PersonaBackendDTO>>(`/persons/${id}`);
    return mapearComuneroDesdeBackend(data.data);
  },

  actualizar: async (
    id: string,
    payload: Partial<CrearComuneroPayload>,
    fotoFile?: File | Blob | null,
    statusActual?: PersonaBackendDTO['status'],
    eliminarFoto = false
  ): Promise<Comunero> => {
    const { personType: _personType, status: nuevoStatus, phone: _phone, ...datosPersonales } = payload;
    if (Object.keys(datosPersonales).length > 0) {
      await apiClient.patch<ApiEnvelope<PersonaBackendDTO>>(`/persons/${id}`, datosPersonales);
    }

    if (nuevoStatus && nuevoStatus !== statusActual) {
      if (nuevoStatus === 'DECEASED') {
        await apiClient.patch(`/persons/${id}/deceased`);
      } else {
        const action = nuevoStatus === 'ACTIVE' ? 'ACTIVATE' : 'INACTIVE';
        await apiClient.patch(`/persons/${id}/status`, { status: action });
      }
    }

    if (fotoFile) {
      const formData = new FormData();
      formData.append('photo', fotoFile);
      await apiClient.patch<ApiEnvelope<{ url: string }>>(`/persons/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else if (eliminarFoto) {
      await comunerosApi.eliminarFoto(id);
    }

    return comunerosApi.obtenerPorId(id);
  },

  actualizarEstado: (id: string, status: 'ACTIVATE' | 'INACTIVE') =>
    apiClient.patch(`/persons/${id}/status`, { status }),

  marcarFallecido: (id: string) => apiClient.patch(`/persons/${id}/deceased`),

  eliminarFoto: (id: string) => apiClient.delete(`/persons/${id}/photo`),
};
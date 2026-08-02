import { apiClient } from '@/core/api/apiClient';
import {
  ApiEnvelope,
  Comunero,
  CrearComuneroPayload,
  PaginatedListDTO,
  PersonaBackendDTO,
} from '../types/types';
import { mapearComuneroDesdeBackend } from './comunero.mapper';


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
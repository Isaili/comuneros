import { apiClient } from '@/core/api/apiClient';
import {
  ApiEnvelope,
  Comunero,
  CrearComuneroPayload,
  PaginatedListDTO,
  PersonaBackendDTO,
} from '../types/types';
import { mapearComuneroDesdeBackend } from './comunero.mapper';
import { invalidarCacheDashboard } from '@/features/menu/services/dashboardCache'; // ajusta la ruta real

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
    invalidarCacheDashboard();
    return mapearComuneroDesdeBackend(data.data);
  },

  listar: async (
    page: number = 1,
    limit: number = 10,
    filters?: { fullName?: string; personType?: PersonaBackendDTO['personType']; status?: PersonaBackendDTO['status'] },
    options?: { incluirDetalle?: boolean }
  ): Promise<{ comuneros: Comunero[]; total: number; totalPages: number }> => {
    // Parámetro _t: Date.now() para romper la caché HTTP
    const { data } = await apiClient.get<ApiEnvelope<PaginatedListDTO<PersonaBackendDTO>>>('/persons', {
      params: { page, limit, status: filters?.status ?? 'ACTIVE', ...filters, _t: Date.now() },
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
    // Realiza el GET individual directo a la API con parámetro anti-caché
    const { data } = await apiClient.get<ApiEnvelope<PersonaBackendDTO>>(`/persons/${id}`, {
      params: { _t: Date.now() },
    });
    return mapearComuneroDesdeBackend(data.data);
  },

  actualizar: async (
    id: string,
    payload: Partial<CrearComuneroPayload>,
    fotoFile?: File | Blob | null,
    statusActual?: PersonaBackendDTO['status'],
    eliminarFoto = false
  ): Promise<Comunero> => {
    const datosPersonales = { ...payload };
    const nuevoStatus = datosPersonales.status;
    delete datosPersonales.personType;
    delete datosPersonales.status;
    delete datosPersonales.phone;
    let personaActualizada: PersonaBackendDTO | null = null;

    // 1. Aplica cambios de datos personales
    if (Object.keys(datosPersonales).length > 0) {
      const { data } = await apiClient.patch<ApiEnvelope<PersonaBackendDTO>>(`/persons/${id}`, datosPersonales);
      personaActualizada = data.data;
    }

    // 2. Aplica cambios de estado
    if (nuevoStatus && nuevoStatus !== statusActual) {
      if (nuevoStatus === 'DECEASED') {
        await apiClient.patch(`/persons/${id}/deceased`);
      } else {
        const action = nuevoStatus === 'ACTIVE' ? 'ACTIVATE' : 'INACTIVE';
        await apiClient.patch(`/persons/${id}/status`, { status: action });
      }
    }

    // 3. Aplica actualización o eliminación de foto
    if (fotoFile) {
      const formData = new FormData();
      formData.append('photo', fotoFile);
      const { data } = await apiClient.patch<ApiEnvelope<{ url: string }>>(`/persons/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (personaActualizada) personaActualizada.photo = data.data.url;
    } else if (eliminarFoto) {
      await comunerosApi.eliminarFoto(id);
      if (personaActualizada) personaActualizada.photo = undefined;
    }

    invalidarCacheDashboard();

    if (!personaActualizada) {
      throw new Error('La respuesta de actualización no incluyó los datos de la persona.');
    }

    const resultado = {
      ...personaActualizada,
      status: nuevoStatus ?? personaActualizada.status,
    };
    return mapearComuneroDesdeBackend(resultado);
  },

  actualizarEstado: async (id: string, status: 'ACTIVATE' | 'INACTIVE') => {
    const resultado = await apiClient.patch(`/persons/${id}/status`, { status });
    invalidarCacheDashboard();
    return resultado;
  },

  marcarFallecido: async (id: string) => {
    const resultado = await apiClient.patch(`/persons/${id}/deceased`);
    invalidarCacheDashboard();
    return resultado;
  },

  // TODO: reemplazar la ruta cuando se entregue el endpoint definitivo de cambio de tipo de persona
  actualizarTipo: async (id: string, personType: PersonaBackendDTO['personType']) => {
    const resultado = await apiClient.patch(`/persons/${id}/person-type`, { personType });
    invalidarCacheDashboard();
    return resultado;
  },

  eliminarFoto: (id: string) => apiClient.delete(`/persons/${id}/photo`),
};
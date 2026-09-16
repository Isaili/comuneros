// src/services/neighborhoodsApi.ts
import { apiClient } from '@/core/api/apiClient';

export interface Neighborhood {
  id: string;
  name: string;
}

interface NeighborhoodsResponse {
  success: boolean;
  message: string;
  data: Neighborhood[];
}

// Variables en memoria para controlar cache y peticiones simultáneas
let neighborhoodsCache: Neighborhood[] | null = null;
let pendingFetchPromise: Promise<Neighborhood[]> | null = null;

export const getNeighborhoods = async (): Promise<Neighborhood[]> => {
  // 1. Si ya tenemos los barrios cargados en memoria, los devolvemos de inmediato
  if (neighborhoodsCache && neighborhoodsCache.length > 0) {
    return neighborhoodsCache;
  }

  // 2. Si ya hay una petición en proceso, reutilizamos la misma promesa
  if (pendingFetchPromise) {
    return pendingFetchPromise;
  }

  // 3. Si no hay cache ni petición en curso, hacemos la llamada HTTP
  pendingFetchPromise = (async () => {
    try {
      const { data } = await apiClient.get<NeighborhoodsResponse>('/neighborhoods');
      const list = Array.isArray(data?.data) ? data.data : [];
      
      // Guardamos en cache en memoria
      neighborhoodsCache = list;
      return list;
    } finally {
      // Limpiamos el bloqueo de petición
      pendingFetchPromise = null;
    }
  })();

  return pendingFetchPromise;
};

// Función para forzar actualización (si agregas o editas un barrio)
export const invalidateNeighborhoodsCache = () => {
  neighborhoodsCache = null;
};
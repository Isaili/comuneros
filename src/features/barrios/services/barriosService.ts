import { Neighborhood, ApiResponse } from '../types/types';
import { apiClient } from '@/core/api/apiClient';


let memoryCache: Neighborhood[] | null = null;
let fetchPromise: Promise<Neighborhood[]> | null = null;

export async function fetchNeighborhoods(): Promise<Neighborhood[]> {
 
  if (memoryCache) {
    return memoryCache;
  }

 
  if (fetchPromise) {
    return fetchPromise;
  }


  fetchPromise = apiClient
    .get<ApiResponse<Neighborhood[]>>('/neighborhoods')
    .then(({ data }) => {
      memoryCache = data.data;
      return data.data;
    })
    .finally(() => {
      fetchPromise = null;
    });

  return fetchPromise;
}

export async function createNeighborhood(name: string): Promise<Neighborhood> {
  const { data } = await apiClient.post<ApiResponse<Neighborhood>>('/neighborhoods', { name });
  
  // Actualiza la memoria RAM al instante si ya existe
  updateCache((barrios) => [data.data, ...barrios]);
  
  return data.data;
}

export async function updateNeighborhood(id: string, name: string): Promise<Neighborhood> {
  const { data } = await apiClient.patch<ApiResponse<Neighborhood>>(`/neighborhoods/${id}`, { name });

  updateCache((barrios) => barrios.map((barrio) => (barrio.id === id ? data.data : barrio)));
  
  return data.data;
}

function updateCache(updater: (barrios: Neighborhood[]) => Neighborhood[]): void {
  if (memoryCache) {
    memoryCache = updater(memoryCache);
  }
}
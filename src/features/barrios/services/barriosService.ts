import { Neighborhood, ApiResponse } from '../types/types';
import { apiClient } from '@/core/api/apiClient';

const CACHE_KEY = 'neighborhoods_cache';

export async function fetchNeighborhoods(): Promise<Neighborhood[]> {
  const { data } = await apiClient.get<ApiResponse<Neighborhood[]>>('/neighborhoods');
  window.localStorage.setItem(CACHE_KEY, JSON.stringify(data.data));
  return data.data;
}

export async function createNeighborhood(name: string): Promise<Neighborhood> {
  const { data } = await apiClient.post<ApiResponse<Neighborhood>>('/neighborhoods', { name });
  updateCache((barrios) => [data.data, ...barrios]);
  return data.data;
}

export async function updateNeighborhood(id: string, name: string): Promise<Neighborhood> {
  const { data } = await apiClient.patch<ApiResponse<Neighborhood>>(`/neighborhoods/${id}`, { name });
  updateCache((barrios) => barrios.map((barrio) => barrio.id === id ? data.data : barrio));
  return data.data;
}

function updateCache(updater: (barrios: Neighborhood[]) => Neighborhood[]): void {
  const cached = window.localStorage.getItem(CACHE_KEY);
  if (!cached) return;

  try {
    const barrios = JSON.parse(cached);
    if (Array.isArray(barrios)) {
      window.localStorage.setItem(CACHE_KEY, JSON.stringify(updater(barrios)));
    }
  } catch {
    window.localStorage.removeItem(CACHE_KEY);
  }
}
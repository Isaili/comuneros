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

export const getNeighborhoods = async (): Promise<Neighborhood[]> => {
  const cached = window.localStorage.getItem('neighborhoods_cache');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      window.localStorage.removeItem('neighborhoods_cache');
    }
  }
  const { data } = await apiClient.get<NeighborhoodsResponse>('/neighborhoods');
  window.localStorage.setItem('neighborhoods_cache', JSON.stringify(data.data));
  return data.data;
};
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
  const { data } = await apiClient.get<NeighborhoodsResponse>('/neighborhood');
  return data.data;
};
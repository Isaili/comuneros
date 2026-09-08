import { Neighborhood, ApiResponse } from '../types/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://comiseria.onrender.com/api';

export async function fetchNeighborhoods(): Promise<Neighborhood[]> {
  const res = await fetch(`${API_URL}/neighborhoods`, { cache: 'no-store' });
  if (!res.ok) throw new Error('No se pudo obtener el listado de barrios.');
  const json: ApiResponse<Neighborhood[]> = await res.json();
  return json.data;
}

export async function createNeighborhood(name: string): Promise<Neighborhood> {
  const res = await fetch(`${API_URL}/neighborhoods`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('No se pudo crear el barrio.');
  const json: ApiResponse<Neighborhood> = await res.json();
  return json.data;
}

export async function updateNeighborhood(id: string, name: string): Promise<Neighborhood> {
  const res = await fetch(`${API_URL}/neighborhoods/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('No se pudo actualizar el barrio.');
  const json: ApiResponse<Neighborhood> = await res.json();
  return json.data;
}
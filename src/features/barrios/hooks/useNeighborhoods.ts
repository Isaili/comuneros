"use client";
import { useCallback, useEffect, useState } from 'react';
import { Neighborhood } from '../types/types';
import { fetchNeighborhoods, createNeighborhood, updateNeighborhood } from '../services/barriosService';

export function useNeighborhoods() {
  const [barrios, setBarrios] = useState<Neighborhood[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarBarrios = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setBarrios(await fetchNeighborhoods());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los barrios.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { cargarBarrios(); }, [cargarBarrios]);

  const guardarBarrio = async (name: string, id?: string) => {
    if (id) {
      const actualizado = await updateNeighborhood(id, name);
      setBarrios(prev => prev.map(b => (b.id === id ? actualizado : b)));
    } else {
      const creado = await createNeighborhood(name);
      setBarrios(prev => [creado, ...prev]);
    }
  };

  return { barrios, isLoading, error, guardarBarrio, recargar: cargarBarrios };
}
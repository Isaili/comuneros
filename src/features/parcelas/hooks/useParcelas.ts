"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { Parcela, PredialHistorico, PropietarioHistorico } from '../types/domain.types';
import { plotsService } from '../services/parcelas.service';
import { detailToParcela, historyToPropietarios, parcelToParcela, parcelaToCreatePayload } from '../adapters/parcela.adapter';
import { comunerosApi } from '../../comuneros/services/comunerosApi';

interface UseParcelasOptions { pageSize?: number }
const DETALLES_CACHE_KEY = 'parcelas_detalles_cache';

const leerDetallesCache = (): Record<string, Parcela> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(DETALLES_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export function useParcelas(options: UseParcelasOptions = {}) {
  const pageSize = options.pageSize ?? 12;
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const ultimaCargaRef = useRef('');
  const detallesEnCargaRef = useRef(new Map<string, Promise<Parcela>>());
  const optimisticOwnersRef = useState(() => new Map<string, Pick<Parcela, 'propietarios' | 'titularesCount' | 'titularesDetalle'>>())[0];
  const detallesCacheRef = useState<Record<string, Parcela>>(leerDetallesCache)[0];
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setDebouncedSearchTerm(searchTerm.trim()), 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchParcelas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await plotsService.list({ page, limit: pageSize, parcelNumber: debouncedSearchTerm || undefined });
      setParcelas(response.data.items.map((parcel) => {
        const parcela = parcelToParcela(parcel, { titularesCount: parcel.activeOwnersCount });
        const override = optimisticOwnersRef.get(parcela.id);
        return override ? { ...parcela, ...override } : parcela;
      }));
      setTotal(response.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la lista de parcelas.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [page, pageSize, debouncedSearchTerm]);

  useEffect(() => {
    const key = `${page}:${pageSize}:${debouncedSearchTerm}`;
    if (ultimaCargaRef.current === key) return;
    ultimaCargaRef.current = key;
    void fetchParcelas();
  }, [fetchParcelas, page, pageSize, debouncedSearchTerm]);

  const setSearch = useCallback((value: string) => {
    setPage(1);
    setSearchTerm(value);
  }, [fetchParcelas]);

  const createParcela = useCallback(async (input: { numero: string; superficieHa: number; observaciones?: string }) => {
    const created = await plotsService.create(parcelaToCreatePayload(input));
    await fetchParcelas();
    return created;
  }, [fetchParcelas]);

  const updateParcela = useCallback(async (_id: string, _input: unknown) => {
    throw new Error('El backend no proporciona un endpoint de actualización para parcelas.');
  }, []);

  const toggleActivo = useCallback(async (_parcela: Parcela) => {
    throw new Error('El backend no proporciona endpoints de activación para parcelas.');
  }, []);

  const asignarTitular = useCallback(async (
    parcelaId: string,
    comuneroId: string,
    _nombreCompleto: string,
    hectares: number,
    certificate: string,
    transferType: string
  ) => {
    await plotsService.initialOwners(parcelaId, [{ personId: comuneroId, hectares, certificate, transferType }]);
    const ownerData = {
      propietarios: [_nombreCompleto],
      titularesCount: 1,
      titularesDetalle: [{
        comuneroId,
        nombreCompleto: _nombreCompleto,
        certificado: certificate,
        hectareasPosesion: hectares,
        calidadAgraria: 'Comunero',
        actoJuridico: transferType,
        vigencia: 'Vigente',
      }],
    };
    optimisticOwnersRef.set(parcelaId, ownerData);
    setParcelas((prev) => prev.map((parcela) => parcela.id === parcelaId
      ? {
          ...parcela,
          ...ownerData,
        }
      : parcela));
  }, []);

  const actualizarTitularLocal = useCallback((parcelaId: string, titular: {
    comuneroId: string;
    nombreCompleto: string;
    hectares: number;
    certificate: string;
    transferType: string;
  }) => {
    optimisticOwnersRef.set(parcelaId, {
      propietarios: [titular.nombreCompleto],
      titularesCount: 1,
      titularesDetalle: [{
        comuneroId: titular.comuneroId,
        nombreCompleto: titular.nombreCompleto,
        certificado: titular.certificate,
        hectareasPosesion: titular.hectares,
        calidadAgraria: 'Comunero',
        actoJuridico: titular.transferType,
        vigencia: 'Vigente',
      }],
    });
    setParcelas((prev) => prev.map((parcela) => parcela.id === parcelaId
      ? {
          ...parcela,
          propietarios: [titular.nombreCompleto],
          titularesCount: 1,
          titularesDetalle: [{
            comuneroId: titular.comuneroId,
            nombreCompleto: titular.nombreCompleto,
            certificado: titular.certificate,
            hectareasPosesion: titular.hectares,
            calidadAgraria: 'Comunero',
            actoJuridico: titular.transferType,
            vigencia: 'Vigente',
          }],
        }
      : parcela));
  }, []);

  const ejecutarTraspaso = useCallback(async (parcelaId: string, datos: {
    oldPersonId: string;
    newPersonId: string;
    certificate: string;
    transferType: string;
  }) => {
    await plotsService.transfer(parcelaId, {
      oldPersonId: datos.oldPersonId,
      newPersonId: datos.newPersonId,
      newCertificate: datos.certificate,
      transferType: datos.transferType,
    });
    await fetchParcelas();
  }, [fetchParcelas]);

  const getDetalle = useCallback(async (id: string) => {
    const cacheado = detallesCacheRef[id];
    if (cacheado) return cacheado;
    const cargaEnCurso = detallesEnCargaRef.current.get(id);
    if (cargaEnCurso) return cargaEnCurso;

    const cargarDetalle = (async () => {
      const detalleResponse = await plotsService.detail(id);
      const detalle = detailToParcela(detalleResponse);
      const historial = await plotsService.history(id, 1, 100);
      const historialConNombres = await Promise.all(historial.data.items.map(async (owner) => {
      const nombreRespuesta = owner.fullName ?? owner.ownerName ?? owner.name;
      const esNombrePlaceholder = !nombreRespuesta
        || /dueño desconocido|desconocido|unknown/i.test(nombreRespuesta);
      if (!esNombrePlaceholder) return { ...owner, fullName: nombreRespuesta };
      try {
        const persona = await comunerosApi.obtenerPorId(owner.personId);
        return { ...owner, fullName: [persona.nombre, persona.apellidoPaterno, persona.apellidoMaterno]
          .filter(Boolean)
          .join(' ') || owner.personId };
      } catch {
        return { ...owner, fullName: owner.personId };
      }
      }));
      const override = optimisticOwnersRef.get(id);
      const resultado = {
        ...detalle,
        historialPropietarios: historyToPropietarios(historialConNombres, detalleResponse.activeOwners),
        ...(detalleResponse.activeOwnersCount > 0 ? {} : (override ?? {})),
      };
      detallesCacheRef[id] = resultado;
      window.localStorage.setItem(DETALLES_CACHE_KEY, JSON.stringify(detallesCacheRef));
      return resultado;
    })();

    detallesEnCargaRef.current.set(id, cargarDetalle);
    try {
      return await cargarDetalle;
    } finally {
      detallesEnCargaRef.current.delete(id);
    }
  }, [detallesCacheRef, detallesEnCargaRef, optimisticOwnersRef]);

  const invalidarDetalle = useCallback((id: string) => {
    delete detallesCacheRef[id];
    window.localStorage.setItem(DETALLES_CACHE_KEY, JSON.stringify(detallesCacheRef));
  }, [detallesCacheRef]);

  return {
    parcelas, loading, initialLoading, error, page, totalPages, total,
    setPage, setSearch, setActiveFilter: () => undefined,
    createParcela, updateParcela, toggleActivo, asignarTitular, actualizarTitularLocal, ejecutarTraspaso,
    getDetalle,
    invalidarDetalle,
    getHistorial: plotsService.history,
    asignarDerechoUso: plotsService.usageRight,
    removerDerechoUso: plotsService.removeUsageRight,
    refetch: fetchParcelas,
  };
}

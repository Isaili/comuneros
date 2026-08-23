"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { PlotDTO } from '../types/api.types';
import { Parcela, PredialHistorico, PropietarioHistorico, TitularFila } from '../types/domain.types';
import { plotsService } from '../services/parcelas.service';
import { plotToParcela, parcelaToCreatePayload, parcelaToUpdatePayload } from '../adapters/parcela.adapter';


interface ParcelaExtras {
  estadoPredial: 'Pagado' | 'Pagar';
  propietarios: string[];
  titularesCount: number;
  titularesDetalle?: TitularFila[];
  historialPropietarios: PropietarioHistorico[];
  historialPrediales: PredialHistorico[];
}

const extrasVacias = (): ParcelaExtras => ({
  estadoPredial: 'Pagar',
  propietarios: [],
  titularesCount: 0,
  historialPropietarios: [],
  historialPrediales: [],
});

interface UseParcelasOptions {
  pageSize?: number;
}

const TITULARES_STORAGE_KEY = 'parcelas_titulares_local';

const readTitularesLocal = (): Record<string, { comuneroId: string; nombreCompleto: string }> => {
  if (typeof window === 'undefined') return {};

  try {
    const raw = window.localStorage.getItem(TITULARES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeTitularesLocal = (map: Record<string, { comuneroId: string; nombreCompleto: string }>) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(TITULARES_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // Ignorar errores de almacenamiento del navegador.
  }
};

export function useParcelas(options: UseParcelasOptions = {}) {
  const pageSize = options.pageSize ?? 10;

  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(true);

  const extrasRef = useRef<Map<string, ParcelaExtras>>(new Map());
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const mergeConExtras = useCallback((plots: PlotDTO[]) => {
    const titularesLocales = readTitularesLocal();

    return plots.map((plot) => {
      const baseExtras = extrasRef.current.get(plot.id) ?? extrasVacias();
      const titularLocal = titularesLocales[plot.id];
      const extras = titularLocal
        ? {
            ...baseExtras,
            propietarios: [titularLocal.nombreCompleto],
            titularesCount: 1,
          }
        : baseExtras;
      return plotToParcela(plot, extras);
    });
  }, []);

  const fetchParcelas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const respuesta = await plotsService.list({
        plotNumber: searchTerm || undefined,
        active: activeFilter,
        page,
        limit: pageSize,
      });
      setParcelas(mergeConExtras(respuesta.data.items));
      setTotal(respuesta.data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar la lista de parcelas.');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [searchTerm, activeFilter, page, pageSize, mergeConExtras]);

  // Debounce de búsqueda: al cambiar el texto, regresamos a la página 1.
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const setSearch = useCallback((texto: string) => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setPage(1);
      setSearchTerm(texto);
    }, 350);
  }, []);

  useEffect(() => {
    fetchParcelas();
  }, [fetchParcelas]);

  const createParcela = useCallback(async (input: {
    numero: string;
    superficieHa: number;
    observaciones?: string;
    estadoPredial: 'Pagado' | 'Pagar';
    historialPropietarios?: PropietarioHistorico[];
    historialPrediales?: PredialHistorico[];
  }) => {
    const payload = parcelaToCreatePayload({
      numero: input.numero,
      superficieHa: input.superficieHa,
      observaciones: input.observaciones,
    });
    const creado = await plotsService.create(payload);

    extrasRef.current.set(creado.id, {
      estadoPredial: input.estadoPredial,
      propietarios: [],
      titularesCount: 0,
      historialPropietarios: input.historialPropietarios ?? [],
      historialPrediales: input.historialPrediales ?? [],
    });

    await fetchParcelas();
    return creado;
  }, [fetchParcelas]);

  const updateParcela = useCallback(async (id: string, input: {
    numero?: string;
    superficieHa?: number;
    observaciones?: string;
    estadoPredial?: 'Pagado' | 'Pagar';
    historialPropietarios?: PropietarioHistorico[];
    historialPrediales?: PredialHistorico[];
  }) => {
    const payload = parcelaToUpdatePayload({
      numero: input.numero,
      superficieHa: input.superficieHa,
      observaciones: input.observaciones,
    });
    const actualizado = await plotsService.update(id, payload);

    const previas = extrasRef.current.get(id) ?? extrasVacias();
    extrasRef.current.set(id, {
      ...previas,
      estadoPredial: input.estadoPredial ?? previas.estadoPredial,
      historialPropietarios: input.historialPropietarios ?? previas.historialPropietarios,
      historialPrediales: input.historialPrediales ?? previas.historialPrediales,
    });

    await fetchParcelas();
    return actualizado;
  }, [fetchParcelas]);

  const toggleActivo = useCallback(async (parcela: Parcela) => {
    if (parcela.activo) {
      await plotsService.deactivate(parcela.id);
    } else {
      await plotsService.activate(parcela.id);
    }
    await fetchParcelas();
  }, [fetchParcelas]);


  const asignarTitular = useCallback((parcelaId: string, comuneroId: string, nombreCompleto: string) => {
    const previas = extrasRef.current.get(parcelaId) ?? extrasVacias();
    const titularesLocales = readTitularesLocal();
    titularesLocales[parcelaId] = { comuneroId, nombreCompleto };
    writeTitularesLocal(titularesLocales);

    extrasRef.current.set(parcelaId, {
      ...previas,
      propietarios: [nombreCompleto],
      titularesCount: 1,
    });
    setParcelas(prev => prev.map(p => p.id === parcelaId
      ? { ...p, propietarios: [nombreCompleto], titularesCount: 1 }
      : p));
  }, []);

  const ejecutarTraspaso = useCallback((parcelaId: string, datos: {
    adquirentes: { nombre: string; certificado: string }[];
    actoJuridico: string;
    fecha: string;
  }) => {
    const previas = extrasRef.current.get(parcelaId) ?? extrasVacias();
    const fechaOrigen = previas.historialPropietarios[0]?.fechaAdquisicion || '—';

    const dueñosSalientes: PropietarioHistorico[] = previas.propietarios.map(nombre => ({
      nombre,
      certificado: 'CERT-ANTECEDENTE',
      fechaAdquisicion: fechaOrigen,
      fechaCesion: datos.fecha,
      actoJuridico: datos.actoJuridico,
      adquirente: datos.adquirentes.map(a => a.nombre).join(', '),
      posesionHa: 0,
      esActual: false,
    }));

    const nuevosRegistros: PropietarioHistorico[] = datos.adquirentes.map(a => ({
      nombre: a.nombre,
      certificado: a.certificado,
      fechaAdquisicion: datos.fecha,
      fechaCesion: '— (Actual)',
      actoJuridico: datos.actoJuridico,
      adquirente: 'Titular Activo',
      posesionHa: 0,
      esActual: true,
    }));

    const nuevasExtras: ParcelaExtras = {
      ...previas,
      propietarios: datos.adquirentes.map(a => a.nombre),
      titularesCount: datos.adquirentes.length,
      historialPropietarios: [...nuevosRegistros, ...dueñosSalientes, ...previas.historialPropietarios],
    };
    extrasRef.current.set(parcelaId, nuevasExtras);

    setParcelas(prev => prev.map(p => p.id === parcelaId
      ? {
          ...p,
          propietarios: nuevasExtras.propietarios,
          titularesCount: nuevasExtras.titularesCount,
          historialPropietarios: nuevasExtras.historialPropietarios,
        }
      : p));
  }, []);

  return {
    parcelas,
    loading,
    initialLoading,
    error,
    page,
    totalPages,
    total,
    setPage,
    setSearch,
    activeFilter,
    setActiveFilter,
    createParcela,
    updateParcela,
    toggleActivo,
    asignarTitular,
    ejecutarTraspaso,
    refetch: fetchParcelas,
  };
}
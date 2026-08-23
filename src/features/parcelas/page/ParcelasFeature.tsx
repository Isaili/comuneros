"use client";

import React, { useEffect, useState } from 'react';
import { ParcelasHeader } from '../components/ParcelasHeader';
import { ParcelasList } from '../components/ParcelasList';
import { ParcelaDetail } from '../components/ParcelaDetail';
import { AgregarParcelaForm, ParcelaFormPayload } from '../components/AgregarParcelaForm';
import { TraspasarParcelaModal } from '../components/TraspasarParcelaModal';
import { AsignarTitularModal } from '../components/AsignarTitularModal';
import { Comunero } from '../../comuneros/types/types';
import { comunerosApi } from '../../comuneros/services/comunerosApi';
import { Parcela } from '../types/domain.types';
import { useParcelas } from '../hooks/useParcelas';
import { ApiError } from '../services/parcelas.service';

interface ParcelasFeatureProps {
  comunerosRegistrados?: Comunero[];
}

const COMUNEROS_CACHE_KEY = 'parcelas_comuneros_registrados';

const leerComunerosCache = (): Comunero[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(COMUNEROS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const ParcelasFeature: React.FC<ParcelasFeatureProps> = ({ comunerosRegistrados = [] }) => {
  const [comunerosLocal, setComunerosLocal] = useState<Comunero[]>(() => {
    if (comunerosRegistrados.length > 0) return comunerosRegistrados;
    return leerComunerosCache();
  });

  const {
    parcelas,
    initialLoading,
    error,
    page,
    totalPages,
    setPage,
    setSearch,
    setActiveFilter,
    createParcela,
    updateParcela,
    toggleActivo,
    asignarTitular,
    ejecutarTraspaso,
  } = useParcelas();

  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [parcelaAEditar, setParcelaAEditar] = useState<Parcela | null>(null);
  const [parcelaATraspasar, setParcelaATraspasar] = useState<Parcela | null>(null);
  const [parcelaAAsignarTitular, setParcelaAAsignarTitular] = useState<Parcela | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (comunerosRegistrados.length > 0) {
      setComunerosLocal(comunerosRegistrados);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(COMUNEROS_CACHE_KEY, JSON.stringify(comunerosRegistrados));
      }
      return;
    }

    let isMounted = true;

    const cargarComuneros = async () => {
      try {
        const { comuneros } = await comunerosApi.listar(1, 200);
        if (!isMounted) return;
        setComunerosLocal(comuneros);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(COMUNEROS_CACHE_KEY, JSON.stringify(comuneros));
        }
      } catch {
        if (!isMounted) return;
        setComunerosLocal(leerComunerosCache());
      }
    };

    cargarComuneros();
    return () => {
      isMounted = false;
    };
  }, [comunerosRegistrados]);

  const handleGuardarParcela = async (payload: ParcelaFormPayload) => {
    setGuardando(true);
    try {
      if (parcelaAEditar) {
        await updateParcela(parcelaAEditar.id, payload);
      } else {
        await createParcela(payload);
      }
      setIsAddModalOpen(false);
      setParcelaAEditar(null);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'No se pudo guardar la parcela.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEditarClick = (parcela: Parcela) => {
    setParcelaAEditar(parcela);
    setIsAddModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddModalOpen(false);
    setParcelaAEditar(null);
  };

  const handleTraspasarClick = (parcela: Parcela) => {
    if (parcela.propietarios.length === 0) {
      setParcelaAAsignarTitular(parcela);
    } else {
      setParcelaATraspasar(parcela);
    }
  };

  const handleConfirmarAsignacion = (comuneroId: string, nombreCompleto: string) => {
    if (!parcelaAAsignarTitular) return;

    const asignacionesGuardadas = (() => {
      if (typeof window === 'undefined') return {} as Record<string, { comuneroId: string; nombreCompleto: string }>;
      try {
        const raw = window.localStorage.getItem('parcelas_titulares_local');
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {} as Record<string, { comuneroId: string; nombreCompleto: string }>;
      }
    })();

    asignacionesGuardadas[parcelaAAsignarTitular.id] = { comuneroId, nombreCompleto };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('parcelas_titulares_local', JSON.stringify(asignacionesGuardadas));
    }

    asignarTitular(parcelaAAsignarTitular.id, comuneroId, nombreCompleto);
    setParcelaAAsignarTitular(null);
  };

  const handleEjecutarTraspaso = (datos: {
    adquirentes: { nombre: string; certificado: string }[];
    actoJuridico: string;
    motivo: string;
    fecha: string;
  }) => {
    if (!parcelaATraspasar) return;
    ejecutarTraspaso(parcelaATraspasar.id, datos);
    setParcelaATraspasar(null);
    setSelectedParcela(null);
  };

  const handleToggleActivo = async (parcela: Parcela) => {
    try {
      await toggleActivo(parcela);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'No se pudo cambiar el estado de la parcela.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">

      <ParcelasHeader
        onSearchChange={setSearch}
        onFilterChange={setActiveFilter}
        onAddClick={() => { setParcelaAEditar(null); setIsAddModalOpen(true); }}
      />

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-3 text-sm font-semibold">
          {error}
        </div>
      )}

      <div className="w-full">
        <ParcelasList
          parcelas={parcelas}
          initialLoading={initialLoading}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          selectedId={selectedParcela?.id ?? ""}
          onSelect={setSelectedParcela}
          onTraspasar={handleTraspasarClick}
          onEditar={handleEditarClick}
          onToggleActivo={handleToggleActivo}
        />
      </div>

      {selectedParcela && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedParcela(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
              <h3 className="text-base font-bold text-gray-800">Expediente de la Parcela</h3>
              <button onClick={() => setSelectedParcela(null)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-colors">
                ✕ Cerrar
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <ParcelaDetail parcela={selectedParcela} />
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AgregarParcelaForm
          onClose={handleCloseForm}
          onGuardar={handleGuardarParcela}
          parcelaAEditar={parcelaAEditar}
          guardando={guardando}
        />
      )}

      {parcelaATraspasar && (
        <TraspasarParcelaModal
          parcela={parcelaATraspasar}
          comunerosRegistrados={comunerosLocal}
          onClose={() => setParcelaATraspasar(null)}
          onConfirmar={handleEjecutarTraspaso}
        />
      )}

      {parcelaAAsignarTitular && (
        <AsignarTitularModal
          comunerosRegistrados={comunerosLocal}
          onClose={() => setParcelaAAsignarTitular(null)}
          onAsignar={handleConfirmarAsignacion}
        />
      )}
    </div>
  );
};

export default ParcelasFeature;
"use client";

import React, { useEffect, useState } from 'react';
import { ParcelasHeader } from '../components/ParcelasHeader';
import { ParcelasList } from '../components/ParcelasList';
import { ParcelaDetail } from '../components/ParcelaDetail';
import { AgregarParcelaForm, ParcelaFormPayload } from '../components/AgregarParcelaForm';
import { TraspasarParcelaModal } from '../components/TraspasarParcelaModal';
import { AsignarTitularModal } from '../components/AsignarTitularModal';
import { CargarHistorialModal } from '../components/CargarHistorialModal';
import { DerechosUsoModal } from '../components/DerechosUsoModal';
import { Comunero } from '../../comuneros/types/types';
import { comunerosApi } from '../../comuneros/services/comunerosApi';
import { Parcela } from '../types/domain.types';
import { useParcelas } from '../hooks/useParcelas';
import { ApiError } from '../services/parcelas.service';
import { plotsService } from '../services/parcelas.service';
import { detailToParcela } from '../adapters/parcela.adapter';

interface ParcelasFeatureProps {
  comunerosRegistrados?: Comunero[];
}

const COMUNEROS_CACHE_KEY = 'parcelas_comuneros_registrados';
const COMUNEROS_REGISTRADOS_VACIOS: Comunero[] = [];

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

export const ParcelasFeature: React.FC<ParcelasFeatureProps> = ({
  comunerosRegistrados = COMUNEROS_REGISTRADOS_VACIOS,
}) => {
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
    getDetalle,
    invalidarDetalle,
    cargarHistorial,
    asignarDerechoUso,
    removerDerechoUso,
  } = useParcelas();

  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [parcelaAEditar, setParcelaAEditar] = useState<Parcela | null>(null);
  const [parcelaATraspasar, setParcelaATraspasar] = useState<Parcela | null>(null);
  const [parcelaAAsignarTitular, setParcelaAAsignarTitular] = useState<Parcela | null>(null);
  const [parcelaDerechosUso, setParcelaDerechosUso] = useState<Parcela | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mostrarCargaHistorial, setMostrarCargaHistorial] = useState(false);

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
        const primeraPagina = await comunerosApi.listar(1, 200);
        const paginasRestantes = Array.from(
          { length: Math.max(0, primeraPagina.totalPages - 1) },
          (_, index) => comunerosApi.listar(index + 2, 200),
        );
        const restantes = await Promise.all(paginasRestantes);
        const comuneros = [
          ...primeraPagina.comuneros,
          ...restantes.flatMap((pagina) => pagina.comuneros),
        ].filter((comunero, index, lista) => lista.findIndex((item) => item.id === comunero.id) === index);
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

  const handleEditarClick = async (parcela: Parcela) => {
    try {
      setParcelaAEditar(await getDetalle(parcela.id));
      setIsAddModalOpen(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo cargar el expediente de la parcela.');
    }
  };

  const handleCloseForm = () => {
    setIsAddModalOpen(false);
    setParcelaAEditar(null);
  };

  const handleTraspasarClick = async (parcela: Parcela) => {
    const detalleActual = await plotsService.detail(parcela.id);
    const parcelaCompleta = detailToParcela(detalleActual);
    if (parcelaCompleta.titularesCount === 0) {
      setParcelaAAsignarTitular(parcelaCompleta);
    } else if (!parcelaCompleta.titularesDetalle?.some((titular) => titular.ownershipId)) {
      alert('El backend no devolvió el identificador de titularidad necesario para realizar el traspaso. Actualiza el detalle de la parcela e inténtalo de nuevo.');
    } else {
      setParcelaATraspasar(parcelaCompleta);
    }
  };

  const handleDerechosUsoClick = async (parcela: Parcela) => {
    try {
      setParcelaDerechosUso(await getDetalle(parcela.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo cargar los derechos de uso de la parcela.');
    }
  };

  const handleSelectParcela = async (parcela: Parcela) => {
    try {
      setSelectedParcela(await getDetalle(parcela.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'No se pudo cargar el detalle de la parcela.');
    }
  };

  const handleConfirmarAsignacion = async (datos: {
    comuneroId: string;
    nombreCompleto: string;
    hectares: number;
    certificate: string;
    transferType: string;
  }) => {
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

    asignacionesGuardadas[parcelaAAsignarTitular.id] = { comuneroId: datos.comuneroId, nombreCompleto: datos.nombreCompleto };
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('parcelas_titulares_local', JSON.stringify(asignacionesGuardadas));
    }

    invalidarDetalle(parcelaAAsignarTitular.id);
    await asignarTitular(parcelaAAsignarTitular.id, datos.comuneroId, datos.nombreCompleto, datos.hectares, datos.certificate, datos.transferType);
    const actualizada = await getDetalle(parcelaAAsignarTitular.id);
    setSelectedParcela(actualizada);
    setParcelaAAsignarTitular(null);
  };

  const handleEjecutarTraspaso = async (datos: {
    targetOwnershipId: string;
    oldPersonId: string;
    adquirente: { comuneroId: string; nombre: string; certificado: string };
    actoJuridico: string;
  }) => {
    if (!parcelaATraspasar) return;
    if (!datos.targetOwnershipId || !datos.oldPersonId || !datos.adquirente) {
      alert('No se pudo identificar a los titulares para realizar el traspaso.');
      return;
    }
    invalidarDetalle(parcelaATraspasar.id);
    await ejecutarTraspaso(parcelaATraspasar.id, {
      targetOwnershipId: datos.targetOwnershipId,
      oldPersonId: datos.oldPersonId,
      newPersonId: datos.adquirente.comuneroId,
      certificate: datos.adquirente.certificado,
      transferType: datos.actoJuridico === 'Cesión de Derechos'
        ? 'SALE'
        : datos.actoJuridico === 'Sucesión Hereditaria'
        ? 'INHERITANCE'
        : 'SALE',
    });
    const parcelaActualizada = await getDetalle(parcelaATraspasar.id);
    setSelectedParcela(parcelaActualizada);
    setParcelaATraspasar(null);
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
          onSelect={handleSelectParcela}
          onTraspasar={handleTraspasarClick}
          onEditar={handleEditarClick}
          onToggleActivo={handleToggleActivo}
          onDerechosUso={handleDerechosUsoClick}
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
              <ParcelaDetail parcela={selectedParcela} onCargarHistorial={() => setMostrarCargaHistorial(true)} />
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
          parcela={parcelaAAsignarTitular}
          comunerosRegistrados={comunerosLocal}
          onClose={() => setParcelaAAsignarTitular(null)}
          onAsignar={handleConfirmarAsignacion}
        />
      )}

      {mostrarCargaHistorial && selectedParcela && (
        <CargarHistorialModal
          comuneros={comunerosLocal}
          onClose={() => setMostrarCargaHistorial(false)}
          onGuardar={async (registro) => {
            await cargarHistorial(selectedParcela.id, [registro]);
            setSelectedParcela(await getDetalle(selectedParcela.id));
          }}
        />
      )}

      {parcelaDerechosUso && (
        <DerechosUsoModal
          parcela={parcelaDerechosUso}
          comunerosRegistrados={comunerosLocal}
          onClose={() => setParcelaDerechosUso(null)}
          onAsignar={async (personId) => {
            await asignarDerechoUso(parcelaDerechosUso.id, personId);
            if (selectedParcela?.id === parcelaDerechosUso.id) {
              setSelectedParcela(await getDetalle(parcelaDerechosUso.id));
            }
          }}
          onRemover={async (personId) => {
            await removerDerechoUso(parcelaDerechosUso.id, personId);
            if (selectedParcela?.id === parcelaDerechosUso.id) {
              setSelectedParcela(await getDetalle(parcelaDerechosUso.id));
            }
          }}
        />
      )}
    </div>
  );
};

export default ParcelasFeature;
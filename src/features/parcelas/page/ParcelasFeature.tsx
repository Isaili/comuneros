"use client";

import React, { useState } from 'react';
import { ParcelasHeader } from '../components/ParcelasHeader';
import { ParcelasList } from '../components/ParcelasList';
import { ParcelaDetail } from '../components/ParcelaDetail';
import { AgregarParcelaForm, ParcelaFormPayload } from '../components/AgregarParcelaForm';
import { TraspasarParcelaModal } from '../components/TraspasarParcelaModal';
import { AsignarTitularModal } from '../components/AsignarTitularModal';
import { Comunero } from '../../comuneros/types/types';
import { Parcela } from '../types/domain.types';
import { useParcelas } from '../hooks/useParcelas';
import { ApiError } from '../services/parcelas.service';

interface ParcelasFeatureProps {
  comunerosRegistrados?: Comunero[];
}

export const ParcelasFeature: React.FC<ParcelasFeatureProps> = ({ comunerosRegistrados = [] }) => {
  const {
    parcelas,
    loading,
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
          loading={loading}
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
          comunerosRegistrados={comunerosRegistrados}
          onClose={() => setParcelaATraspasar(null)}
          onConfirmar={handleEjecutarTraspaso}
        />
      )}

      {parcelaAAsignarTitular && (
        <AsignarTitularModal
          comunerosRegistrados={comunerosRegistrados}
          onClose={() => setParcelaAAsignarTitular(null)}
          onAsignar={handleConfirmarAsignacion}
        />
      )}
    </div>
  );
};

export default ParcelasFeature;
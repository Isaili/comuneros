"use client";
import React, { useState } from 'react';
import { BarriosHeader } from '../components/BarriosHeader';
import { BarriosList } from '../components/BarriosList';
import { AgregarBarrioForm } from '../components/AgregarBarrioForm';
import { useNeighborhoods } from '../hooks/useNeighborhoods';
import { Neighborhood } from '../types/types';

interface BarriosFeatureProps {
  onVolver: () => void;
}

export const BarriosFeature: React.FC = () => {
  const { barrios, isLoading, error, guardarBarrio, recargar } = useNeighborhoods();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [barrioAEditar, setBarrioAEditar] = useState<Neighborhood | null>(null);

  const handleAdd = () => { setBarrioAEditar(null); setIsModalOpen(true); };
  const handleEditar = (b: Neighborhood) => { setBarrioAEditar(b); setIsModalOpen(true); };
  const handleClose = () => { setIsModalOpen(false); setBarrioAEditar(null); };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      <BarriosHeader onAddClick={handleAdd} />

      {isLoading ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium text-sm shadow-sm">
          Cargando barrios...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center text-red-600 font-semibold text-sm space-y-3">
          <p>{error}</p>
          <button onClick={recargar} className="px-4 py-2 bg-white border border-red-200 rounded-lg text-xs font-bold hover:bg-red-50">
            Reintentar
          </button>
        </div>
      ) : (
        <BarriosList barrios={barrios} onEditar={handleEditar} />
      )}

      {isModalOpen && (
        <AgregarBarrioForm onClose={handleClose} onGuardar={guardarBarrio} barrioAEditar={barrioAEditar} />
      )}
    </div>
  );
};

export default BarriosFeature;
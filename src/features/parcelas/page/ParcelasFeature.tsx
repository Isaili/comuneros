"use client";

import React, { useState } from 'react';

import { ParcelasHeader } from '../components/ParcelasHeader';
import { ParcelasList, Parcela } from '../components/ParcelasList';
import { ParcelaDetail } from '../components/ParcelaDetail';

const MOCK_PARCELAS: Parcela[] = [
  { id: '1', numero: 'P-001', superficie: '2.50 ha', titularesCount: 2, propietarios: ['José A. Hernández López', 'María G. Pérez Martínez'], estadoPredial: 'Pagado' },
  { id: '2', numero: 'P-002', superficie: '1.75 ha', titularesCount: 1, propietarios: ['Pedro Jiménez Vázquez'], estadoPredial: 'Pagado' },
  { id: '3', numero: 'P-003', superficie: '3.20 ha', titularesCount: 3, propietarios: ['Rosa Elena Gómez Díaz', 'Carlos A. López Hernández', 'Ana Laura Vázquez Pérez'], estadoPredial: 'Pagar' },
  { id: '4', numero: 'P-004', superficie: '2.00 ha', titularesCount: 1, propietarios: ['Miguel Ángel Martínez Gómez'], estadoPredial: 'Pagado' },
  { id: '5', numero: 'P-005', superficie: '4.10 ha', titularesCount: 2, propietarios: ['Juan Carlos Pérez López', 'María del Carmen Díaz'], estadoPredial: 'Pagar' },
  { id: '6', numero: 'P-006', superficie: '1.20 ha', titularesCount: 1, propietarios: ['Luis Antonio Méndez'], estadoPredial: 'Pagado' },
  { id: '7', numero: 'P-007', superficie: '2.75 ha', titularesCount: 2, propietarios: ['Francisco Javier Gómez', 'Elena Vázquez Martínez'], estadoPredial: 'Pagar' },
  { id: '8', numero: 'P-008', superficie: '3.60 ha', titularesCount: 1, propietarios: ['Beatriz Hernández López'], estadoPredial: 'Pagado' }
];

export const ParcelasFeature: React.FC = () => {
  const [parcelas] = useState<Parcela[]>(MOCK_PARCELAS);
  
  // Iniciamos en null para que el modal empiece cerrado
  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParcelas = parcelas.filter(p => 
    p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.propietarios.some((prop: string) => prop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in w-full px-2 py-2 max-w-[1600px] mx-auto relative">
      
      {/* 1. Componente Superior de Filtros */}
      <ParcelasHeader 
        onSearchChange={setSearchTerm} 
        onAddClick={() => alert('Añadir nueva parcela')} 
      />

      {/* Lista de Registros a Ancho Completo */}
      <div className="w-full">
        {filteredParcelas.length > 0 ? (
          <ParcelasList 
            parcelas={filteredParcelas}
            selectedId={selectedParcela?.id ?? ""} // Evita fallos en Props de TypeScript si está cerrado
            onSelect={setSelectedParcela}
          />
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-12 text-center text-gray-400 font-medium text-sm shadow-sm">
            No se encontraron parcelas que coincidan con la búsqueda.
          </div>
        )}
      </div>

      {/* VENTANA MODAL COMPACTA: Despliega los detalles por encima de la lista */}
      {selectedParcela && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          
          {/* Fondo interactivo que cierra el modal al dar clic por fuera */}
          <div className="absolute inset-0" onClick={() => setSelectedParcela(null)} />

          {/* Tarjeta contenedora con ancho reducido (max-w-2xl) y altura equilibrada (max-h-[85vh]) */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 animate-slide-up">
            
            {/* Cabecera superior del Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
              <h3 className="text-base font-bold text-gray-800">Expediente de la Parcela</h3>
              <button 
                onClick={() => setSelectedParcela(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-colors"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Contenido inyectado de la parcela con paddings estilizados */}
            <div className="p-5 sm:p-6">
              <ParcelaDetail parcela={selectedParcela} />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ParcelasFeature;
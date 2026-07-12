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
  const [selectedParcela, setSelectedParcela] = useState<Parcela>(MOCK_PARCELAS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParcelas = parcelas.filter(p => 
    p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.propietarios.some((prop: string) => prop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    // 💡 Reducimos paddings globales en móvil (p-1 a sm:p-2) para evitar que se coma espacio en pantallas chicas
    <div className="space-y-5 sm:space-y-6 animate-fade-in w-full px-1 py-2 max-w-[1600px] mx-auto">
      
      {/* 1. Componente Superior de Filtros */}
      <ParcelasHeader 
        onSearchChange={setSearchTerm} 
        onAddClick={() => alert('Añadir nueva parcela')} 
      />

      {/* Grid Principal Modulado (1 columna en móvil, 12 columnas en Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* 2. Lista de Registros Izquierda */}
        {/* 💡 En móvil (lg:col-span-7) ocupará el 100% de ancho y se posicionará arriba */}
        <div className="lg:col-span-7 w-full order-1">
          <ParcelasList 
            parcelas={filteredParcelas}
            selectedId={selectedParcela?.id}
            onSelect={setSelectedParcela}
          />
        </div>

        {/* 3. Panel Detallado Derecho */}
        {/* 💡 En móvil (lg:col-span-5) ocupará el 100% abajo de la lista de forma natural y limpia */}
        <div className="lg:col-span-5 w-full order-2">
          {selectedParcela ? (
            <ParcelaDetail parcela={selectedParcela} />
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-12 text-center text-gray-400 font-medium text-sm shadow-sm">
              Selecciona una parcela de la lista para ver su expediente.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ParcelasFeature;
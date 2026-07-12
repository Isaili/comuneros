"use client";

import React, { useState } from 'react';
import { LotesHeader } from '../components/LotesHeader';
import { LotesList, Lote } from '../components/LotesList';
import { LoteDetail } from '../components/LoteDetail';

const MOCK_LOTES: Lote[] = [
  { id: 'l1', numero: 'L-001', folio: 'L-001', superficie: '300.00 m²', propietarios: ['José Antonio Hernández López'], estadoPredial: 'Pagado' },
  { id: 'l2', numero: 'L-002', folio: 'L-002', superficie: '250.00 m²', propietarios: ['María G. Pérez Martínez'], estadoPredial: 'Pagado' },
  { id: 'l3', numero: 'L-003', folio: 'L-003', superficie: '180.00 m²', propietarios: ['Pedro Jiménez Vázquez'], estadoPredial: 'Pagar' },
  { id: 'l4', numero: 'L-004', folio: 'L-004', superficie: '350.00 m²', propietarios: ['Rosa Elena Gómez Díaz'], estadoPredial: 'Pagado' },
  { id: 'l5', numero: 'L-005', folio: 'L-005', superficie: '200.00 m²', propietarios: ['Carlos A. López Hernández'], estadoPredial: 'Pagar' },
  { id: 'l6', numero: 'L-006', folio: 'L-006', superficie: '275.00 m²', propietarios: ['Ana Laura Vázquez Pérez'], estadoPredial: 'Pagado' },
  { id: 'l7', numero: 'L-007', folio: 'L-007', superficie: '150.00 m²', propietarios: ['Miguel Ángel Martínez Gómez'], estadoPredial: 'Pagar' },
  { id: 'l8', numero: 'L-008', folio: 'L-008', superficie: '400.00 m²', propietarios: ['Juan Carlos Pérez López'], estadoPredial: 'Pagado' }
];

export const LotesFeature: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'parcelas' | 'lotes'>('lotes');
  const [lotes] = useState<Lote[]>(MOCK_LOTES);
  const [selectedLote, setSelectedLote] = useState<Lote>(MOCK_LOTES[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLotes = lotes.filter(l => 
    l.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.propietarios.some((prop: string) => prop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Asegura que siempre haya un lote seleccionado visible si el filtro cambia
  const activeLote = filteredLotes.find(l => l.id === selectedLote?.id) || filteredLotes[0];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto">
      
      {/* 1. Encabezado y Filtros Adaptativos */}
      <LotesHeader 
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
        onSearchChange={setSearchTerm} 
        onAddClick={() => alert('Añadir nuevo lote')} 
      />

      {/* Switcher de vistas principal */}
      {currentTab === 'lotes' ? (
        /* Grid de Distribución Modular: Colapsa a 1 columna en móvil, 12 columnas desde LG (Large) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          
          {/* 2. Tabla de Lotes (Ocupa 7/12 del espacio en pantallas grandes) */}
          <div className="lg:col-span-7 w-full order-1">
            <LotesList 
              lotes={filteredLotes}
              selectedId={activeLote?.id}
              onSelect={setSelectedLote}
            />
          </div>

          {/* 3. Panel de Detalle Derecho (Ocupa 5/12 del espacio en pantallas grandes) */}
          <div className="lg:col-span-5 w-full order-2">
            {activeLote ? (
              <LoteDetail lote={activeLote} />
            ) : (
              <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-12 text-center text-gray-400 font-medium text-xs sm:text-sm shadow-sm">
                No se encontraron lotes que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-12 text-center text-gray-400 font-semibold text-xs sm:text-sm shadow-sm animate-fade-in">
          Redireccionando al panel de Parcelas...
        </div>
      )}
    </div>
  );
};

export default LotesFeature;
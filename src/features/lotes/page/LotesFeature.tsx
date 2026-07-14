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
  
  // Iniciamos en null para que el modal empiece cerrado
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLotes = lotes.filter(l => 
    l.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.propietarios.some((prop: string) => prop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      
      {/* 1. Encabezado y Filtros Adaptativos */}
      <LotesHeader 
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
        onSearchChange={setSearchTerm} 
        onAddClick={() => alert('Añadir nuevo lote')} 
      />

      {/* Switcher de vistas principal */}
      {currentTab === 'lotes' ? (
        /* Lista de Lotes a Ancho Completo (100% de la vista) */
        <div className="w-full">
          {filteredLotes.length > 0 ? (
            <LotesList 
              lotes={filteredLotes}
              selectedId={selectedLote?.id ?? ""} // Evita fallos de TypeScript si está cerrado
              onSelect={setSelectedLote}
            />
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-12 text-center text-gray-400 font-medium text-xs sm:text-sm shadow-sm">
              No se encontraron lotes que coincidan con la búsqueda.
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-12 text-center text-gray-400 font-semibold text-xs sm:text-sm shadow-sm animate-fade-in">
          Redireccionando al panel de Parcelas...
        </div>
      )}

      {/* VENTANA MODAL COMPACTA: Despliega los detalles por encima de la lista */}
      {currentTab === 'lotes' && selectedLote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          
          {/* Fondo interactivo que cierra el modal al dar clic por fuera */}
          <div className="absolute inset-0" onClick={() => setSelectedLote(null)} />

          {/* Tarjeta contenedora con ancho reducido (max-w-2xl) y altura equilibrada (max-h-[85vh]) */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 animate-slide-up">
            
            {/* Cabecera superior del Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
              <h3 className="text-base font-bold text-gray-800">Expediente del Lote</h3>
              <button 
                onClick={() => setSelectedLote(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-colors"
              >
                ✕ Cerrar
              </button>
            </div>

            {/* Contenido inyectado del lote con paddings estilizados */}
            <div className="p-5 sm:p-6">
              <LoteDetail lote={selectedLote} />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LotesFeature;
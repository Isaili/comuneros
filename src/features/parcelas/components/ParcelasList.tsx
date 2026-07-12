"use client";

import React, { useState } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Parcela {
  id: string;
  numero: string;
  superficie: string;
  titularesCount: number;
  propietarios: string[];
  estadoPredial: 'Pagado' | 'Pagar';
}

interface ListProps {
  parcelas: Parcela[];
  selectedId: string;
  onSelect: (parcela: Parcela) => void;
}

export const ParcelasList: React.FC<ListProps> = ({ parcelas, selectedId, onSelect }) => {
  const [activeTab, setActiveTab] = useState<'parcelas' | 'lotes'>('parcelas');

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col justify-between min-h-[650px] w-full">
      <div>
        {/* Tabs de navegación internas de la lista */}
        <div className="flex items-center gap-1 border-b border-gray-100 mb-4">
          <button 
            onClick={() => setActiveTab('parcelas')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'parcelas' ? 'border-[#006837] text-[#006837]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Parcelas
          </button>
          <button 
            onClick={() => setActiveTab('lotes')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'lotes' ? 'border-[#006837] text-[#006837]' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Lotes
          </button>
        </div>

        {/* Encabezado descriptivo */}
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-gray-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <h3 className="font-bold text-gray-900 text-sm">
            Lista de parcelas ({parcelas.length})
          </h3>
        </div>

        {/* Tabla Responsiva con contenedor de Scroll */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 px-2 text-[10px]">Núm. Parcela</th>
                <th className="pb-3 px-2 text-[10px]">Superficie</th>
                <th className="pb-3 px-2 text-[10px] text-center">Titulares</th>
                <th className="pb-3 px-2 text-[10px]">Propietario(s)</th>
                <th className="pb-3 px-2 text-[10px]">Estado predial</th>
                <th className="pb-3 px-2 text-[10px] text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
              {parcelas.map((p) => {
                const isSelected = selectedId === p.id;
                return (
                  <tr 
                    key={p.id}
                    onClick={() => onSelect(p)}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'bg-slate-50/90' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <td className="py-3.5 px-2 font-bold text-gray-900">{p.numero}</td>
                    <td className="py-3.5 px-2 text-gray-600">{p.superficie}</td>
                    <td className="py-3.5 px-2 text-center">
                      <span className="inline-block bg-emerald-50 text-emerald-700 font-bold text-[11px] px-2 py-0.5 rounded-full border border-emerald-100">
                        {p.titularesCount}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 max-w-[180px]">
                      <div className="space-y-0.5">
                        {p.propietarios.map((name, i) => (
                          <p key={i} className="truncate text-gray-800 text-[11px] font-semibold leading-tight">{name}</p>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        p.estadoPredial === 'Pagado' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {p.estadoPredial}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-400 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación Adaptable Móvil / Desktop */}
      <div className="flex items-center justify-between sm:justify-center gap-1.5 pt-4 border-t border-gray-50 text-xs font-bold text-gray-500 mt-4">
        
        {/* Botón Izquierda */}
        <button className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        {/* Vista Mobile: Indicador compacto */}
        <span className="inline sm:hidden text-gray-600 font-medium">
          Pág. 1 de 20
        </span>

        {/* Vista Desktop: Paginación Completa */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button className="w-7 h-7 rounded-lg bg-[#006837] text-white flex items-center justify-center">1</button>
          <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-gray-50 flex items-center justify-center transition-colors">2</button>
          <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-gray-50 flex items-center justify-center transition-colors">3</button>
          <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-gray-50 flex items-center justify-center transition-colors">4</button>
          <span className="px-0.5 text-gray-300 select-none">...</span>
          <button className="w-7 h-7 rounded-lg border border-transparent hover:bg-gray-50 flex items-center justify-center transition-colors">20</button>
        </div>
        
        {/* Botón Derecha */}
        <button className="p-1.5 rounded-lg border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
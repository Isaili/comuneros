"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';

export interface Lote {
  id: string;
  numero: string;
  folio: string;
  superficie: string;
  propietarios: string[];
  estadoPredial: 'Pagado' | 'Pagar';
}

interface ListProps {
  lotes: Lote[];
  selectedId: string;
  onSelect: (lote: Lote) => void;
  onEdit?: (lote: Lote) => void;   // Callback para editar
  onDelete?: (lote: Lote) => void; // Callback para eliminar
}

export const LotesList: React.FC<ListProps> = ({ 
  lotes, 
  selectedId, 
  onSelect, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col justify-between min-h-[600px] sm:min-h-[680px] w-full">
      <div>
        {/* Encabezado descriptivo */}
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-4 h-4 text-gray-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <h3 className="font-bold text-gray-900 text-sm">
            Lista de lotes ({lotes.length})
          </h3>
        </div>

        {/* Tabla responsiva con scroll horizontal optimizado */}
        <div className="overflow-x-auto scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-xs border-collapse min-w-[580px]">
            <thead>
              <tr className="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 px-2.5 text-[10px]">Núm. Lote</th>
                <th className="pb-3 px-2.5 text-[10px]">Folio</th>
                <th className="pb-3 px-2.5 text-[10px]">Superficie</th>
                <th className="pb-3 px-2.5 text-[10px]">Propietario(s)</th>
                <th className="pb-3 px-2.5 text-[10px]">Estado predial</th>
                <th className="pb-3 px-2.5 text-center w-24 text-[10px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
              {lotes.map((l) => {
                const isSelected = selectedId === l.id;
                return (
                  <tr 
                    key={l.id}
                    onClick={() => onSelect(l)}
                    className={`cursor-pointer transition-all border-l-4 ${
                      isSelected 
                        ? 'bg-slate-50/90 border-l-[#006837]' 
                        : 'hover:bg-gray-50/50 border-l-transparent'
                    }`}
                  >
                    <td className="py-3.5 px-2.5 font-bold text-gray-900">{l.numero}</td>
                    <td className="py-3.5 px-2.5 font-mono text-gray-400 text-[11px]">{l.folio}</td>
                    <td className="py-3.5 px-2.5 text-gray-600">{l.superficie}</td>
                    <td className="py-3.5 px-2.5 max-w-[180px]">
                      <div className="space-y-0.5">
                        {l.propietarios.map((name, i) => (
                          <p key={i} className="truncate text-gray-800 text-[11px] font-semibold leading-tight">
                            {name}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-2.5">
                      <span className={`inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        l.estadoPredial === 'Pagado' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {l.estadoPredial}
                      </span>
                    </td>
                    {/* Columna de acciones con detener propagación para evitar disparar onSelect */}
                    <td className="py-3.5 px-2.5" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => onEdit?.(l)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600 transition-all"
                          title="Editar lote"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => onDelete?.(l)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-red-200 hover:bg-red-50 text-red-500 transition-all"
                          title="Eliminar lote"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación Adaptativa */}
      <div className="flex items-center justify-between sm:justify-center gap-1.5 pt-4 border-t border-gray-50 text-xs font-bold text-gray-500 mt-4">
        <button className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors min-w-[36px] flex items-center justify-center">
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <span className="inline sm:hidden text-gray-600 font-semibold px-2">
          Pág. 1 de 13
        </span>

        <div className="hidden sm:flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-xl bg-[#006837] text-white flex items-center justify-center shadow-xs">1</button>
          <button className="w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors">2</button>
          <button className="w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors">3</button>
          <button className="w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors">4</button>
          <span className="px-1 text-gray-300 select-none">...</span>
          <button className="w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors">13</button>
        </div>
        
        <button className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors min-w-[36px] flex items-center justify-center">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
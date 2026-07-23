"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';

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
  onEdit?: (lote: Lote) => void;
  onDelete?: (lote: Lote) => void;
  onTraspasar?: (lote: Lote) => void;
}

export const LotesList: React.FC<ListProps> = ({ 
  lotes, 
  selectedId, 
  onSelect, 
  onEdit, 
  onDelete,
  onTraspasar 
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between min-h-[600px] w-full">
      <div>
        {/* Encabezado descriptivo */}
        <h3 className="font-bold text-gray-900 mb-4 text-base">
          Lista de lotes ({lotes.length})
        </h3>

        {/* Tabla responsiva con scroll horizontal */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-2">Núm. Lote</th>
                <th className="py-3 px-2">Folio</th>
                <th className="py-3 px-2">Superficie</th>
                <th className="py-3 px-2">Propietario(s)</th>
                <th className="py-3 px-2">Estado predial</th>
                <th className="py-3 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {lotes.map((l) => {
                const isSelected = selectedId === l.id;
                return (
                  <tr 
                    key={l.id}
                    onClick={() => onSelect(l)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected ? 'bg-[#006837]/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Número de Lote */}
                    <td className={`py-3 px-2 font-bold ${isSelected ? 'text-[#006837]' : 'text-gray-900'}`}>
                      {l.numero}
                    </td>

                    {/* Folio */}
                    <td className="py-3 px-2 font-mono text-gray-400 text-xs font-semibold whitespace-nowrap">
                      {l.folio}
                    </td>

                    {/* Superficie */}
                    <td className="py-3 px-2 text-gray-600 font-medium whitespace-nowrap">
                      {l.superficie}
                    </td>

                    {/* Propietarios */}
                    <td className="py-3 px-2 max-w-[180px]">
                      <div className="space-y-0.5">
                        {l.propietarios.map((name, i) => (
                          <p key={i} className="truncate text-gray-900 font-bold leading-tight text-sm group-hover:text-gray-900">
                            {name}
                          </p>
                        ))}
                      </div>
                    </td>

                    {/* Estado Predial */}
                    <td className="py-3 px-2 whitespace-nowrap">
                      {l.estadoPredial === 'Pagado' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {l.estadoPredial}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                          {l.estadoPredial}
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Botón Traspasar Lote */}
                        <button 
                          onClick={() => onTraspasar?.(l)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-amber-200 hover:bg-amber-50 text-amber-600 transition-all"
                          title="Traspasar titularidad de lote"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>

                        {/* Botón Editar Lote */}
                        <button 
                          onClick={() => onEdit?.(l)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600 transition-all"
                          title="Editar lote"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Botón Eliminar Lote */}
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

      {/* Paginación */}
      <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-50 text-xs font-bold text-gray-600 mt-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-lg bg-[#006837] text-white flex items-center justify-center">1</button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">2</button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">3</button>
        <span className="px-1 text-gray-400">...</span>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">13</button>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
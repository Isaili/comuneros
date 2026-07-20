"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Pencil, Trash2, ArrowRightLeft } from 'lucide-react';
import { Parcela } from '../types/types'; 

interface ListProps {
  parcelas: Parcela[];
  selectedId: string;
  onSelect: (parcela: Parcela) => void;
  onEditar?: (parcela: Parcela) => void;
  onDelete?: (parcela: Parcela) => void; 
  onTraspasar?: (parcela: Parcela) => void; 
}

export const ParcelasList: React.FC<ListProps> = ({ 
  parcelas, 
  selectedId, 
  onSelect,
  onEditar,
  onDelete,
  onTraspasar 
}) => {
  const [activeTab, setActiveTab] = useState<'parcelas' | 'lotes'>('parcelas');

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between min-h-[600px] w-full">
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
        <h3 className="font-bold text-gray-900 mb-4 text-base">
          Lista de {activeTab === 'parcelas' ? 'parcelas' : 'lotes'} ({parcelas.length})
        </h3>

        {/* Tabla Responsiva con contenedor de Scroll */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-2">Núm. {activeTab === 'parcelas' ? 'Parcela' : 'Lote'}</th>
                <th className="py-3 px-2">Superficie</th>
                <th className="py-3 px-2 text-center">Titulares</th>
                <th className="py-3 px-2">Propietario(s)</th>
                <th className="py-3 px-2">Estado predial</th>
                <th className="py-3 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parcelas.map((p) => {
                const isSelected = selectedId === p.id;
                return (
                  <tr 
                    key={p.id}
                    onClick={() => onSelect(p)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected ? 'bg-[#006837]/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Número */}
                    <td className={`py-3 px-2 font-bold ${isSelected ? 'text-[#006837]' : 'text-gray-900'}`}>
                      {p.numero}
                    </td>
                    
                    {/* Superficie */}
                    <td className="py-3 px-2 text-gray-600 font-medium whitespace-nowrap">
                      {p.superficie}
                    </td>
                    
                    {/* Titulares */}
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {p.titularesCount}
                      </span>
                    </td>
                    
                    {/* Propietarios */}
                    <td className="py-3 px-2 max-w-[180px]">
                      <div className="space-y-0.5">
                        {p.propietarios.map((name, i) => (
                          <p key={i} className="truncate text-gray-900 font-bold leading-tight text-sm group-hover:text-gray-900">
                            {name}
                          </p>
                        ))}
                      </div>
                    </td>
                    
                    {/* Estado predial */}
                    <td className="py-3 px-2 whitespace-nowrap">
                      {p.estadoPredial === 'Pagado' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {p.estadoPredial}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-red-50 text-red-600 border border-red-100">
                          {p.estadoPredial}
                        </span>
                      )}
                    </td>
                    
                    {/* Acciones */}
                    <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Botón Traspasar */}
                        <button 
                          onClick={() => onTraspasar?.(p)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-amber-200 hover:bg-amber-50 text-amber-600 transition-all"
                          title="Traspasar derechos (Tracto Sucesivo)"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>

                        {/* Botón Editar */}
                        <button 
                          onClick={() => onEditar?.(p)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600 transition-all"
                          title="Editar registro"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        
                        {/* Botón Eliminar */}
                        <button 
                          onClick={() => onDelete?.(p)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-red-200 hover:bg-red-50 text-red-500 transition-all"
                          title="Eliminar registro"
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
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">20</button>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
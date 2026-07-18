"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, UserX, FileWarning, MoreHorizontal } from 'lucide-react';
import { Multa } from '../types/types';

interface ListProps {
  multas: Multa[];
  selectedId: string;
  onSelect: (multa: Multa) => void;
  onPagarClick: (multa: Multa) => void;
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export const MultasList: React.FC<ListProps> = ({ multas, selectedId, onSelect, onPagarClick }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between min-h-[600px]">
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h3 className="font-bold text-gray-900 text-base">
            Multas registradas ({multas.length})
          </h3>
        </div>

        <div className="overflow-x-auto scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="w-full text-left text-sm border-collapse min-w-[580px]">
            <thead>
              <tr className="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="pb-3 px-2.5 text-xs">Comunero</th>
                <th className="pb-3 px-2.5 text-xs">Tipo</th>
                <th className="pb-3 px-2.5 text-xs">Fecha</th>
                <th className="pb-3 px-2.5 text-xs">Cantidad</th>
                <th className="pb-3 px-2.5 text-xs">Estado</th>
                <th className="pb-3 px-2.5 text-center w-24 text-xs">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
              {multas.map((m) => {
                const isSelected = selectedId === m.id;
                return (
                  <tr
                    key={m.id}
                    onClick={() => onSelect(m)}
                    className={`cursor-pointer transition-all border-l-4 ${
                      isSelected ? 'bg-slate-50/90 border-l-[#1E4D3A]' : 'hover:bg-gray-50/50 border-l-transparent'
                    }`}
                  >
                    <td className="py-3.5 px-2.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.comuneroFotografia}
                          alt={m.comuneroNombre}
                          className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{m.comuneroNombre}</p>
                          <p className="text-xs text-gray-400 font-mono">{m.folio}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-2.5 whitespace-nowrap">
                      {m.tipo === 'inasistencia' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          <UserX className="w-3 h-3" />
                          Inasistencia
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <FileWarning className="w-3 h-3" />
                          Otro
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-2.5 text-gray-500 text-sm whitespace-nowrap">
                      {new Date(m.fechaGeneracion).toLocaleDateString('es-MX')}
                    </td>

                    <td className="py-3.5 px-2.5 font-bold text-gray-900 whitespace-nowrap">
                      {formatoMoneda(m.cantidad)}
                    </td>

                    <td className="py-3.5 px-2.5">
                      <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-md ${
                        m.estado === 'pagada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {m.estado === 'pagada' ? 'Pagada' : 'Pendiente'}
                      </span>
                    </td>

                    <td className="py-3.5 px-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                      {m.estado === 'pendiente' && (
                        <button
                          onClick={() => onPagarClick(m)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-[#1E4D3A]/30 hover:bg-[#1E4D3A]/5 text-[#1E4D3A] transition-all"
                          title="Registrar pago"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-center gap-1.5 pt-4 border-t border-gray-50 text-sm font-bold text-gray-500 mt-4">
        <button className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors min-w-[36px] flex items-center justify-center">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="inline sm:hidden text-gray-600 font-semibold px-2">Pág. 1 de 4</span>

        <div className="hidden sm:flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-xl bg-[#1E4D3A] text-white flex items-center justify-center shadow-xs">1</button>
          <button className="w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors">2</button>
          <button className="w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors">3</button>
          <button className="w-8 h-8 rounded-xl hover:bg-gray-50 flex items-center justify-center transition-colors">4</button>
        </div>

        <button className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors min-w-[36px] flex items-center justify-center">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
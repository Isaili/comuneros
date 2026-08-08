"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Pencil, ArrowRightLeft, Power, PowerOff, Loader2 } from 'lucide-react';
import { Parcela } from '../types/domain.types';

interface ListProps {
  parcelas: Parcela[];
  selectedId: string;
  loading?: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelect: (parcela: Parcela) => void;
  onEditar?: (parcela: Parcela) => void;
  onToggleActivo?: (parcela: Parcela) => void;
  onTraspasar?: (parcela: Parcela) => void;
}

export const ParcelasList: React.FC<ListProps> = ({
  parcelas,
  selectedId,
  loading = false,
  page,
  totalPages,
  onPageChange,
  onSelect,
  onEditar,
  onToggleActivo,
  onTraspasar,
}) => {
  const paginasVisibles = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between min-h-[600px] w-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-base">
            Lista de parcelas ({parcelas.length})
          </h3>
          {loading && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Cargando...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-2">Núm. Parcela</th>
                <th className="py-3 px-2">Superficie</th>
                <th className="py-3 px-2 text-center">Titulares</th>
                <th className="py-3 px-2">Propietario(s)</th>
                <th className="py-3 px-2">Estado predial</th>
                <th className="py-3 px-2">Registro</th>
                <th className="py-3 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {parcelas.length === 0 && !loading && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400 text-sm">
                    No se encontraron parcelas.
                  </td>
                </tr>
              )}
              {parcelas.map((p) => {
                const isSelected = selectedId === p.id;
                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelect(p)}
                    className={`cursor-pointer transition-colors group ${isSelected ? 'bg-[#006837]/5' : 'hover:bg-gray-50'} ${!p.activo ? 'opacity-60' : ''}`}
                  >
                    <td className={`py-3 px-2 font-bold ${isSelected ? 'text-[#006837]' : 'text-gray-900'}`}>
                      {p.numero}
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-medium whitespace-nowrap">{p.superficie}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {p.titularesCount}
                      </span>
                    </td>
                    <td className="py-3 px-2 max-w-[180px]">
                      <div className="space-y-0.5">
                        {p.propietarios.length > 0 ? (
                          p.propietarios.map((name, i) => (
                            <p key={i} className="truncate text-gray-900 font-bold leading-tight text-sm">{name}</p>
                          ))
                        ) : (
                          <p className="text-gray-400 text-xs">Sin titular</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${p.estadoPredial === 'Pagado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {p.estadoPredial}
                      </span>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${p.activo ? 'bg-slate-100 text-slate-600' : 'bg-gray-200 text-gray-500'}`}>
                        {p.activo ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onTraspasar?.(p)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-amber-200 hover:bg-amber-50 text-amber-600 transition-all"
                          title="Traspasar titularidad"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditar?.(p)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600 transition-all"
                          title="Editar registro"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onToggleActivo?.(p)}
                          className={`p-2 border border-gray-100 rounded-lg transition-all ${p.activo ? 'hover:border-red-200 hover:bg-red-50 text-red-500' : 'hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600'}`}
                          title={p.activo ? 'Desactivar parcela' : 'Reactivar parcela'}
                        >
                          {p.activo ? <PowerOff className="w-3.5 h-3.5" /> : <Power className="w-3.5 h-3.5" />}
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

      <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-50 text-xs font-bold text-gray-600 mt-4">
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-40">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {paginasVisibles.map((p, i) => (
          <React.Fragment key={p}>
            {i > 0 && paginasVisibles[i - 1] !== p - 1 && <span className="px-1 text-gray-400">...</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${p === page ? 'bg-[#006837] text-white' : 'hover:bg-gray-100'}`}
            >
              {p}
            </button>
          </React.Fragment>
        ))}
        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-40">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
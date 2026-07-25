"use client";

import React, { useMemo, useState } from 'react';
import { Landmark, Gavel, Receipt } from 'lucide-react';
import { Ingreso, TipoIngreso } from '../types/types';

interface ListadoIngresosTableProps {
  ingresos: Ingreso[];
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

const filtros: { valor: TipoIngreso | 'todos'; label: string }[] = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'predial', label: 'Predial' },
  { valor: 'multa', label: 'Multas' },
];

export const ListadoIngresosTable: React.FC<ListadoIngresosTableProps> = ({ ingresos }) => {
  const [filtro, setFiltro] = useState<TipoIngreso | 'todos'>('todos');

  const ingresosFiltrados = useMemo(() => {
    return ingresos
      .filter((i) => filtro === 'todos' || i.tipo === filtro)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [ingresos, filtro]);

  const totalFiltrado = useMemo(() => ingresosFiltrados.reduce((acc, i) => acc + i.monto, 0), [ingresosFiltrados]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
          <Receipt className="w-4 h-4 text-gray-500" /> Listado de ingresos
        </h3>
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-lg p-1">
          {filtros.map((f) => (
            <button
              key={f.valor}
              onClick={() => setFiltro(f.valor)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
                filtro === f.valor ? 'bg-white text-[#1E4D3A] shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto overflow-x-auto scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full text-left text-sm border-collapse min-w-[560px]">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3 px-2.5 text-xs">Fecha</th>
              <th className="pb-3 px-2.5 text-xs">Tipo</th>
              <th className="pb-3 px-2.5 text-xs">Concepto</th>
              <th className="pb-3 px-2.5 text-xs">Comunero</th>
              <th className="pb-3 px-2.5 text-xs text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
            {ingresosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 text-xs font-medium">
                  No hay ingresos registrados para este filtro.
                </td>
              </tr>
            ) : (
              ingresosFiltrados.map((ing) => (
                <tr key={ing.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-2.5 text-gray-500 text-xs whitespace-nowrap">
                    {new Date(ing.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                    <span className="block text-[10px] text-gray-400">
                      {new Date(ing.fecha).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                  <td className="py-3 px-2.5 whitespace-nowrap">
                    {ing.tipo === 'predial' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#1E4D3A]/10 text-[#1E4D3A]">
                        <Landmark className="w-3 h-3" /> Predial
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700">
                        <Gavel className="w-3 h-3" /> Multa
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-2.5 text-xs">
                    <p className="font-bold text-gray-900">{ing.concepto}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{ing.folioReferencia}</p>
                  </td>
                  <td className="py-3 px-2.5 text-xs text-gray-600 font-semibold truncate max-w-[160px]">
                    {ing.comuneroNombre}
                  </td>
                  <td className="py-3 px-2.5 font-bold text-gray-900 text-right whitespace-nowrap">
                    {formatoMoneda(ing.monto)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-50">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
          {ingresosFiltrados.length} registro{ingresosFiltrados.length !== 1 ? 's' : ''}
        </span>
        <span className="text-sm font-black text-gray-900">{formatoMoneda(totalFiltrado)}</span>
      </div>
    </div>
  );
};
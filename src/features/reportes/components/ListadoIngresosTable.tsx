"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Landmark, Gavel, Receipt, ChevronLeft, ChevronRight } from 'lucide-react';
import { Ingreso, TipoIngreso } from '../types/types';

interface ListadoIngresosTableProps {
  ingresos: Ingreso[];
}

const ITEMS_POR_PAGINA = 10;

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

const filtros: { valor: TipoIngreso | 'todos'; label: string }[] = [
  { valor: 'todos', label: 'Todos' },
  { valor: 'predial', label: 'Predial' },
  { valor: 'multa', label: 'Multas' },
];

// Genera el rango de páginas a mostrar, colapsando con "..." cuando hay muchas.
// Ej: pagina=1, total=13 -> [1, 2, 3, '...', 13]
// Ej: pagina=7, total=13 -> [1, '...', 7, '...', 13]
const rango = (inicio: number, fin: number) =>
  Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);

const generarPaginas = (paginaActual: number, totalPaginas: number): (number | 'dots')[] => {
  const totalNumerosVisibles = 5; // 1, actual, total + posibles vecinos

  if (totalPaginas <= totalNumerosVisibles) {
    return rango(1, totalPaginas);
  }

  const mostrarElipsisIzquierda = paginaActual > 3;
  const mostrarElipsisDerecha = paginaActual < totalPaginas - 2;

  if (!mostrarElipsisIzquierda && mostrarElipsisDerecha) {
    return [...rango(1, 3), 'dots', totalPaginas];
  }

  if (mostrarElipsisIzquierda && !mostrarElipsisDerecha) {
    return [1, 'dots', ...rango(totalPaginas - 2, totalPaginas)];
  }

  return [1, 'dots', paginaActual, 'dots', totalPaginas];
};

export const ListadoIngresosTable: React.FC<ListadoIngresosTableProps> = ({ ingresos }) => {
  const [filtro, setFiltro] = useState<TipoIngreso | 'todos'>('todos');
  const [paginaActual, setPaginaActual] = useState(1);

  const ingresosFiltrados = useMemo(() => {
    return ingresos
      .filter((i) => filtro === 'todos' || i.tipo === filtro)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [ingresos, filtro]);

  const totalFiltrado = useMemo(() => ingresosFiltrados.reduce((acc, i) => acc + i.monto, 0), [ingresosFiltrados]);

  const totalPaginas = Math.max(1, Math.ceil(ingresosFiltrados.length / ITEMS_POR_PAGINA));

  // Si cambia el filtro (o encoge la lista) y la página actual queda fuera de rango, regresa a la 1.
  useEffect(() => {
    setPaginaActual(1);
  }, [filtro]);

  useEffect(() => {
    if (paginaActual > totalPaginas) setPaginaActual(totalPaginas);
  }, [totalPaginas, paginaActual]);

  const ingresosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return ingresosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [ingresosFiltrados, paginaActual]);

  const paginas = useMemo(() => generarPaginas(paginaActual, totalPaginas), [paginaActual, totalPaginas]);

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

      <div className="overflow-x-auto scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full text-left text-sm border-collapse min-w-[560px]">
          <thead>
            <tr className="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
              <th className="pb-3 px-2.5 text-xs">Fecha</th>
              <th className="pb-3 px-2.5 text-xs">Tipo</th>
              <th className="pb-3 px-2.5 text-xs">Concepto</th>
              <th className="pb-3 px-2.5 text-xs">Comunero</th>
              <th className="pb-3 px-2.5 text-xs text-right">Monto</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
            {ingresosPagina.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400 text-xs font-medium">
                  No hay ingresos registrados para este filtro.
                </td>
              </tr>
            ) : (
              ingresosPagina.map((ing) => (
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

      <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-50 flex-wrap gap-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
          {ingresosFiltrados.length} registro{ingresosFiltrados.length !== 1 ? 's' : ''}
        </span>
        <span className="text-sm font-black text-gray-900">{formatoMoneda(totalFiltrado)}</span>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-4 mt-1">
          <button
            onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
            className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {paginas.map((p, idx) =>
            p === 'dots' ? (
              <span key={`dots-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs font-bold text-gray-300">
                ···
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPaginaActual(p)}
                className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-colors ${
                  p === paginaActual ? 'bg-[#1E4D3A] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
            className="p-2 rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
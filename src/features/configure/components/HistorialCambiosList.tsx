"use client";

import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RegistroHistorial } from '../types/configuracion';

interface HistorialListProps {
  historial: RegistroHistorial[];
}

const ITEMS_PER_PAGE = 5;

export const HistorialCambiosList: React.FC<HistorialListProps> = ({ historial }) => {
  const totalPages = Math.max(1, Math.ceil(historial.length / ITEMS_PER_PAGE));
  const [paginaActual, setPaginaActual] = useState(1);
  const paginaSegura = Math.min(paginaActual, totalPages);

  const historialPaginado = useMemo(() => {
    const inicio = (paginaSegura - 1) * ITEMS_PER_PAGE;
    return historial.slice(inicio, inicio + ITEMS_PER_PAGE);
  }, [historial, paginaSegura]);

  const paginasVisibles = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const paginas: Array<number | 'ellipsis-start' | 'ellipsis-end'> = [1];
    const inicio = Math.max(2, paginaSegura - 2);
    const fin = Math.min(totalPages - 1, paginaSegura + 2);

    if (inicio > 2) {
      paginas.push('ellipsis-start');
    }

    for (let pagina = inicio; pagina <= fin; pagina += 1) {
      paginas.push(pagina);
    }

    if (fin < totalPages - 1) {
      paginas.push('ellipsis-end');
    }

    paginas.push(totalPages);

    return paginas;
  }, [paginaSegura, totalPages]);

  const irAPagina = (pagina: number) => {
    const paginaValida = Math.min(Math.max(pagina, 1), totalPages);
    setPaginaActual(paginaValida);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-xs p-6 flex flex-col justify-between min-h-[480px] w-full">
      <div>
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 text-base">Historial de cambios</h3>
          <p className="text-xs text-gray-400 font-medium mt-1">
            Registro de todas las modificaciones realizadas en la configuración del sistema.
          </p>
        </div>

        {historial.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 px-4 py-8 text-center text-sm text-gray-400">
            No hay cambios registrados aún.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {historialPaginado.map((item) => (
                <div key={item.id} className="border border-gray-100 bg-slate-50/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#006837] font-bold text-xs flex items-center justify-center shrink-0">
                      {item.usuarioIniciales}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-gray-900 truncate">{item.usuarioNombre}</p>
                      <p className="text-[11px] text-gray-400 truncate">{item.usuarioEmail}</p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1.5 pt-2 border-t border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Configuración:</span>
                      <span className="font-semibold text-gray-800">{item.configuracionNombre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Anterior:</span>
                      <span className="text-gray-500 line-through">{item.valorAnterior}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nuevo:</span>
                      <span className="font-bold text-emerald-600">{item.valorNuevo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fecha:</span>
                      <span className="text-gray-500">{item.fecha}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100/80">
                    <th className="py-4 px-3">USUARIO</th>
                    <th className="py-4 px-3">CONFIGURACIÓN</th>
                    <th className="py-4 px-3">VALOR ANTERIOR</th>
                    <th className="py-4 px-3">VALOR NUEVO</th>
                    <th className="py-4 px-3">FECHA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {historialPaginado.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#e6f0eb] text-[#006837] font-bold text-xs flex items-center justify-center shrink-0">
                            {item.usuarioIniciales}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-gray-800">{item.usuarioNombre}</p>
                            <p className="text-[11px] text-gray-400 font-normal">{item.usuarioEmail}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-3 font-semibold text-gray-700 whitespace-nowrap">
                        {item.configuracionNombre}
                      </td>

                      <td className="py-4 px-3 font-semibold text-gray-400 whitespace-nowrap">
                        {item.valorAnterior}
                      </td>

                      <td className="py-4 px-3 font-bold text-[#006837] whitespace-nowrap">
                        {item.valorNuevo}
                      </td>

                      <td className="py-4 px-3 font-semibold text-gray-400 whitespace-nowrap">
                        {item.fecha}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {historial.length > 0 && (
        <div className="flex flex-col items-center justify-center gap-3 pt-6 border-t border-gray-50 mt-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
            Página {paginaSegura} de {totalPages}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600">
            <button
              type="button"
              onClick={() => irAPagina(paginaSegura - 1)}
              disabled={paginaSegura === 1}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {paginasVisibles.map((pagina, index) => {
              if (pagina === 'ellipsis-start' || pagina === 'ellipsis-end') {
                return (
                  <span key={`${pagina}-${index}`} className="px-1 text-gray-400">
                    …
                  </span>
                );
              }

              return (
                <button
                  key={pagina}
                  type="button"
                  onClick={() => irAPagina(pagina)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold cursor-pointer ${
                    pagina === paginaSegura
                      ? 'bg-[#006837] text-white'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  {pagina}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => irAPagina(paginaSegura + 1)}
              disabled={paginaSegura === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
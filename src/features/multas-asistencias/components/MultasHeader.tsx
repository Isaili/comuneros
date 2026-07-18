"use client";

import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Plus, CircleDollarSign, Calendar} from 'lucide-react';
import { TipoMulta, EstadoMulta } from '../types/types';

interface HeaderProps {
  onBusquedaChange: (texto: string) => void;
  filtroTipo: TipoMulta | 'todos';
  onFiltroTipoChange: (tipo: TipoMulta | 'todos') => void;
  filtroEstado: EstadoMulta | 'todos';
  onFiltroEstadoChange: (estado: EstadoMulta | 'todos') => void;
  onAgregarClick: () => void;
}

export const MultasHeader: React.FC<HeaderProps> = ({
  onBusquedaChange,
  filtroTipo,
  onFiltroTipoChange,
  filtroEstado,
  onFiltroEstadoChange,
  onAgregarClick,
}) => {
  const [fechaActual, setFechaActual] = useState<string>('');

  useEffect(() => {
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    setFechaActual(fecha.charAt(0).toUpperCase() + fecha.slice(1));
  }, []);

  return (
    <div className="space-y-6 w-full">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] flex items-center gap-2">
          <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
            <CircleDollarSign className="w-5 h-5" />
          </span>
            Multas y Asistencias
          </h1>
          <p className="text-sm sm:text-sm text-gray-500 mt-1">
            Consulta, liquida y registra multas de comuneros y avecindados.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-xs font-semibold text-gray-700 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>FECHA ACTUAL:</span>
          <span className="text-gray-900 font-bold">
            {fechaActual || "Cargando..."}
          </span>
        </div>
      </div>


      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center flex-1">
          <div className="relative flex-1 min-w-full md:min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre de comunero..."
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#1E4D3A] transition-colors shadow-sm text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-3 md:flex md:flex-wrap gap-2">
            <select
              value={filtroTipo}
              onChange={(e) => onFiltroTipoChange(e.target.value as TipoMulta | 'todos')}
              className="w-full md:w-auto bg-white border border-gray-200 rounded-xl px-2.5 py-2.5 text-xs sm:text-sm font-bold text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50 truncate"
            >
              <option value="todos">Tipo: Todas</option>
              <option value="inasistencia">Inasistencia</option>
              <option value="otro">Otro</option>
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => onFiltroEstadoChange(e.target.value as EstadoMulta | 'todos')}
              className="w-full md:w-auto bg-white border border-gray-200 rounded-xl px-2.5 py-2.5 text-xs sm:text-sm font-bold text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50 truncate"
            >
              <option value="todos">Estado: Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
            </select>

            <button className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors xs:col-span-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" /> Filtros
            </button>
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0">
          <button
            onClick={onAgregarClick}
            className="flex items-center justify-center gap-1.5 bg-[#1E4D3A] hover:bg-[#153629] text-white rounded-xl px-3 sm:px-4 py-2.5 text-sm font-bold shadow-sm transition-colors flex-1 lg:flex-none whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" /> Registrar multa
          </button>
        </div>
      </div>
    </div>
  );
};
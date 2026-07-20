"use client";

import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Plus, CircleDollarSign, Calendar } from 'lucide-react';
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
    // Genera la fecha en tiempo real en el cliente
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
      {/* Fila del Título y Fecha */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
              <CircleDollarSign className="w-5 h-5" />
            </span>
            Multas y Asistencias
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
            Consulta, liquida y registra multas de comuneros y avecindados.
          </p>
        </div>

        {/* Fecha Actual con estilo idéntico a Comuneros */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-xs font-semibold text-gray-700 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>FECHA ACTUAL:</span>
          <span className="text-gray-900 font-bold">
            {fechaActual || "Cargando..."}
          </span>
        </div>
      </div>

      {/* Fila de Herramientas de Filtrado y Acciones */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-transparent">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-4xl">
          {/* Barra de Búsqueda */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nombre de comunero..."
              onChange={(e) => onBusquedaChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] transition-all"
            />
          </div>

          {/* Selectores unificados al estilo Comuneros */}
          <select
            value={filtroTipo}
            onChange={(e) => onFiltroTipoChange(e.target.value as TipoMulta | 'todos')}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none cursor-pointer"
          >
            <option value="todos">Tipo: Todas</option>
            <option value="inasistencia">Inasistencia</option>
            <option value="otro">Otro</option>
          </select>

          <select
            value={filtroEstado}
            onChange={(e) => onFiltroEstadoChange(e.target.value as EstadoMulta | 'todos')}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none cursor-pointer"
          >
            <option value="todos">Estado: Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="pagada">Pagada</option>
          </select>

          {/* Botón Filtros Avanzados */}
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Bloque de Botón de Acción Principal */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onAgregarClick}
            className="bg-[#006837] hover:bg-[#00522b] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 transform hover:-translate-y-0.5 whitespace-nowrap w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Registrar multa
          </button>
        </div>
      </div>
    </div>
  );
};
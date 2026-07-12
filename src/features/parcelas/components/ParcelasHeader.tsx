"use client";

import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Download, Plus } from 'lucide-react';

interface HeaderProps {
  onSearchChange: (text: string) => void;
  onAddClick: () => void;
}

export const ParcelasHeader: React.FC<HeaderProps> = ({ onSearchChange, onAddClick }) => {
  const [fechaActual, setFechaActual] = useState<string>('');

  useEffect(() => {
    // Genera la fecha local en el navegador del usuario
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    // Capitaliza la primera letra (ej: "domingo" -> "Domingo")
    setFechaActual(fecha.charAt(0).toUpperCase() + fecha.slice(1));
  }, []);

  return (
    <div className="space-y-4 w-full">
      {/* Fila del Título y Fecha */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
              {/* Icono simulado de parcelas */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </span>
            Analista de Parcelas
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Consulta y administra la información de todas las parcelas ejidales.
          </p>
        </div>
        
        {/* Fecha Actual */}
        <div className="self-start md:self-auto bg-white border border-gray-100 rounded-xl px-3 sm:px-4 py-2 shadow-sm flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-gray-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <span>
            FECHA ACTUAL: <span className="font-bold text-gray-900">{fechaActual || "Cargando..."}</span>
          </span>
        </div>
      </div>

      {/* Fila de Filtros y Buscador Responsivo */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        
        {/* Bloque Izquierdo: Input + Selects */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-stretch sm:items-center flex-1">
          
          {/* Input de Búsqueda */}
          <div className="relative flex-1 min-w-full sm:min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por número de parcela..." 
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition-colors shadow-sm text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Grupo de selectores adaptables (2 columnas en móvil muy pequeño) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <select className="bg-white border border-gray-200 rounded-xl px-2.5 py-2.5 text-[11px] sm:text-xs font-bold text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50 truncate">
              <option>Estado de pago: Todos</option>
              <option>Pagado</option>
              <option>Pagar</option>
            </select>

            <select className="bg-white border border-gray-200 rounded-xl px-2.5 py-2.5 text-[11px] sm:text-xs font-bold text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50 truncate">
              <option>Estado: Todos</option>
              <option>Activos</option>
            </select>
          </div>

          {/* Botón Filtros Avanzados */}
          <button className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" /> Filtros
          </button>
        </div>

        {/* Bloque Derecho: Botones de Acción */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <button className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs font-bold text-emerald-700 shadow-sm hover:bg-emerald-50 transition-colors flex-1 lg:flex-none">
            <Download className="w-3.5 h-3.5 shrink-0" /> <span className="inline">Exportar</span>
          </button>
          <button 
            onClick={onAddClick}
            className="flex items-center justify-center gap-1.5 bg-[#006837] hover:bg-[#00532c] text-white rounded-xl px-3 sm:px-4 py-2.5 text-xs font-bold shadow-sm transition-colors flex-1 lg:flex-none whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" /> Agregar parcela
          </button>
        </div>

      </div>
    </div>
  );
};
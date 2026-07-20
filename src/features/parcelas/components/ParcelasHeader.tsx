"use client";

import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Download, Plus, Calendar } from 'lucide-react';

interface HeaderProps {
  onSearchChange: (text: string) => void;
  onAddClick: () => void;
}

export const ParcelasHeader: React.FC<HeaderProps> = ({ onSearchChange, onAddClick }) => {
  const [fechaActual, setFechaActual] = useState<string>('');

  useEffect(() => {
    // Genera la fecha en tiempo real en el cliente
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
    <div className="space-y-6">
      {/* Fila del Título y Fecha */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
              {/* Icono simulado de parcelas */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </span>
            Analista de Parcelas
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
            Consulta y administra la información de todas las parcelas ejidales.
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
              placeholder="Buscar por número de parcela..." 
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] transition-all"
            />
          </div>

          {/* Selectores unificados al estilo Comuneros */}
          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none cursor-pointer">
            <option>Estado de pago: Todos</option>
            <option>Pagado</option>
            <option>Pagar</option>
          </select>

          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none cursor-pointer">
            <option>Estado: Todos</option>
            <option>Activos</option>
          </select>

          {/* Botón Filtros Avanzados */}
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Bloque de Botones de Acción */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#006837] shadow-sm hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          
          <button 
            onClick={onAddClick}
            className="bg-[#006837] hover:bg-[#00522b] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Agregar parcela
          </button>
        </div>
      </div>
    </div>
  );
};
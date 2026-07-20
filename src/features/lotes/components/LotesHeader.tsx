"use client";

import React, { useEffect, useState } from 'react';
import { Search, Plus, Calendar } from 'lucide-react';

interface HeaderProps {
  onSearchChange: (text: string) => void;
  onAddClick: () => void;
}

export const LotesHeader: React.FC<HeaderProps> = ({ 
  onSearchChange, 
  onAddClick 
}) => {
  const [fechaActual, setFechaActual] = useState<string>('');

  useEffect(() => {
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    setFechaActual(fecha.charAt(0).toUpperCase() + fecha.slice(1));
  }, []);

  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#111827] flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </span>
            Analista de Lotes
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Consulta y administra la información de todos los lotes ejidales.
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

      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:max-w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por número de lote, folio o propietario..." 
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] transition-all placeholder-gray-500 text-gray-900"
          />
        </div>

        <button 
          onClick={onAddClick}
          className="bg-[#006837] hover:bg-[#00522b] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 stroke-[3] shrink-0" /> 
          Agregar lote
        </button>
      </div>
    </div>
  );
};
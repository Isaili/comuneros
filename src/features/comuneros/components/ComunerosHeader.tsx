"use client";

import React, { useEffect, useState } from 'react';
import { Search, Plus, Calendar, Users } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
  onSearchChange: (text: string) => void;
}

export const ComunerosHeader: React.FC<HeaderProps> = ({ onAddClick, onSearchChange }) => {
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
              <Users className="w-5 h-5" />
            </span>
            Comuneros
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
            Gestiona la información de todos los comuneros ejidales.
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-transparent">
  <div className="relative w-full sm:w-[320px]">
    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
    <input 
      type="text" 
      placeholder="Buscar por nombre o apellido..." 
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] transition-all placeholder-gray-500 text-gray-900"
    />
  </div>


        <button 
          onClick={onAddClick}
          className="bg-[#006837] hover:bg-[#00522b] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Agregar nuevo comunero
        </button>
      </div>
    </div>
  );
};
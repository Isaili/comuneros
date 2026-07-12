"use client";

import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Download, Plus } from 'lucide-react';

interface HeaderProps {
  onSearchChange: (text: string) => void;
  onAddClick: () => void;
  activeTab: 'parcelas' | 'lotes';
  setActiveTab: (tab: 'parcelas' | 'lotes') => void;
}

export const LotesHeader: React.FC<HeaderProps> = ({ 
  onSearchChange, 
  onAddClick, 
  activeTab, 
  setActiveTab 
}) => {
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
      {/* Título y Fecha */}
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
        
        {/* Fecha Actual */}
        <div className="self-start sm:self-auto bg-white border border-gray-100 rounded-xl px-3 sm:px-4 py-2 shadow-sm flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-gray-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          <p>
            FECHA ACTUAL: <span className="font-bold text-gray-900">{fechaActual || "Cargando..."}</span>
          </p>
        </div>
      </div>

      {/* Fila de Controles */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center flex-1">
          
          {/* Input de Búsqueda Adaptado */}
          <div className="relative flex-1 min-w-full md:min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por número de lote, folio o propietario..." 
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition-colors shadow-sm text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Selectores y Filtro Dinámico */}
          <div className="grid grid-cols-1 xs:grid-cols-3 md:flex md:flex-wrap gap-2">
            <select className="w-full md:w-auto bg-white border border-gray-200 rounded-xl px-2.5 py-2.5 text-[11px] sm:text-xs font-bold text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50 truncate">
              <option>Estado de pago: Todos</option>
              <option>Pagado</option>
              <option>Pagar</option>
            </select>

            <select className="w-full md:w-auto bg-white border border-gray-200 rounded-xl px-2.5 py-2.5 text-[11px] sm:text-xs font-bold text-gray-700 outline-none shadow-sm cursor-pointer hover:bg-gray-50 truncate">
              <option>Estado: Todos</option>
              <option>Activo</option>
            </select>

            <button className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors xs:col-span-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" /> Filtros
            </button>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-row items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0">
          <button className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs font-bold text-emerald-700 shadow-sm hover:bg-emerald-50 transition-colors flex-1 lg:flex-none">
            <Download className="w-3.5 h-3.5 shrink-0" /> <span className="hidden xs:inline">Exportar</span>
          </button>
          <button 
            onClick={onAddClick}
            className="flex items-center justify-center gap-1.5 bg-[#006837] hover:bg-[#00532c] text-white rounded-xl px-3 sm:px-4 py-2.5 text-xs font-bold shadow-sm transition-colors flex-2 lg:flex-none whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" /> Agregar lote
          </button>
        </div>
      </div>

      {/* Tabs de Sub-Navegación (Parcelas / Lotes) */}
      <div className="flex items-center gap-1 border-b border-gray-100 pt-2 overflow-x-auto scrollbar-none">
        <button 
          onClick={() => setActiveTab('parcelas')}
          className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'parcelas' ? 'border-[#006837] text-[#006837]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Parcelas
        </button>
        <button 
          onClick={() => setActiveTab('lotes')}
          className={`px-4 py-2 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
            activeTab === 'lotes' ? 'border-[#006837] text-[#006837]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Lotes
        </button>
      </div>
    </div>
  );
};
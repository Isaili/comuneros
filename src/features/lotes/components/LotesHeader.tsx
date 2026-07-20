"use client";

import React, { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, Download, Plus, Calendar } from 'lucide-react';

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
      {/* Título y Fecha */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </span>
            Analista de Lotes
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
            Consulta y administra la información de todos los lotes ejidales.
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

      {/* Fila de Controles (Buscador, Selectores y Acciones) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-transparent">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-4xl">
          
          {/* Input de Búsqueda */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por número de lote, folio o propietario..." 
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
            <option>Activo</option>
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
            Agregar lote
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
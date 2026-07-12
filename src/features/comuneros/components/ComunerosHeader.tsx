import React, { useEffect, useState } from 'react';
import { Search, Plus, SlidersHorizontal, Calendar } from 'lucide-react';

interface HeaderProps {
  onAddClick: () => void;
  onSearchChange: (text: string) => void;
}

export const ComunerosHeader: React.FC<HeaderProps> = ({ onAddClick, onSearchChange }) => {
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
      {/* Fila de Bienvenida y Fecha */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Comuneros
          </h1>
          <p className="text-sm text-gray-500">Gestiona la información de todos los comuneros ejidales.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-xs font-semibold text-gray-700 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>FECHA ACTUAL:</span>
          <span className="text-gray-900 font-bold">
            {fechaActual || "Cargando..."}
          </span>
        </div>
      </div>

      {/* Fila de Herramientas de Filtrado */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-transparent">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-3xl">
          {/* Barra de Búsqueda */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Buscar por nombre o apellido..." 
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#006837] focus:ring-1 focus:ring-[#006837] transition-all"
            />
          </div>

          {/* Selectores */}
          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none cursor-pointer">
            <option>Estado civil: Todos</option>
            <option>Casado</option>
            <option>Soltero</option>
          </select>

          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none cursor-pointer">
            <option>Estado: Todos</option>
            <option>Activo</option>
            <option>Inactivo</option>
          </select>

          {/* Botón Filtros Avanzados */}
          <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Botón Agregar Comunero */}
        <button 
          onClick={onAddClick}
          className="bg-[#006837] hover:bg-[#00522b] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Agregar nuevo comunero
        </button>
      </div>
    </div>
  );
};
"use client";

import React, { useEffect, useState } from 'react';
import { Settings, Calendar } from 'lucide-react';

export const ConfiguracionHeader: React.FC = () => {
  const [fechaActual, setFechaActual] = useState<string>('');

  useEffect(() => {
    const fecha = new Date().toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    setFechaActual(fecha.charAt(0).toUpperCase() + fecha.slice(1));
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mb-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-700 stroke-[2.2]" />
          Configuración
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
          Administra los valores y parámetros del sistema.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-xs text-xs font-semibold text-gray-700 self-start sm:self-auto">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span className="text-gray-400 uppercase tracking-wider text-[11px] font-bold">FECHA ACTUAL:</span>
        <span className="text-gray-900 font-bold">{fechaActual || "Cargando..."}</span>
      </div>
    </div>
  );
};
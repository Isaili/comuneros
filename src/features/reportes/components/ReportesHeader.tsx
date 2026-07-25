"use client";

import React, { useEffect, useState } from 'react';
import { BarChart3, Calendar } from 'lucide-react';

export const ReportesHeader: React.FC = () => {
  const [fechaActual, setFechaActual] = useState('');

  useEffect(() => {
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const fecha = new Date().toLocaleDateString('es-MX', opciones);
    setFechaActual(fecha.charAt(0).toUpperCase() + fecha.slice(1));
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
          <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </span>
          Reportes
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Ingresos diarios, historial de pagos y asistencia a asambleas.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-xs font-semibold text-gray-700 self-start sm:self-auto">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span>FECHA ACTUAL:</span>
        <span className="text-gray-900 font-bold">{fechaActual || 'Cargando...'}</span>
      </div>
    </div>
  );
};
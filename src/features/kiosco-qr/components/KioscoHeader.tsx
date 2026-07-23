"use client";

import React, { useEffect, useState } from 'react';
import { QrCode, Calendar } from 'lucide-react';

export const KioscoHeader: React.FC = () => {
  const [ahora, setAhora] = useState<Date | null>(null);

  useEffect(() => {
    setAhora(new Date());
    const interval = setInterval(() => setAhora(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const fecha = ahora
    ? ahora
        .toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        .replace(/^\w/, (c) => c.toUpperCase())
    : '';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
          <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
            <QrCode className="w-5 h-5" />
          </span>
          Kiosco de Asistencia
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
          Escanea el código QR en pantalla con tu teléfono para registrar tu asistencia.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-xs font-semibold text-gray-700 self-start sm:self-auto">
        <Calendar className="w-4 h-4 text-gray-400" />
        <span>FECHA ACTUAL:</span>
        <span className="text-gray-900 font-bold">
          {fecha || "Cargando..."}
        </span>
      </div>
    </div>
  );
};
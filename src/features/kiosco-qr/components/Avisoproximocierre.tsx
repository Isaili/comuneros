"use client";

import React, { useEffect } from 'react';
import { AlarmClock, X } from 'lucide-react';

interface AvisoProximoCierreProps {
  nombreReunion: string;
  onCerrar: () => void;
}

export const AvisoProximoCierre: React.FC<AvisoProximoCierreProps> = ({ nombreReunion, onCerrar }) => {
  useEffect(() => {
    const timeout = setTimeout(onCerrar, 8000);
    return () => clearTimeout(timeout);
  }, [onCerrar]);

  return (
    <div className="fixed top-5 right-5 z-[60] w-full max-w-sm bg-white border border-amber-100 rounded-2xl shadow-2xl p-4 flex items-start gap-3 animate-fade-in">
      <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg shrink-0">
        <AlarmClock className="w-4 h-4" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-gray-900">Faltan 15 minutos</p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          "{nombreReunion}" está por concluir. Recuerda cerrarla manualmente cuando termine.
        </p>
      </div>
      <button onClick={onCerrar} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
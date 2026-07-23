"use client";

import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface NotificacionCierreProps {
  nombreReunion: string;
  onCerrar: () => void;
}

export const NotificacionCierre: React.FC<NotificacionCierreProps> = ({ nombreReunion, onCerrar }) => {
  useEffect(() => {
    const timeout = setTimeout(onCerrar, 5000);
    return () => clearTimeout(timeout);
  }, [onCerrar]);

  return (
    <div className="fixed top-5 right-5 z-[60] w-full max-w-sm bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 flex items-start gap-3 animate-fade-in">
      <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
        <CheckCircle2 className="w-4 h-4" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-gray-900">Reunión cerrada</p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          "{nombreReunion}" fue cerrada manualmente. El escáner ha sido desactivado.
        </p>
      </div>
      <button onClick={onCerrar} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
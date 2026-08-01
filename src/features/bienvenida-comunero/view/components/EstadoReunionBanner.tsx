"use client";

import React from 'react';
import { Users, Calendar, MapPin } from 'lucide-react';
import { Reunion } from '../../../kiosco-qr/types/types';

interface EstadoReunionBannerProps {
  reunion: Reunion | null;
  totalAsistentes: number;
}

const formatoFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-MX', { weekday: 'long', day: '2-digit', month: 'long' });

export const EstadoReunionBanner: React.FC<EstadoReunionBannerProps> = ({ reunion, totalAsistentes }) => {
  if (!reunion) {
    return (
      <div className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-md bg-gray-100 text-gray-500">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Sin reunión activa
        </span>
        <p className="text-sm text-gray-400 font-semibold">Esperando a que se abra una asamblea en el kiosco.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 py-4">
      <div className="flex items-center gap-3 min-w-0">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> En curso
        </span>
        <h2 className="text-lg font-black text-gray-900 truncate">{reunion.nombre}</h2>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatoFecha(reunion.fecha)}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {reunion.lugar}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-black text-[#1E4D3A] bg-[#1E4D3A]/5 border border-[#1E4D3A]/10 rounded-lg px-3 py-1.5">
          <Users className="w-4 h-4" /> {totalAsistentes}
        </span>
      </div>
    </div>
  );
};
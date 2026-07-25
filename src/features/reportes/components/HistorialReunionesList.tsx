"use client";

import React from 'react';
import { Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import { ReunionHistorial } from '../types/types';

interface HistorialReunionesListProps {
  reuniones: ReunionHistorial[];
  onSeleccionar: (reunion: ReunionHistorial) => void;
}

const formatoFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });

export const HistorialReunionesList: React.FC<HistorialReunionesListProps> = ({ reuniones, onSeleccionar }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
      <h3 className="font-bold text-gray-900 text-sm mb-4">Historial de reuniones</h3>

      {reuniones.length === 0 ? (
        <p className="text-xs text-gray-400 font-medium py-6 text-center">Aún no hay reuniones registradas.</p>
      ) : (
        <div className="space-y-2.5 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
          {reuniones
            .slice()
            .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
            .map((r) => (
              <button
                key={r.id}
                onClick={() => onSeleccionar(r)}
                className="w-full text-left border border-gray-100 hover:border-[#1E4D3A]/30 hover:bg-[#1E4D3A]/5 rounded-xl p-3.5 transition-all flex items-center gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-xs truncate">{r.nombre}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] font-semibold text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" /> {formatoFecha(r.fecha)}
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-gray-400 shrink-0" /> {r.lugar}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2 py-1">
                  <Users className="w-3 h-3 text-gray-400" /> {r.asistentes.length}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
"use client";

import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Reunion } from '../types/types';

interface ProximasReunionesListProps {
  reuniones: Reunion[];
}

const formatoFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });

export const ProximasReunionesList: React.FC<ProximasReunionesListProps> = ({ reuniones }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
      <h3 className="font-bold text-gray-900 text-sm mb-4">Próximas asambleas</h3>

      {reuniones.length === 0 ? (
        <p className="text-xs text-gray-400 font-medium py-4 text-center">No hay más asambleas en la agenda.</p>
      ) : (
        <div className="space-y-2.5">
          {reuniones.map((r) => (
            <div key={r.id} className="border border-gray-100 rounded-xl p-3 bg-gray-50/40">
              <p className="font-bold text-gray-900 text-xs truncate">{r.nombre}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gray-400" /> {formatoFecha(r.fecha)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" /> {r.horaInicio}
                </span>
                <span className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-gray-400 shrink-0" /> {r.lugar}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
"use client";

import React from 'react';
import { LogIn, LogOut, Clock } from 'lucide-react';
import { EventoAsistencia } from '../../model/types';

interface HistorialRecienteTiraProps {
  historial: EventoAsistencia[];
}

const formatoHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

export const HistorialRecienteTira: React.FC<HistorialRecienteTiraProps> = ({ historial }) => {
  if (historial.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5">
      <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-1.5">
        <Clock className="w-4 h-4 text-gray-500" /> Actividad reciente
      </h3>
      <div className="flex gap-3 overflow-x-auto scrollbar-thin pb-1">
        {historial
          .filter((e) => e.asistente)
          .map((e, idx) => (
            <div
              key={`${e.asistente!.id}-${e.timestamp}-${idx}`}
              className="flex items-center gap-2 border border-gray-100 rounded-xl p-2 pr-3 shrink-0 bg-gray-50/40"
            >
              <img
                src={e.asistente!.fotografia}
                alt={e.asistente!.nombre}
                className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate max-w-[120px]">{e.asistente!.nombre}</p>
                <span
                  className={`flex items-center gap-1 text-[10px] font-semibold ${
                    e.tipo === 'salida' ? 'text-gray-400' : 'text-emerald-600'
                  }`}
                >
                  {e.tipo === 'salida' ? <LogOut className="w-3 h-3" /> : <LogIn className="w-3 h-3" />}
                  {formatoHora(e.timestamp)}
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
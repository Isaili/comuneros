"use client";

import React from 'react';
import { Calendar, MapPin, Clock, Plus, CheckCircle2 } from 'lucide-react';
import { Reunion } from '../types/types';

interface ProximasReunionesListProps {
  reuniones: Reunion[];
  reunionDestacadaId?: string | null;
  reunionMasCercanaId?: string | null;
  onSeleccionar: (reunionId: string) => void;
  onNuevaReunion: () => void;
}

const formatoFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });

export const ProximasReunionesList: React.FC<ProximasReunionesListProps> = ({
  reuniones,
  reunionDestacadaId,
  reunionMasCercanaId,
  onSeleccionar,
  onNuevaReunion,
}) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm">Próximas asambleas</h3>
        <button
          onClick={onNuevaReunion}
          className="flex items-center gap-1 text-xs font-bold text-[#1E4D3A] bg-[#1E4D3A]/5 hover:bg-[#1E4D3A]/10 border border-[#1E4D3A]/10 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nueva asamblea
        </button>
      </div>

      {reuniones.length === 0 ? (
        <p className="text-xs text-gray-400 font-medium py-4 text-center">No hay más asambleas en la agenda.</p>
      ) : (
        <div className="space-y-2.5">
          {reuniones.map((r) => {
            const enKiosco = r.id === reunionDestacadaId;
            const esMasCercana = r.id === reunionMasCercanaId;

            return (
              <button
                key={r.id}
                onClick={() => onSeleccionar(r.id)}
                className={`w-full text-left border-2 rounded-xl p-3 transition-all duration-200 ${
                  enKiosco
                    ? 'border-[#1E4D3A] bg-[#1E4D3A]/[0.06] shadow-sm'
                    : 'border-gray-100 bg-gray-50/40 hover:border-[#1E4D3A]/25 hover:bg-[#1E4D3A]/5'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-gray-900 text-xs truncate">{r.nombre}</p>
                  {enKiosco ? (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold text-[#1E4D3A] shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 fill-[#1E4D3A] text-white" /> En kiosco
                    </span>
                  ) : esMasCercana ? (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold text-amber-600 shrink-0">
                      <Clock className="w-3 h-3" /> Más próxima
                    </span>
                  ) : null}
                </div>
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
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
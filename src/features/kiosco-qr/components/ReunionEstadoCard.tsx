"use client";

import React from 'react';
import { Calendar, MapPin, Clock, Users, DoorOpen, DoorClosed, LogOut } from 'lucide-react';
import { Reunion } from '../types/types';

interface ReunionEstadoCardProps {
  reunionProxima: Reunion | null;
  reunionActiva: Reunion | null;
  esLaMasCercana: boolean;
  totalAsistentes: number;
  salidasHabilitadas: boolean;
  onAbrirClick: () => void;
  onCerrarClick: () => void;
  onHabilitarSalidasClick: () => void;
}

const formatoFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-MX', { weekday: 'long', day: '2-digit', month: 'long' });

export const ReunionEstadoCard: React.FC<ReunionEstadoCardProps> = ({
  reunionProxima,
  reunionActiva,
  esLaMasCercana,
  totalAsistentes,
  salidasHabilitadas,
  onAbrirClick,
  onCerrarClick,
  onHabilitarSalidasClick,
}) => {
  const reunion = reunionActiva ?? reunionProxima;

  if (!reunion) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 text-center text-gray-400 font-medium">
        No hay asambleas programadas por el momento.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-md ${
                reunionActiva
                  ? 'bg-emerald-50 text-emerald-700'
                  : esLaMasCercana
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-[#E2DFDE] text-[#474746]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  reunionActiva ? 'bg-emerald-500 animate-pulse' : esLaMasCercana ? 'bg-amber-500' : 'bg-[#474746]'
                }`}
              />
              {reunionActiva ? 'Reunión en curso' : esLaMasCercana ? 'Próxima reunión' : 'Reunión seleccionada'}
            </span>

            {reunionActiva && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-md ${
                  salidasHabilitadas ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}
              >
                <LogOut className="w-3 h-3" />
                {salidasHabilitadas ? 'Salidas habilitadas' : 'Solo entradas'}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">{reunion.nombre}</h2>
        </div>

        {reunionActiva && (
          <div className="text-right bg-[#1E4D3A]/5 border border-[#1E4D3A]/10 rounded-xl px-4 py-2.5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1 justify-end">
              <Users className="w-3 h-3" /> Asistentes
            </p>
            <p className="text-2xl font-black text-[#1E4D3A] font-mono">{totalAsistentes}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 bg-gray-50/60 border border-gray-100 rounded-lg px-3 py-1.5">
          <Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatoFecha(reunion.fecha)}
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 bg-gray-50/60 border border-gray-100 rounded-lg px-3 py-1.5">
          <Clock className="w-3.5 h-3.5 text-gray-400" /> {reunion.horaInicio} hrs
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 bg-gray-50/60 border border-gray-100 rounded-lg px-3 py-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {reunion.lugar}
        </div>
      </div>

      {reunionActiva ? (
        <div className="flex flex-col sm:flex-row gap-2.5">
          {!salidasHabilitadas && (
            <button
              onClick={onHabilitarSalidasClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2.5 text-sm font-bold shadow-sm transition-colors"
            >
              <LogOut className="w-4 h-4" /> Habilitar salidas
            </button>
          )}
          <button
            onClick={onCerrarClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-xl px-6 py-2.5 text-sm font-bold shadow-sm transition-colors"
          >
            <DoorClosed className="w-4 h-4" /> Cerrar reunión
          </button>
        </div>
      ) : (
        <button
          onClick={onAbrirClick}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1E4D3A] hover:bg-[#153629] text-white rounded-xl px-6 py-3 text-sm font-bold shadow-sm transition-colors"
        >
          <DoorOpen className="w-4 h-4" /> Abrir reunión
        </button>
      )}
    </div>
  );
};
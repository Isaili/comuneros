"use client";

import React from 'react';
import { ScanFace, LogIn, LogOut, CheckCircle2 } from 'lucide-react';
import { EventoAsistencia } from '../../model/types';

interface BienvenidaSpotlightProps {
  evento: EventoAsistencia | null;
  reunionActiva: boolean;
}

const formatoHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

export const BienvenidaSpotlight: React.FC<BienvenidaSpotlightProps> = ({ evento, reunionActiva }) => {
  const asistente = evento?.asistente;
  const esSalida = evento?.tipo === 'salida';

  if (!asistente) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center gap-4 py-24 px-8">
        <ScanFace className="w-16 h-16 text-gray-200" />
        <p className="text-lg font-bold text-gray-300 max-w-sm">
          {reunionActiva
            ? 'Esperando el siguiente registro de asistencia...'
            : 'La bienvenida aparecerá aquí en cuanto se abra una asamblea.'}
        </p>
      </div>
    );
  }

  return (
    <div
      key={`${asistente.id}-${evento?.timestamp}`}
      className="bg-white border border-gray-100 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center gap-5 py-16 px-8 animate-fade-in"
    >
      <span
        className={`inline-flex items-center gap-1.5 text-sm font-extrabold px-3 py-1.5 rounded-full ${
          esSalida ? 'bg-gray-100 text-gray-600' : 'bg-emerald-50 text-emerald-700'
        }`}
      >
        {esSalida ? <LogOut className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
        {esSalida ? 'Hasta luego' : '¡Bienvenido/a!'}
      </span>

      <img
        src={asistente.fotografia}
        alt={asistente.nombre}
        className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover border-4 border-white shadow-lg ring-1 ring-gray-100"
      />

      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{asistente.nombre}</h1>
        <p className="text-sm text-gray-400 font-mono mt-1">{asistente.folio}</p>
      </div>

      <div
        className={`flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl ${
          esSalida ? 'bg-gray-50 text-gray-600 border border-gray-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
        }`}
      >
        {esSalida ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
        {esSalida ? 'Salida registrada a las' : 'Entrada registrada a las'} {formatoHora(evento!.timestamp)}
      </div>
    </div>
  );
};
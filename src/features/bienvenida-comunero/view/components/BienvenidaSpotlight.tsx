"use client";

import React from 'react';
import { ScanFace, LogIn, LogOut, CheckCircle2, ShieldCheck, Clock3 } from 'lucide-react';
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
      <div className="relative overflow-hidden rounded-[28px] border border-gray-100 bg-gradient-to-br from-white via-emerald-50/40 to-white shadow-[0_24px_70px_-35px_rgba(30,77,58,0.35)] flex flex-col items-center justify-center text-center gap-4 py-24 px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_45%)]" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100">
          <ScanFace className="w-10 h-10 text-emerald-500" />
        </div>
        <p className="relative text-base sm:text-lg font-black text-gray-400 max-w-md tracking-tight">
          {reunionActiva
            ? 'Esperando el siguiente registro de asistencia...'
            : 'La bienvenida aparecerá aquí en cuanto se abra una asamblea.'}
        </p>
      </div>
    );
  }

  const accent = esSalida
    ? 'from-slate-900 via-slate-800 to-slate-700'
    : 'from-[#0f5132] via-[#1E4D3A] to-[#0b2d22]';

  return (
    <div
      key={`${asistente.id}-${evento?.timestamp}`}
      className="relative overflow-hidden rounded-[30px] border border-transparent bg-gradient-to-br from-white via-white to-emerald-50/60 shadow-[0_30px_80px_-35px_rgba(15,81,50,0.5)] animate-fade-in"
    >
      <div className={`absolute inset-x-0 top-0 h-28 bg-gradient-to-r ${accent}`} />
      <div className="relative p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-5 mb-6">
          <span
            className={`inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold px-3 py-2 rounded-full border ${
              esSalida
                ? 'bg-slate-100 text-slate-700 border-slate-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {esSalida ? <LogOut className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {esSalida ? 'Salida registrada' : 'Ingreso validado'}
          </span>

          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-emerald-800 bg-white/90 border border-emerald-100 rounded-full px-3 py-1.5 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5" />
            QR verificado
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1.4fr] items-center gap-8 xl:gap-10">
          <div className="flex justify-center xl:justify-start">
            <div className="relative">
              <div className="absolute inset-0 rounded-[28px] bg-emerald-500/20 blur-2xl" />
              <div className="absolute -inset-2 rounded-[30px] border border-emerald-200/70" />
              <img
                src={asistente.fotografia}
                alt={asistente.nombre}
                className="relative w-40 h-40 sm:w-52 sm:h-52 xl:w-60 xl:h-60 rounded-[28px] object-cover border-[6px] border-white shadow-[0_30px_60px_-15px_rgba(30,77,58,0.5)]"
              />
            </div>
          </div>

          <div className="text-center xl:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1.5 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-emerald-700">
                {evento?.reunion?.nombre || 'Asamblea'}
              </span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight text-gray-900 leading-none">
              {asistente.nombre}
            </h1>

            <p className="mt-3 text-sm font-mono text-gray-500 tracking-[0.14em] uppercase">
              {asistente.folio}
            </p>

            <div
              className={`mt-6 inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border ${
                esSalida
                  ? 'bg-slate-50 text-slate-700 border-slate-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              {esSalida ? <LogOut className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {esSalida ? 'Salida registrada a las' : 'Entrada registrada a las'} {formatoHora(evento!.timestamp)}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center xl:justify-start gap-3 text-[11px] sm:text-xs font-bold text-gray-500">
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-100 px-3 py-1.5 shadow-sm">
                <Clock3 className="w-3.5 h-3.5 text-emerald-600" />
                {formatoHora(evento!.timestamp)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-100 px-3 py-1.5 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Validado por QR
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
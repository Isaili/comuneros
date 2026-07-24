"use client";

import React from 'react';
import { ScanFace, LogIn, LogOut, CheckCircle2, X } from 'lucide-react';
import { AsistenteRegistro } from '../types/types';

interface ComuneroPanelProps {
  asistente: AsistenteRegistro | null;
  onCerrar: () => void;
}

const formatoHora = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '—';

export const ComuneroPanel: React.FC<ComuneroPanelProps> = ({ asistente, onCerrar }) => {
  return (
    <aside className="w-full lg:w-[26%] xl:w-1/4 shrink-0 bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col lg:sticky lg:top-8 lg:h-fit">
      {!asistente ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-10 text-gray-300">
          <ScanFace className="w-12 h-12" />
          <p className="text-xs font-semibold text-gray-400 max-w-[200px]">
            La información del comunero aparecerá aquí en cuanto escanee el código QR.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-3 h-3" /> {asistente.horaSalida ? 'Salida registrada' : 'Entrada registrada'}
            </span>
            <button onClick={onCerrar} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col items-center text-center pt-2">
            <img
              src={asistente.fotografia}
              alt={asistente.nombre}
              className="w-20 h-20 rounded-2xl object-cover border border-gray-100 shadow-sm"
            />
            <h3 className="text-base font-black text-gray-900 mt-3">{asistente.nombre}</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{asistente.folio}</p>
          </div>

          <div className="border-t border-gray-50 pt-4 space-y-2.5">
            <div className="flex items-center justify-between bg-emerald-50/60 border border-emerald-100 rounded-xl px-3 py-2.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                <LogIn className="w-3.5 h-3.5" /> Hora de entrada
              </span>
              <span className="text-sm font-black text-emerald-800 font-mono">{formatoHora(asistente.horaEntrada)}</span>
            </div>

            <div className="flex items-center justify-between bg-gray-50/60 border border-gray-100 rounded-xl px-3 py-2.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <LogOut className="w-3.5 h-3.5" /> Hora de salida
              </span>
              <span className="text-sm font-black text-gray-700 font-mono">{formatoHora(asistente.horaSalida)}</span>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 font-medium leading-relaxed pt-1 text-center">
            {asistente.horaSalida
              ? 'Este comunero ya registró su salida de la asamblea.'
              : 'Puede volver a escanear el código QR al retirarse para registrar su salida.'}
          </p>
        </div>
      )}
    </aside>
  );
};
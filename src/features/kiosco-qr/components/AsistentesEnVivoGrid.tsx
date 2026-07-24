"use client";

import React from 'react';
import { Users, LogIn, LogOut } from 'lucide-react';
import { AsistenteRegistro } from '../types/types';

interface AsistentesEnVivoGridProps {
  asistentes: AsistenteRegistro[];
  onSeleccionar: (asistente: AsistenteRegistro) => void;
}

const formatoHora = (iso: string) =>
  new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

export const AsistentesEnVivoGrid: React.FC<AsistentesEnVivoGridProps> = ({ asistentes, onSeleccionar }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
          <Users className="w-4 h-4 text-gray-500" /> Asistentes en tiempo real
        </h3>
        <span className="text-xs font-extrabold text-gray-500 bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5">
          {asistentes.length}
        </span>
      </div>

      {asistentes.length === 0 ? (
        <p className="text-xs text-gray-400 font-medium py-6 text-center">
          Aún no se registran asistentes. En cuanto se escanee un código, aparecerán aquí.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
          {asistentes
            .slice()
            .reverse()
            .map((a) => (
              <button
                key={a.id}
                onClick={() => onSeleccionar(a)}
                className="flex items-center gap-2.5 border border-gray-100 hover:border-[#1E4D3A]/30 hover:bg-[#1E4D3A]/5 rounded-xl p-2.5 text-left transition-all"
              >
                <img src={a.fotografia} alt={a.nombre} className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-900 truncate">{a.nombre}</p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] font-semibold text-gray-500">
                    <span className="flex items-center gap-0.5 text-emerald-600">
                      <LogIn className="w-3 h-3" /> {formatoHora(a.horaEntrada)}
                    </span>
                    {a.horaSalida && (
                      <span className="flex items-center gap-0.5 text-gray-400">
                        <LogOut className="w-3 h-3" /> {formatoHora(a.horaSalida)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
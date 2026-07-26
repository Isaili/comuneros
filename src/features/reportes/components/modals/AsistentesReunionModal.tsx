"use client";

import React, { useMemo, useState } from 'react';
import { X, Calendar, MapPin, Users, LogIn, LogOut, Search } from 'lucide-react';
import { ReunionHistorial } from '../../types/types';

interface AsistentesReunionModalProps {
  reunion: ReunionHistorial;
  onClose: () => void;
}

const formatoFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-MX', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

const formatoHora = (iso?: string) =>
  iso ? new Date(iso).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '—';

export const AsistentesReunionModal: React.FC<AsistentesReunionModalProps> = ({ reunion, onClose }) => {
  const [busqueda, setBusqueda] = useState('');

  const asistentesFiltrados = useMemo(() => {
    const query = busqueda.trim().toLowerCase();
    if (!query) return reunion.asistentes;
    return reunion.asistentes.filter(
      (a) => a.nombre.toLowerCase().includes(query) || a.folio.toLowerCase().includes(query)
    );
  }, [reunion.asistentes, busqueda]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-gray-700">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
          <div className="min-w-0">
            <h3 className="text-lg font-black text-gray-900 truncate">{reunion.nombre}</h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatoFecha(reunion.fecha)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400" /> {reunion.lugar}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>


        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between bg-[#1E4D3A]/5 border border-[#1E4D3A]/10 rounded-xl px-4 py-3">
            <span className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
              <Users className="w-4 h-4 text-[#1E4D3A]" /> Total de asistentes
            </span>
            <span className="text-lg font-black text-[#1E4D3A]">{reunion.asistentes.length}</span>
          </div>


          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar comunero por nombre o folio..."
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 outline-none focus:border-[#1E4D3A] transition-colors shadow-sm placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            {asistentesFiltrados.length === 0 ? (
              <p className="text-xs text-gray-400 font-medium text-center py-6">
                Ningún asistente coincide con "{busqueda}".
              </p>
            ) : (
              asistentesFiltrados.map((a) => (
                <div key={a.id} className="flex items-center gap-3 border border-gray-100 rounded-xl p-3">
                  <img src={a.fotografia} alt={a.nombre} className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{a.nombre}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{a.folio}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 text-[11px] font-semibold">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <LogIn className="w-3 h-3" /> {formatoHora(a.horaEntrada)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400">
                      <LogOut className="w-3 h-3" /> {formatoHora(a.horaSalida)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
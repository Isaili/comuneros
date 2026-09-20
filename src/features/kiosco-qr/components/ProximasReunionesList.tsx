"use client";

import React from 'react';
import { Calendar, MapPin, Clock, Plus, CheckCircle2, Pencil, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Reunion } from '../types/types';

interface ProximasReunionesListProps {
  reuniones: Reunion[];
  reunionDestacadaId?: string | null;
  reunionMasCercanaId?: string | null;
  onSeleccionar: (reunionId: string) => void;
  onNuevaReunion: () => void;
  onEditar?: (reunion: Reunion) => void;
  titulo?: string;
  etiquetaBoton?: string;
}

const formatoFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });

export const ProximasReunionesList: React.FC<ProximasReunionesListProps> = ({
  reuniones,
  reunionDestacadaId,
  reunionMasCercanaId,
  onSeleccionar,
  onNuevaReunion,
  onEditar,
  titulo = 'Próximas asambleas',
  etiquetaBoton = 'Ver asistentes',
}) => {
  const [pagina, setPagina] = React.useState(1);
  const totalPaginas = Math.max(1, Math.ceil(reuniones.length / 5));
  const reunionesVisibles = reuniones.slice((pagina - 1) * 5, pagina * 5);

  React.useEffect(() => {
    setPagina(1);
  }, [reuniones.length]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm">{titulo}</h3>
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
          {reunionesVisibles.map((r) => {
            const enKiosco = r.id === reunionDestacadaId;
            const esMasCercana = r.id === reunionMasCercanaId;

            return (
              <div
                key={r.id}
                className={`w-full text-left border-2 rounded-xl p-3 transition-all duration-200 ${
                  enKiosco
                    ? 'border-[#1E4D3A] bg-[#1E4D3A]/[0.06] shadow-sm'
                    : 'border-gray-100 bg-gray-50/40 hover:border-[#1E4D3A]/25 hover:bg-[#1E4D3A]/5'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <button type="button" onClick={() => onSeleccionar(r.id)} className="min-w-0 flex-1 text-left">
                  <p className="font-bold text-gray-900 text-xs truncate">{r.nombre}</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSeleccionar(r.id)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#1E4D3A]/15 bg-[#1E4D3A]/5 px-2 py-1.5 text-[10px] font-bold text-[#1E4D3A] hover:bg-[#1E4D3A]/10"
                  >
                    <Users className="w-3 h-3" /> {etiquetaBoton}
                  </button>
                  {onEditar && (
                    <button type="button" onClick={() => onEditar(r)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#1E4D3A] hover:bg-[#1E4D3A]/10" aria-label={`Editar ${r.nombre}`}>
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
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
              </div>
            );
          })}
        </div>
      )}
      {totalPaginas > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
          <span className="text-[11px] font-semibold text-gray-400">Página {pagina} de {totalPaginas}</span>
          <div className="flex gap-1">
            <button type="button" disabled={pagina === 1} onClick={() => setPagina((actual) => actual - 1)} className="p-1.5 rounded-lg border border-[#1E4D3A] bg-[#1E4D3A] text-white hover:bg-[#153629] disabled:opacity-40 disabled:hover:bg-[#1E4D3A]">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button type="button" disabled={pagina === totalPaginas} onClick={() => setPagina((actual) => actual + 1)} className="p-1.5 rounded-lg border border-[#1E4D3A] bg-[#1E4D3A] text-white hover:bg-[#153629] disabled:opacity-40 disabled:hover:bg-[#1E4D3A]">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
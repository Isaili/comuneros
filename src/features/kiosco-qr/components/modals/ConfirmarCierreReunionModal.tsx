"use client";

import React, { useState } from 'react';
import { X, DoorClosed, AlertTriangle } from 'lucide-react';
import { Reunion } from '../../types/types';
import LoadingOverlay from '@/components/LoadingOverlay';

interface ConfirmarCierreReunionModalProps {
  reunion: Reunion;
  totalAsistentes: number;
  onClose: () => void;
  onConfirmar: () => Promise<void> | void;
}

export const ConfirmarCierreReunionModal: React.FC<ConfirmarCierreReunionModalProps> = ({
  reunion,
  totalAsistentes,
  onClose,
  onConfirmar,
}) => {
  const [guardando, setGuardando] = useState(false);

  const handleConfirmar = async () => {
    if (guardando) return;
    setGuardando(true);
    try {
      await onConfirmar();
    } catch (cause) {
      alert(cause instanceof Error ? cause.message : 'No se pudieron habilitar las salidas.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      {guardando && <LoadingOverlay message="Habilitando salidas..." />}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col text-gray-700 text-sm font-semibold">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <span className="p-1.5 bg-red-600/10 text-red-600 rounded-lg">
              <DoorClosed className="w-4 h-4" />
            </span>
            Habilitar salidas
          </h3>
          <button type="button" onClick={onClose} disabled={guardando} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 disabled:opacity-50">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50/60 border border-gray-100 rounded-xl p-3.5">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Reunión</p>
            <p className="text-sm font-black text-gray-900 mt-0.5">{reunion.nombre}</p>
            <p className="text-xs text-gray-500 font-semibold mt-1">{totalAsistentes} asistentes registrados</p>
          </div>

          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 p-3.5 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 leading-relaxed font-medium">
              Se habilitará el escaneo de salidas mediante QR. Las entradas ya están bloqueadas.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} disabled={guardando} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-600 transition-colors disabled:opacity-50">
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={guardando}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <DoorClosed className="w-3.5 h-3.5" /> {guardando ? 'Habilitando...' : 'Habilitar salidas'}
          </button>
        </div>
      </div>
    </div>
  );
};
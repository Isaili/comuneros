"use client";

import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import { Multa } from '../../types/types';

interface ConfirmarEliminarModalProps {
  multa: Multa;
  onClose: () => void;
  onConfirmar: (multa: Multa) => void;
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export const ConfirmarEliminarModal: React.FC<ConfirmarEliminarModalProps> = ({ multa, onClose, onConfirmar }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col text-gray-700 text-sm font-semibold">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            Eliminar multa
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>


        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 bg-gray-50/60 p-3.5 rounded-xl border border-gray-100">
            <img
              src={multa.comuneroFotografia}
              alt={multa.comuneroNombre}
              className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-mono">{multa.folio}</p>
              <p className="text-sm font-black text-gray-900 truncate">{multa.comuneroNombre}</p>
              <p className="text-xs text-gray-500">{formatoMoneda(multa.cantidad)} · {multa.descripcion}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 p-3.5 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 leading-relaxed font-medium">
              Esta acción eliminará la multa de forma permanente y no se puede deshacer.
            </p>
          </div>
        </div>


        <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-600 transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirmar(multa)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" /> Eliminar definitivamente
          </button>
        </div>
      </div>
    </div>
  );
};
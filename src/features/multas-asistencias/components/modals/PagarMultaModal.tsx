"use client";

import React, { useState } from 'react';
import { X, Landmark, AlertCircle, Banknote } from 'lucide-react';
import { Multa } from '../../types/types';

interface PagarMultaModalProps {
  multa: Multa;
  onClose: () => void;
  onConfirmar: (multa: Multa, metodoPago: 'efectivo' | 'transferencia') => void;
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export const PagarMultaModal: React.FC<PagarMultaModalProps> = ({ multa, onClose, onConfirmar }) => {
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'transferencia'>('efectivo');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col text-gray-700 text-sm font-semibold">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-700/10 text-emerald-700 rounded-lg">
              <Landmark className="w-4 h-4" />
            </span>
            Confirmar liquidación
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>


        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <img
                src={multa.comuneroFotografia}
                alt={multa.comuneroNombre}
                className="w-10 h-10 rounded-lg object-cover border border-emerald-100"
              />
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Comunero</p>
                <p className="text-sm font-black text-gray-900 truncate">{multa.comuneroNombre}</p>
              </div>
            </div>
            <div className="md:text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total a liquidar</p>
              <p className="text-lg font-black text-emerald-700">{formatoMoneda(multa.cantidad)}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-500 font-bold block">Método de pago</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMetodoPago('efectivo')}
                className={`border rounded-xl p-3 flex items-center gap-2 text-sm font-bold transition-all ${
                  metodoPago === 'efectivo' ? 'border-[#1E4D3A] bg-[#1E4D3A]/5 text-[#1E4D3A]' : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                <Banknote className="w-4 h-4" /> Efectivo
              </button>
              <button
                type="button"
                onClick={() => setMetodoPago('transferencia')}
                className={`border rounded-xl p-3 flex items-center gap-2 text-sm font-bold transition-all ${
                  metodoPago === 'transferencia' ? 'border-[#1E4D3A] bg-[#1E4D3A]/5 text-[#1E4D3A]' : 'border-gray-200 bg-white text-gray-600'
                }`}
              >
                <Landmark className="w-4 h-4" /> Transferencia
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-[#F5F3F3] border border-[#E6E8EB] p-3.5 rounded-xl">
            <AlertCircle className="w-4 h-4 text-[#5F5E5E] shrink-0 mt-0.5" />
            <p className="text-sm text-[#5F5E5E] leading-relaxed font-medium">
              Esta acción marcará la multa como pagada y generará un recibo. No se puede deshacer desde aquí.
            </p>
          </div>
        </div>


        <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-600 transition-colors">
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirmar(multa, metodoPago)}
            className="px-4 py-2 bg-[#1E4D3A] hover:bg-[#153629] text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            Confirmar pago
          </button>
        </div>
      </div>
    </div>
  );
};
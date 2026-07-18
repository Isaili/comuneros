"use client";

import React from 'react';
import { X, CheckCircle2, Printer } from 'lucide-react';
import { Multa } from '../types/types';

interface ReciboPagoModalProps {
  multa: Multa;
  onClose: () => void;
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export const ReciboPagoModal: React.FC<ReciboPagoModalProps> = ({ multa, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col text-gray-700">

        <div className="relative flex flex-col items-center text-center px-6 pt-7 pb-5 border-b border-dashed border-gray-200 bg-emerald-50/40">
          <span className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5">
            <CheckCircle2 className="w-5 h-5" />
          </span>
          <h3 className="text-base font-black text-gray-900">Pago registrado</h3>
          <p className="text-sm text-gray-500 mt-0.5">La multa fue liquidada correctamente.</p>
          <button type="button" onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-2 text-sm font-mono">
          <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
            <span className="text-gray-400">Folio de recibo</span>
            <span className="font-bold text-gray-900">{multa.reciboFolio}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
            <span className="text-gray-400">Comunero</span>
            <span className="font-bold text-gray-900">{multa.comuneroNombre}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
            <span className="text-gray-400">Folio de multa</span>
            <span className="font-bold text-gray-900">{multa.folio}</span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-50 pb-1.5">
            <span className="text-gray-400">Concepto</span>
            <span className="font-bold text-gray-900">{multa.tipo === 'inasistencia' ? 'Inasistencia' : 'Otro'}</span>
          </div>
          <div className="flex items-center justify-between pb-1.5">
            <span className="text-gray-400">Fecha de pago</span>
            <span className="font-bold text-gray-900">
              {multa.fechaPago && new Date(multa.fechaPago).toLocaleDateString('es-MX')}
            </span>
          </div>

          <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between">
            <span className="text-xs text-gray-400 uppercase tracking-wide font-sans font-bold">Total pagado</span>
            <span className="text-xl font-black text-[#1E4D3A]">{formatoMoneda(multa.cantidad)}</span>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-600 transition-colors">
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#1E4D3A] hover:bg-[#153629] text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};
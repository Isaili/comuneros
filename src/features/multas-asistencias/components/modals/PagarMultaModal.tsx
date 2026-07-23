"use client";

import React from 'react';
import { X, User, CheckCircle, Banknote } from 'lucide-react';
import { Multa } from '../../types/types';

interface PagarMultaModalProps {
  multa: Multa;
  onClose: () => void;
  onConfirmar: (multa: Multa) => void;
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export const PagarMultaModal: React.FC<PagarMultaModalProps> = ({ multa, onClose, onConfirmar }) => {
  const concepto = multa.tipo === 'inasistencia' ? 'Multa por inasistencia' : 'Multa - Otro concepto';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4">

      <div className="bg-white border border-gray-100 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh] sm:max-h-[unset] flex flex-col animate-scale-up">


        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-50 bg-gray-50/50">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-gray-900">
              Confirmación de Liquidación
            </h3>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
              Ref: Multa #{multa.folio}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">

          <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-3 sm:p-3.5 space-y-2">
            <div className="flex items-start gap-2 text-xs font-semibold text-gray-500">
              <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-bold leading-none">Comunero</p>
                <p className="text-gray-900 mt-1 font-bold text-xs sm:text-sm break-words">{multa.comuneroNombre}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-gray-100 pt-2 text-gray-600 font-semibold">
              <span>Concepto</span>
              <span className="font-bold text-gray-900">{concepto}</span>
            </div>
          </div>


          <div className="space-y-2">
            <h4 className="font-bold text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wide">Detalle de la multa</h4>
            <div className="bg-white border border-gray-100 rounded-2xl p-3 space-y-2.5 text-xs font-semibold text-gray-600">
              <div className="flex justify-between">
                <span>Fecha de generación</span>
                <span className="font-mono text-gray-900">
                  {new Date(multa.fechaGeneracion).toLocaleDateString('es-MX')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Descripción</span>
                <span className="text-gray-900 text-right max-w-[200px]">{multa.descripcion}</span>
              </div>
            </div>
          </div>


          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-900">Una sola exhibición</p>
              <p className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold mt-0.5">La liquidación debe ser cubierta en efectivo al momento.</p>
            </div>
          </div>


          <div className="bg-[#1E4D3A]/5 border border-[#1E4D3A]/10 rounded-2xl p-3.5 sm:p-4 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700">Total a Liquidar:</span>
            <span className="text-lg sm:text-xl font-black text-[#1E4D3A] font-mono">{formatoMoneda(multa.cantidad)}</span>
          </div>


          <div className="flex flex-col-reverse sm:flex-row items-center gap-2 pt-1 sm:pt-2">
            <button
              onClick={onClose}
              className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => onConfirmar(multa)}
              className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#1E4D3A] hover:bg-[#153629] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <CheckCircle className="w-4 h-4" />
              Hacer Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
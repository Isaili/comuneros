"use client";

import React from 'react';
import { X, Receipt, Printer } from 'lucide-react';
import { Multa } from '../../types/types';

interface ReciboPagoModalProps {
  multa: Multa;
  onClose: () => void;
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export const ReciboPagoModal: React.FC<ReciboPagoModalProps> = ({ multa, onClose }) => {
  const fechaPago = multa.fechaPago
    ? new Date(multa.fechaPago).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';

  const concepto = multa.tipo === 'inasistencia' ? 'Multa por inasistencia' : 'Multa - Otro concepto';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 print:bg-white print:p-0">
      <div className="bg-white border border-gray-100 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh] sm:max-h-[unset] flex flex-col animate-scale-up print:shadow-none print:border-none print:w-full print:max-w-full">


        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-50 bg-gray-50/50 print:hidden">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-gray-900">
              Comprobante Oficial de Pago
            </h3>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
              Ref: Multa #{multa.folio}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>


        <div className="p-4 sm:p-5 space-y-4 print:p-0">

          <div className="border border-dashed border-gray-200 rounded-2xl p-4 sm:p-5 bg-slate-50/50 space-y-4 text-center font-semibold text-xs text-gray-500 relative print:border-none print:bg-white print:p-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-emerald-100 text-emerald-800 text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full print:hidden">
              Transacción Exitosa
            </div>

            <div className="pt-2 flex flex-col items-center">
              <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 mb-2" />
              <h4 className="text-xs sm:text-sm font-black text-gray-900">TESORERÍA COMUNAL</h4>
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase mt-0.5">Recibo de pago de multa</p>
            </div>

            <div className="border-t border-b border-dashed border-gray-200 py-3 sm:py-3.5 space-y-2 text-left font-semibold">
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Contribuyente:</span>
                <span className="text-gray-900 font-bold text-right truncate max-w-[180px] sm:max-w-[220px]">{multa.comuneroNombre}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Concepto:</span>
                <span className="text-gray-900 text-right">{concepto}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Folio de multa:</span>
                <span className="text-gray-900 text-right">{multa.folio}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-400">Folio de recibo:</span>
                <span className="text-gray-900 text-right">{multa.reciboFolio ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Fecha de Pago:</span>
                <span className="text-gray-900">{fechaPago}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Forma de Pago:</span>
                <span className="text-gray-900">Efectivo</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white border border-gray-100 rounded-xl p-3">
              <span className="font-bold text-gray-700 text-xs">Monto Cobrado</span>
              <span className="text-sm sm:text-base font-black text-emerald-700 font-mono">{formatoMoneda(multa.cantidad)}</span>
            </div>

            <p className="text-[8px] sm:text-[9px] text-gray-400 leading-normal pt-1">
              Este documento sirve como comprobante oficial de pago de la multa registrada para el ejercicio fiscal actual de 2026.
            </p>
          </div>


          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 sm:pt-2 print:hidden">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4 text-gray-500" />
              Imprimir Recibo
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
            >
              Listo / Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
"use client";

import React, { useState, useRef } from 'react';
import { X, Download, ShieldCheck, Landmark } from 'lucide-react';
import { Multa } from '../../types/types';
import { ReciboMultaPDF } from '../ReciboMultaPDF';
import { getDatosRecibo, descargarReciboPDF } from '../../utils/recibo.utils';

interface ReciboPagoModalProps {
  multa: Multa;
  onClose: () => void;
}

export const ReciboPagoModal: React.FC<ReciboPagoModalProps> = ({ multa, onClose }) => {
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const { fechaPago, concepto, folioRecibo, montoTexto } = getDatosRecibo(multa);

  const handleDescargarPDF = async () => {
    if (!pdfRef.current || generandoPDF) return;
    setGenerandoPDF(true);
    try {
      await descargarReciboPDF(pdfRef.current, `Recibo_Multa_${multa.folio}.pdf`);
    } finally {
      setGenerandoPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white border border-gray-100 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[92vh] sm:max-h-[unset] flex flex-col transition-all">


        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#006837]/10 flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4 text-[#006837]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-gray-900">
                Comprobante Oficial de Pago
              </h3>
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                Ref: MULTA #{multa.folio}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>


        <div className="p-4 sm:p-6 space-y-4">

          <div
            style={{ backgroundColor: '#ffffff', borderColor: '#a7f3d0' }}
            className="relative border-2 rounded-2xl p-6 sm:p-8 space-y-5 font-semibold text-xs overflow-hidden shadow-sm"
          >
            <img
              src="/fondo.png"
              alt="Fondo Iglesia Copainalá"
              className="absolute inset-0 w-full h-full object-cover opacity-[0.35] pointer-events-none z-0"
            />
            <div className="absolute inset-2 border border-[#a7f3d0]/60 rounded-xl pointer-events-none z-0" />

            <div className="relative z-10 space-y-5">
              <div style={{ borderColor: '#6ee7b7' }} className="flex items-center justify-between border-b-2 pb-3">
                <img src="/recibo3.png" alt="Logo Copainalá" className="w-40 h-30 object-contain shrink-0" />

                <div className="text-center flex-1 px-3">
                  <h4 style={{ color: '#064e3b' }} className="text-base font-black uppercase tracking-tight leading-snug">
                    Casa de Bienes Comunales
                  </h4>
                  <p style={{ color: '#047857' }} className="text-xs font-bold uppercase mt-0.5">Copainalá, Chiapas</p>
                  <p style={{ color: '#6b7280' }} className="text-[10px] uppercase mt-0.5 tracking-wider font-semibold">
                    Tesorería y Administración Comunal
                  </p>
                  <span
                    style={{ backgroundColor: 'rgba(236, 253, 245, 0.95)', color: '#064e3b', borderColor: '#a7f3d0' }}
                    className="inline-flex items-center gap-1 mt-1.5 border text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Recibo Oficial de Pago
                  </span>
                </div>

                <div className="w-40 shrink-0 hidden sm:block" />
              </div>

              <div
                style={{ backgroundColor: 'rgba(240, 253, 244, 0.9)', borderColor: '#d1fae5' }}
                className="flex justify-between items-center text-xs p-3 rounded-xl border backdrop-blur-[1px]"
              >
                <div>
                  <span style={{ color: '#6b7280' }} className="font-bold">Folio: </span>
                  <span style={{ color: '#064e3b' }} className="font-black font-mono">{folioRecibo}</span>
                </div>
                <div>
                  <span style={{ color: '#6b7280' }} className="font-bold">Fecha: </span>
                  <span style={{ color: '#111827' }} className="font-bold">{fechaPago}</span>
                </div>
              </div>

              <div style={{ borderColor: '#e5e7eb' }} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 border-y border-dashed py-3 text-left text-xs">
                <div className="flex flex-col gap-0.5">
                  <span style={{ color: '#6b7280' }} className="text-[9px] uppercase font-bold tracking-wide">Contribuyente</span>
                  <span style={{ color: '#111827' }} className="font-bold">{multa.comuneroNombre}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span style={{ color: '#6b7280' }} className="text-[9px] uppercase font-bold tracking-wide">Concepto</span>
                  <span style={{ color: '#111827' }} className="font-bold">{concepto}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span style={{ color: '#6b7280' }} className="text-[9px] uppercase font-bold tracking-wide">Folio de Multa</span>
                  <span style={{ color: '#111827' }} className="font-bold">#{multa.folio}</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span style={{ color: '#6b7280' }} className="text-[9px] uppercase font-bold tracking-wide">Forma de Pago</span>
                  <span style={{ color: '#111827' }} className="font-bold">Efectivo (Una sola exhibición)</span>
                </div>
              </div>

              <div
                style={{ backgroundColor: 'rgba(249, 250, 251, 0.55)', borderColor: '#e5e7eb' }}
                className="flex justify-between items-center border rounded-xl p-3.5 backdrop-blur-[1px]"
              >
                <span style={{ color: '#374151' }} className="font-bold text-xs uppercase">Monto Total Liquidado:</span>
                <span style={{ color: '#065f46' }} className="text-xl font-black font-mono">{montoTexto}</span>
              </div>

              <div className="text-center space-y-3 pt-2">
                <p style={{ color: '#374151' }} className="text-[9px] leading-tight italic font-semibold">
                  Este recibo es comprobante oficial de pago de la multa comunal registrada correspondiente al ejercicio fiscal actual.
                </p>

                <div className="pt-3 flex justify-around items-end">
                  <div style={{ borderColor: '#4b5563' }} className="border-t w-36 text-center pt-1">
                    <p style={{ color: '#1f2937' }} className="text-[8px] font-bold uppercase">Tesorero Comunal</p>
                  </div>
                  <div style={{ borderColor: '#4b5563' }} className="border-t w-36 text-center pt-1">
                    <p style={{ color: '#1f2937' }} className="text-[8px] font-bold uppercase">Firma / Sello Recibido</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <ReciboMultaPDF ref={pdfRef} multa={multa} />

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              onClick={handleDescargarPDF}
              disabled={generandoPDF}
              className="w-full sm:w-1/2 py-3 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              {generandoPDF ? 'Generando PDF…' : 'Descargar Recibo (PDF)'}
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-1/2 py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Listo / Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
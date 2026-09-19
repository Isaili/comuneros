"use client";

import React, { forwardRef } from 'react';
import { Multa } from '../types/types';
import { PDF_WIDTH_MM, PDF_HEIGHT_MM, getDatosRecibo } from '../utils/recibo.utils';

interface ReciboMultaPDFProps {
  multa: Multa;
}

export const ReciboMultaPDF = forwardRef<HTMLDivElement, ReciboMultaPDFProps>(({ multa }, ref) => {
  const { fechaPago, concepto, folioRecibo, montoTexto } = getDatosRecibo(multa);

  return (
    <div className="fixed top-0 left-0 -translate-x-[9999px] pointer-events-none" aria-hidden="true">
      <div
        ref={ref}
        style={{
          width: `${PDF_WIDTH_MM}mm`,
          height: `${PDF_HEIGHT_MM}mm`,
          padding: '9mm 12mm',
          backgroundColor: '#ffffff',
          boxSizing: 'border-box'
        }}
        className="relative flex flex-col font-semibold text-[11px] overflow-hidden"
      >
        <img
          src="/fondo.png"
          alt="Fondo"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.35] pointer-events-none z-0"
        />
        <div className="absolute inset-[3mm] border border-[#a7f3d0] rounded-2xl pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col h-full justify-between gap-3">

          <div>
            <div style={{ borderColor: '#6ee7b7' }} className="flex items-center justify-between border-b-2 pb-2.5">
              <img
                src="/recibo3.png"
                alt="Logo Copainalá"
                className="w-48 h-30 object-contain shrink-0"
              />

              <div className="text-center flex-1 px-3">
                <h4 style={{ color: '#064e3b' }} className="text-sm font-black uppercase tracking-tight leading-tight">
                  Casa de Bienes Comunales
                </h4>
                <p style={{ color: '#047857' }} className="text-[10px] font-bold uppercase mt-0.5">Copainalá, Chiapas</p>
                <p style={{ color: '#6b7280' }} className="text-[8.5px] uppercase mt-0.5 tracking-wider font-semibold">
                  Tesorería y Administración Comunal
                </p>
                <span
                  style={{ backgroundColor: 'rgba(236, 253, 245, 0.95)', color: '#064e3b', borderColor: '#a7f3d0' }}
                  className="inline-block mt-1 border text-[8.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                >
                  Recibo Oficial de Pago
                </span>
              </div>

              <div className="w-44 shrink-0" />
            </div>

            <div
              style={{ backgroundColor: 'rgba(240, 253, 244, 0.9)', borderColor: '#d1fae5' }}
              className="flex justify-between items-center text-[10px] p-2 mt-2.5 rounded-lg border"
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

            <div
              style={{ borderColor: '#e5e7eb' }}
              className="grid grid-cols-2 gap-x-5 gap-y-1.5 border-y border-dashed py-2.5 mt-2.5 text-left text-[10px]"
            >
              <div className="flex flex-col gap-0.5">
                <span style={{ color: '#6b7280' }} className="text-[8px] uppercase font-bold tracking-wide">Contribuyente</span>
                <span style={{ color: '#111827' }} className="font-bold">{multa.comuneroNombre}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span style={{ color: '#6b7280' }} className="text-[8px] uppercase font-bold tracking-wide">Concepto</span>
                <span style={{ color: '#111827' }} className="font-bold">{concepto}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span style={{ color: '#6b7280' }} className="text-[8px] uppercase font-bold tracking-wide">Folio de Multa</span>
                <span style={{ color: '#111827' }} className="font-bold">#{multa.folio}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span style={{ color: '#6b7280' }} className="text-[8px] uppercase font-bold tracking-wide">Forma de Pago</span>
                <span style={{ color: '#111827' }} className="font-bold">Efectivo (Una sola exhibición)</span>
              </div>
            </div>
          </div>


          <div
            style={{ backgroundColor: 'rgba(249, 250, 251, 0.55)', borderColor: '#e5e7eb' }}
            className="flex justify-between items-center border rounded-xl p-2.5"
          >
            <span style={{ color: '#374151' }} className="font-bold text-[10px] uppercase">Monto Total Liquidado:</span>
            <span style={{ color: '#065f46' }} className="text-lg font-black font-mono">{montoTexto}</span>
          </div>


          <div className="text-center space-y-2">
            <p style={{ color: '#374151' }} className="text-[8px] leading-tight italic font-semibold px-4">
              Este recibo es comprobante oficial de pago de la multa comunal registrada correspondiente al ejercicio fiscal actual.
            </p>

            <div className="pt-1.5 flex justify-around items-end">
              <div style={{ borderColor: '#4b5563' }} className="border-t w-32 text-center pt-1">
                <p style={{ color: '#1f2937' }} className="text-[7.5px] font-bold uppercase">Tesorero Comunal</p>
              </div>
              <div style={{ borderColor: '#4b5563' }} className="border-t w-32 text-center pt-1">
                <p style={{ color: '#1f2937' }} className="text-[7.5px] font-bold uppercase">Firma / Sello Recibido</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ReciboMultaPDF.displayName = 'ReciboMultaPDF';
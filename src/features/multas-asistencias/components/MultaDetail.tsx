"use client";

import React from 'react';
import { X, CircleDollarSign, Printer } from 'lucide-react';
import { Multa } from '../types/types';
import { AsistenciaHistorial } from './AsistenciaHistorial';
import { historialMock } from '../mocks/historialMock';

interface DetailProps {
  multa: Multa;
  onClose: () => void;
  onPagarClick: () => void;
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export const MultaDetail: React.FC<DetailProps> = ({ multa, onClose, onPagarClick }) => {
  const esPagada = multa.estado === 'pagada';
  const historial = historialMock.find((h) => h.comuneroId === multa.comuneroId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-gray-700">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={multa.comuneroFotografia}
              alt={multa.comuneroNombre}
              className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{multa.folio}</p>
              <h2 className="text-lg font-black text-gray-900 truncate">{multa.comuneroNombre}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
              esPagada ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
            }`}>
              {esPagada ? 'Pagada' : 'Pendiente'}
            </span>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>


        <div className="p-6 overflow-y-auto space-y-4">

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5">
              <p className="text-xs font-bold text-gray-400">Cantidad</p>
              <p className="text-sm font-extrabold text-gray-900 mt-0.5">{formatoMoneda(multa.cantidad)}</p>
            </div>
            <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5">
              <p className="text-xs font-bold text-gray-400">Tipo</p>
              <p className="text-sm font-extrabold text-gray-900 mt-0.5 truncate">
                {multa.tipo === 'inasistencia' ? 'Inasistencia' : 'Otro'}
              </p>
            </div>
            <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5">
              <p className="text-xs font-bold text-gray-400">Fecha</p>
              <p className="text-sm font-extrabold text-gray-900 mt-0.5">
                {new Date(multa.fechaGeneracion).toLocaleDateString('es-MX')}
              </p>
            </div>
            <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5">
              <p className="text-xs font-bold text-gray-400">Recibo</p>
              <p className="text-sm font-extrabold text-gray-900 mt-0.5 font-mono truncate">
                {multa.reciboFolio ?? '—'}
              </p>
            </div>
          </div>


          <div className="space-y-2">
            <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wide">Información general</h4>
            <div className="bg-white border border-gray-100 rounded-xl p-3 text-sm grid grid-cols-1 gap-y-1.5 text-gray-500 font-semibold">
              {multa.tipo === 'inasistencia' && multa.asamblea && (
                <div className="flex justify-between border-b border-gray-50 pb-1">
                  <span className="text-gray-400">No asistió a</span>
                  <span className="text-gray-900">{multa.asamblea.nombre}</span>
                </div>
              )}
              <div className={`flex justify-between ${multa.tipo === 'inasistencia' ? 'border-b border-gray-50 pb-1' : ''}`}>
                <span className="text-gray-400">Descripción</span>
                <span className="text-gray-900 text-right max-w-[240px]">{multa.descripcion}</span>
              </div>
              {esPagada && (
                <div className="flex justify-between pt-1">
                  <span className="text-gray-400">Fecha de pago</span>
                  <span className="text-emerald-700 font-bold">
                    {multa.fechaPago && new Date(multa.fechaPago).toLocaleDateString('es-MX')}
                  </span>
                </div>
              )}
            </div>
          </div>


          {historial && <AsistenciaHistorial historial={historial} />}
        </div>


        <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-600 transition-colors">
            Cerrar
          </button>
          {esPagada ? (
            <button className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-700 transition-colors flex items-center gap-1.5 shadow-xs">
              <Printer className="w-3.5 h-3.5 text-gray-500" /> Reimprimir recibo
            </button>
          ) : (
            <button
              onClick={onPagarClick}
              className="px-4 py-2 bg-[#1E4D3A] hover:bg-[#153629] text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CircleDollarSign className="w-3.5 h-3.5" /> Registrar pago
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
"use client";

import React from 'react';
import { MapPin, Download } from 'lucide-react';
import { Lote } from './LotesList';

interface DetailProps {
  lote: Lote;
}

export const LoteDetail: React.FC<DetailProps> = ({ lote }) => {
  const isPagado = lote.estadoPredial === 'Pagado';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 space-y-4 w-full lg:max-h-[750px] lg:overflow-y-auto scrollbar-thin">
      
      {/* Fila Título del Lote */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-50 pb-3">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Lote seleccionado</p>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-xl font-black text-gray-900">{lote.numero}</h2>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
              isPagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            }`}>
              {lote.estadoPredial}
            </span>
          </div>
        </div>
        <button className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> Ver en mapa
        </button>
      </div>

      {/* Grid de KPIs Superior */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5">
          <p className="text-[10px] font-bold text-gray-400">Folio</p>
          <p className="text-xs font-extrabold text-gray-900 mt-0.5 font-mono truncate">{lote.folio}</p>
        </div>
        <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5">
          <p className="text-[10px] font-bold text-gray-400">Superficie</p>
          <p className="text-xs font-extrabold text-gray-900 mt-0.5 truncate">{lote.superficie}</p>
        </div>
        <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5">
          <p className="text-[10px] font-bold text-gray-400">Certificado</p>
          <p className="text-xs font-extrabold text-gray-900 mt-0.5 font-mono truncate">CERT-{lote.numero}</p>
        </div>
        <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5 flex flex-col justify-between">
          <p className="text-[10px] font-bold text-gray-400">Estado predial</p>
          <div className="mt-0.5">
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded text-center inline-block ${
              isPagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            }`}>
              {lote.estadoPredial}
            </span>
          </div>
        </div>
      </div>

      {/* Información General */}
      <div className="space-y-2">
        <h4 className="font-bold text-[11px] text-gray-400 uppercase tracking-wide">Información general</h4>
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-gray-500 font-semibold">
          <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Número de lote</span> <span className="text-gray-900">{lote.numero}</span></div>
          <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Fecha de registro</span> <span className="text-gray-900">15/03/2012</span></div>
          <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Folio interno</span> <span className="text-gray-900 font-mono">{lote.folio}</span></div>
          <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Estado</span> <span className="text-emerald-700 font-bold">Activo</span></div>
          <div className="flex justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><span className="text-gray-400">Superficie</span> <span className="text-gray-900">{lote.superficie}</span></div>
          <div className="flex justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><span className="text-gray-400">Último pago predial</span> <span className="text-gray-900">10/07/2026</span></div>
          <div className="flex justify-between border-b border-gray-50 sm:border-0 pb-1 sm:pb-0"><span className="text-gray-400">Uso actual</span> <span className="text-gray-900">Habitacional</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Observaciones</span> <span className="text-gray-400">—</span></div>
        </div>
      </div>

      {/* Propietarios */}
      <div className="space-y-2">
        <h4 className="font-bold text-[11px] text-gray-400 uppercase tracking-wide">Propietario(s) del lote</h4>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[11px] border-collapse min-w-[520px]">
            <thead>
              <tr className="text-gray-400 font-semibold border-b border-gray-100">
                <th className="pb-1.5">Propietario</th>
                <th className="pb-1.5">Certificado</th>
                <th className="pb-1.5">% Posesión</th>
                <th className="pb-1.5">Calidad agraria</th>
                <th className="pb-1.5">Acto jurídico</th>
                <th className="pb-1.5">Vigencia</th>
              </tr>
            </thead>
            <tbody className="font-bold text-gray-800 divide-y divide-gray-50">
              {lote.propietarios.map((name, idx) => {
                const names = name.split(' ');
                const initials = names.map(n => n[0]).join('').substring(0, 2).toUpperCase();
                const coposesion = Math.floor(100 / lote.propietarios.length);

                return (
                  <tr key={idx}>
                    <td className="py-2.5 flex items-center gap-2 whitespace-nowrap">
                      <div className="w-7 h-7 rounded-full bg-slate-100 border border-gray-200 overflow-hidden flex items-center justify-center font-bold text-[10px] text-gray-600 shrink-0">
                        {initials}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-gray-900">
                          {names.slice(0, 2).join(' ')}
                        </p>
                        {names.slice(2).length > 0 && (
                          <p className="text-[9px] font-medium text-gray-400 -mt-0.5">
                            {names.slice(2).join(' ')}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 font-mono text-gray-600 font-medium whitespace-nowrap">CERT-{lote.numero}</td>
                    <td className="py-2.5 text-gray-900">{idx === 0 && lote.propietarios.length > 1 ? coposesion + (100 % lote.propietarios.length) : coposesion}%</td>
                    <td className="py-2.5 font-medium text-gray-600">Ejidatario</td>
                    <td className="py-2.5 font-medium text-gray-600 whitespace-nowrap">Cesión de derechos</td>
                    <td className="py-2.5 text-gray-500 font-medium leading-tight whitespace-nowrap">
                      15/03/2012<br/><span className="text-[9px] text-gray-300">—</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagos */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <h4 className="font-bold text-[11px] text-gray-400 uppercase tracking-wide">Historial de pagos de predial</h4>
          <button className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md hover:bg-emerald-100 transition-colors w-full sm:w-auto text-center">
            Ver todos los pagos
          </button>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[11px] border-collapse min-w-[360px]">
            <thead>
              <tr className="text-gray-400 font-semibold border-b border-gray-100">
                <th className="pb-1.5">Año</th>
                <th className="pb-1.5">Fecha de pago</th>
                <th className="pb-1.5">Importe</th>
                <th className="pb-1.5">Estado</th>
                <th className="pb-1.5 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="font-semibold text-gray-700">
              <tr>
                <td className="py-2">2026</td>
                <td className="py-2 text-gray-500 font-normal">10/07/2026</td>
                <td className="py-2 font-bold text-gray-900">$750.00</td>
                <td className="py-2">
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                    isPagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                  }`}>
                    {lote.estadoPredial}
                  </span>
                </td>
                <td className="py-2 text-right">
                  <button className="text-emerald-700 text-[10px] font-bold inline-flex items-center gap-0.5 hover:underline">
                    VER <span>↗</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Banner Informativo y Botón de Descarga Inferior */}
      <div className="bg-blue-50/50 border border-blue-100/60 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex gap-2 text-xs text-blue-800">
          <span className="font-bold text-blue-500 mt-0.5 select-none">ℹ</span>
          <p className="text-[11px] font-medium leading-tight text-gray-600">
            Los lotes también están sujetos al pago de predial anual. Asegúrate de mantener tus pagos al corriente.
          </p>
        </div>
        <button className="shrink-0 flex items-center justify-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 text-[11px] font-bold text-gray-700 shadow-xs hover:bg-gray-50 transition-colors w-full sm:w-auto">
          <Download className="w-3.5 h-3.5 text-gray-500" /> Descargar certificado
        </button>
      </div>

    </div>
  );
};
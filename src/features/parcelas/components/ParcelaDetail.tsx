"use client";

import React from 'react';
import { MapPin } from 'lucide-react';
import { Parcela } from './ParcelasList';

interface DetailProps {
  parcela: Parcela;
}

export const ParcelaDetail: React.FC<DetailProps> = ({ parcela }) => {
  const esPagado2026 = parcela.estadoPredial === 'Pagado';
  
  // Fechas y estados calculados para el historial
  const registrosHistorial = [
    {
      anio: 2026,
      fecha: esPagado2026 ? "10/07/2026" : "—",
      // Si pagó en julio (después de marzo), se duplica a $40. Si no ha pagado, el adeudo es de $20 base
      importe: esPagado2026 ? "$40.00" : "$20.00",
      estado: parcela.estadoPredial, // Toma el estado dinámico (Pagado / Pagar)
      reciboDisponible: esPagado2026
    },
    {
      anio: 2025,
      fecha: "—",
      importe: "$20.00", // Adeudo de año anterior (tarifa base)
      estado: "Pagar" as const, // Forzado a "Pagar" (adeudo) según tu instrucción
      reciboDisponible: false
    },
    {
      anio: 2024,
      fecha: "18/02/2024", // Pagado a tiempo antes de marzo
      importe: "$20.00",
      estado: "Pagado" as const, // Forzado a "Pagado" según tu instrucción
      reciboDisponible: true
    }
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 space-y-4 w-full max-h-[720px] overflow-y-auto scrollbar-thin">
      
      {/* Fila Título de Sección */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 border-b border-gray-50 pb-3">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Parcela seleccionada</p>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="text-lg font-black text-gray-900">{parcela.numero}</h2>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
              esPagado2026 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            }`}>
              {parcela.estadoPredial}
            </span>
          </div>
        </div>
        <button className="flex items-center justify-center gap-1 w-full xs:w-auto px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> Ver en mapa
        </button>
      </div>

      {/* Grid Superior de KPI Cards Responsivo */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5 sm:p-3">
          <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 truncate">Superficie</p>
          <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5">{parcela.superficie}</p>
        </div>
        <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5 sm:p-3">
          <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 truncate">Titulares</p>
          <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5">{parcela.titularesCount}</p>
        </div>
        <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5 sm:p-3">
          <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 truncate">Certificados</p>
          <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5">2</p>
        </div>
        <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5 sm:p-3">
          <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 truncate">Folio interno</p>
          <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5 truncate">{parcela.numero}</p>
        </div>
      </div>

      {/* Información General */}
      <div className="space-y-2">
        <h4 className="font-bold text-[11px] text-gray-400 uppercase tracking-wide">Información general</h4>
        <div className="bg-white border border-gray-100 rounded-xl p-3 text-[11px] grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-1.5 text-gray-500 font-semibold">
          <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Número</span> <span className="text-gray-900">{parcela.numero}</span></div>
          <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Registro</span> <span className="text-gray-900">15/03/2010</span></div>
          <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Superficie</span> <span className="text-gray-900">2.50 ha</span></div>
          <div className="flex justify-between border-b border-gray-50 pb-1"><span className="text-gray-400">Obs.</span> <span className="text-gray-900">—</span></div>
          <div className="flex justify-between border-b border-gray-50 xs:border-0 pb-1 xs:pb-0">
            <span className="text-gray-400">Predial</span> 
            <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
              esPagado2026 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            }`}>
              {parcela.estadoPredial}
            </span>
          </div>
          <div className="flex justify-between"><span className="text-gray-400">Último pago</span> <span className="text-gray-900">{esPagado2026 ? "10/07/2026" : "—"}</span></div>
        </div>
      </div>

      {/* Titulares de la Parcela */}
      <div className="space-y-2">
        <h4 className="font-bold text-[11px] text-gray-400 uppercase tracking-wide">Titulares de la parcela</h4>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[11px] border-collapse min-w-[440px]">
            <thead>
              <tr className="text-gray-400 font-bold border-b border-gray-100">
                <th className="pb-1.5 font-semibold">Titular</th>
                <th className="pb-1.5 font-semibold">Certificado</th>
                <th className="pb-1.5 font-semibold">% Posesión</th>
                <th className="pb-1.5 font-semibold">Calidad agraria</th>
                <th className="pb-1.5 font-semibold">Acto jurídico</th>
                <th className="pb-1.5 font-semibold">Vigencia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-bold text-gray-800">
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 flex items-center gap-2 whitespace-nowrap">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100" className="w-6 h-6 rounded-full object-cover border border-gray-100 shadow-xs" alt="" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">José Antonio</p>
                    <p className="text-[9px] font-medium text-gray-400 -mt-0.5">Hernández López</p>
                  </div>
                </td>
                <td className="py-2 font-mono font-medium text-gray-500 whitespace-nowrap">CERT-1587</td>
                <td className="py-2 font-black text-gray-900 text-center xs:text-left">60%</td>
                <td className="py-2 font-medium text-gray-600 whitespace-nowrap">Ejidatario</td>
                <td className="py-2 font-medium text-gray-600 whitespace-nowrap">Cesión de derechos</td>
                <td className="py-2 text-gray-400 font-normal leading-tight whitespace-nowrap">01/01/2015<br/><span className="text-[9px]">—</span></td>
              </tr>
              <tr className="hover:bg-gray-50/50">
                <td className="py-2 flex items-center gap-2 whitespace-nowrap">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100" className="w-6 h-6 rounded-full object-cover border border-gray-100 shadow-xs" alt="" />
                  <div>
                    <p className="text-[11px] font-bold text-gray-900">María Guadalupe</p>
                    <p className="text-[9px] font-medium text-gray-400 -mt-0.5">Pérez Martínez</p>
                  </div>
                </td>
                <td className="py-2 font-mono font-medium text-gray-500 whitespace-nowrap">CERT-2458</td>
                <td className="py-2 font-black text-gray-900 text-center xs:text-left">40%</td>
                <td className="py-2 font-medium text-gray-600 whitespace-nowrap">Ejidataria</td>
                <td className="py-2 font-medium text-gray-600 whitespace-nowrap">Cesión de derechos</td>
                <td className="py-2 text-gray-400 font-normal leading-tight whitespace-nowrap">01/01/2015<br/><span className="text-[9px]">—</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de Pagos de Predial */}
      <div className="space-y-2">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5">
          <h4 className="font-bold text-[11px] text-gray-400 uppercase tracking-wide">Historial de pagos de predial</h4>
          <button className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded hover:bg-emerald-100 transition-colors w-full xs:w-auto text-center">
            Ver todos los pagos
          </button>
        </div>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-[11px] border-collapse min-w-[380px]">
            <thead>
              <tr className="text-gray-400 font-semibold border-b border-gray-100">
                <th className="pb-1.5">Año</th>
                <th className="pb-1.5">Fecha de pago</th>
                <th className="pb-1.5">Importe / Adeudo</th>
                <th className="pb-1.5">Estado</th>
                <th className="pb-1.5 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="font-semibold text-gray-700">
              {registrosHistorial.map((registro) => {
                const esRegistroPagado = registro.estado === 'Pagado';
                return (
                  <tr key={registro.anio} className="hover:bg-gray-50/40">
                    <td className="py-2 font-bold text-gray-900">{registro.anio}</td>
                    <td className="py-2 text-gray-500 font-normal whitespace-nowrap">{registro.fecha}</td>
                    <td className={`py-2 font-bold ${esRegistroPagado ? 'text-gray-900' : 'text-red-600'}`}>
                      {registro.importe}
                    </td>
                    <td className="py-2">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        esRegistroPagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                      }`}>
                        {registro.estado}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      {registro.reciboDisponible ? (
                        <button className="text-emerald-700 hover:underline text-[10px] font-bold flex items-center justify-end gap-0.5 ml-auto whitespace-nowrap">
                          VER <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </button>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-normal select-none">No disponible</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
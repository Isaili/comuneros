"use client";

import React, { useState } from 'react';
import { MapPin, History, Info, ArrowRight } from 'lucide-react';
import { Parcela } from '../types/domain.types';

interface DetailProps {
  parcela: Parcela;
}

export const ParcelaDetail: React.FC<DetailProps> = ({ parcela }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'historial'>('info');
  const esPagado = parcela.estadoPredial === 'Pagado';

  const historialPropietarios = parcela.historialPropietarios ?? [];
  const registrosHistorialPredial = parcela.historialPrediales ?? [];

  const avataresPredefinidos = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100",
  ];

  const listaPropietarios = parcela.propietarios ?? [];
  const titularesDetalle = parcela.titularesDetalle;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 space-y-4 w-full max-h-[720px] overflow-y-auto scrollbar-thin">

      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 border-b border-gray-50 pb-3">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Parcela seleccionada</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <h2 className="text-lg font-black text-gray-900">{parcela.numero}</h2>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${esPagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
              {parcela.estadoPredial}
            </span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${parcela.activo ? 'bg-slate-100 text-slate-600' : 'bg-gray-200 text-gray-500'}`}>
              {parcela.activo ? 'Registro activo' : 'Registro inactivo'}
            </span>
          </div>
          {parcela.parentPlotNombre && (
            <p className="text-[10px] text-gray-400 mt-1">
              Subdivisión de: <span className="font-bold text-gray-600">{parcela.parentPlotNombre}</span>
            </p>
          )}
        </div>
        <button className="flex items-center justify-center gap-1 w-full xs:w-auto px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" /> Ver en mapa
        </button>
      </div>

      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeTab === 'info' ? 'border-[#006837] text-[#006837]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <Info className="w-3.5 h-3.5" /> Información General
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all ${activeTab === 'historial' ? 'border-[#006837] text-[#006837]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          <History className="w-3.5 h-3.5" /> Historial Registral
        </button>
      </div>

      {activeTab === 'info' ? (
        <>
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
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 truncate">Folio (Nº parcela)</p>
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5 truncate">{parcela.folioInterno}</p>
            </div>
            <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5 sm:p-3">
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 truncate">ID de sistema</p>
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5 truncate font-mono">{parcela.id}</p>
            </div>
          </div>

          {parcela.observaciones && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] text-gray-600">
              <p className="font-bold text-gray-400 uppercase text-[10px] mb-1">Observaciones</p>
              {parcela.observaciones}
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-bold text-[11px] text-gray-400 uppercase tracking-wide">
              Titulares Activos ({listaPropietarios.length})
            </h4>
            {listaPropietarios.length > 0 ? (
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-[11px] border-collapse min-w-[440px]">
                  <thead>
                    <tr className="text-gray-400 font-bold border-b border-gray-100">
                      <th className="pb-1.5 font-semibold">Titular</th>
                      <th className="pb-1.5 font-semibold">Certificado</th>
                      <th className="pb-1.5 font-semibold">Hectáreas</th>
                      <th className="pb-1.5 font-semibold">Calidad agraria</th>
                      <th className="pb-1.5 font-semibold">Acto jurídico</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-bold text-gray-800">
                    {listaPropietarios.map((propietario, index) => {
                      const detalle = titularesDetalle?.[index];
                      const hectareas = detalle?.hectareasPosesion ?? (parcela.superficieHa / listaPropietarios.length);
                      const certificado = detalle?.certificado ?? '—';
                      const calidad = detalle?.calidadAgraria ?? 'Comunero';
                      const acto = detalle?.actoJuridico ?? 'Cesión de derechos';
                      const [primerNombre, ...resto] = propietario.split(' ');

                      return (
                        <tr key={index} className="hover:bg-gray-50/50">
                          <td className="py-2 flex items-center gap-2 whitespace-nowrap">
                            <img src={avataresPredefinidos[index % avataresPredefinidos.length]} className="w-6 h-6 rounded-full object-cover border border-gray-100 shadow-xs" alt={propietario} />
                            <div>
                              <p className="text-[11px] font-bold text-gray-900">{primerNombre}</p>
                              <p className="text-[9px] font-medium text-gray-400 -mt-0.5 truncate max-w-[120px]">{resto.join(' ')}</p>
                            </div>
                          </td>
                          <td className="py-2 font-mono font-medium text-gray-500 whitespace-nowrap">{certificado}</td>
                          <td className="py-2 font-black text-gray-900 whitespace-nowrap">{hectareas.toFixed(2)} ha</td>
                          <td className="py-2 font-medium text-gray-600 whitespace-nowrap">{calidad}</td>
                          <td className="py-2 font-medium text-gray-600 whitespace-nowrap">{acto}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-[11px] text-gray-400 bg-slate-50 border border-slate-100 rounded-xl p-3">
                Esta parcela aún no tiene titular asignado.
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[11px] text-gray-400 uppercase tracking-wide">Historial de pagos de predial</h4>
            {registrosHistorialPredial.length > 0 ? (
              <div className="overflow-x-auto scrollbar-thin">
                <table className="w-full text-left text-[11px] border-collapse min-w-[380px]">
                  <thead>
                    <tr className="text-gray-400 font-semibold border-b border-gray-100">
                      <th className="pb-1.5">Año</th>
                      <th className="pb-1.5">Importe / Adeudo</th>
                      <th className="pb-1.5">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="font-semibold text-gray-700">
                    {registrosHistorialPredial.map((registro) => {
                      const pagado = registro.estado === 'Pagado';
                      return (
                        <tr key={registro.anio} className="hover:bg-gray-50/40">
                          <td className="py-2 font-bold text-gray-900">{registro.anio}</td>
                          <td className={`py-2 font-bold ${pagado ? 'text-gray-900' : 'text-red-600'}`}>${registro.monto.toFixed(2)}</td>
                          <td className="py-2">
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${pagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                              {registro.estado}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-[11px] text-gray-400 bg-slate-50 border border-slate-100 rounded-xl p-3">
                Sin historial predial registrado.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-4 py-2">
          <div className="bg-amber-50/60 border border-amber-100 text-amber-800 rounded-xl p-3 text-[11px] flex gap-2">
            <p>Este módulo registra el tracto sucesivo agrario, según actas de asamblea.</p>
          </div>

          {historialPropietarios.length > 0 ? (
            <div className="relative pl-6 border-l-2 border-slate-100 space-y-6 ml-3">
              {historialPropietarios.map((historico, idx) => {
                const esActual = historico.esActual ?? idx === 0;
                return (
                  <div key={`${historico.nombre}-${idx}`} className="relative">
                  <div className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full border-2 bg-white ${esActual ? 'border-[#006837] ring-4 ring-[#006837]/10' : 'border-slate-300'}`}>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${esActual ? 'bg-[#006837]' : 'bg-slate-300'}`} />
                  </div>
                    <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${esActual ? 'bg-[#006837]/10 text-[#006837]' : 'bg-slate-200 text-slate-600'}`}>
                            {esActual ? 'Propietario Legítimo Activo' : 'Dueño Anterior'}
                          </span>
                          <h5 className="text-xs font-black text-slate-800 mt-1">{historico.nombre}</h5>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{historico.certificado}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-500 font-semibold border-t border-slate-100/60 pt-2">
                        <div>
                          <p className="text-[9px] text-slate-400">Periodo de Posesión</p>
                          <p className="text-slate-700">{historico.fechaAdquisicion} a {historico.fechaCesion}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400">Acto de Adquisición</p>
                          <p className="text-slate-700">{historico.actoJuridico}</p>
                        </div>
                      </div>
                      {!esActual && (
                        <div className="flex items-center gap-1.5 text-slate-500 text-[10px] bg-white px-2 py-1 border border-slate-100 rounded-lg mt-1 w-fit">
                          <span className="font-bold">Traspasado a:</span>
                          <span className="text-slate-700 font-black">{historico.adquirente}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-[11px] text-gray-400 bg-slate-50 border border-slate-100 rounded-xl p-3">
              Sin historial registral previo.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
"use client";

import React, { useState } from 'react';
import { MapPin, History, Info, ArrowRight } from 'lucide-react';


import { Parcela } from '../types/types';

interface DetailProps {
  parcela: Parcela;
}

export const ParcelaDetail: React.FC<DetailProps> = ({ parcela }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'historial'>('info');
  const esPagado2026 = parcela.estadoPredial === 'Pagado';
  
  // Datos simulados en caso de que la parcela no tenga historial en su estado interno
  const historialPropietarios = parcela.historialPropietarios ?? [
    {
      nombre: "José Antonio Hernández López",
      certificado: "CERT-1587",
      fechaAdquisicion: "12/04/2015",
      fechaCesion: "— (Actual)",
      actoJuridico: "Sucesión Hereditaria",
      adquirente: "Titular Activo"
    },
    {
      nombre: "Felipe Hernández Díaz",
      certificado: "CERT-0941",
      fechaAdquisicion: "10/05/1998",
      fechaCesion: "12/04/2015",
      actoJuridico: "Fallecimiento / Sucesión",
      adquirente: "José Antonio Hernández López"
    }
  ];

  const registrosHistorialPredial = [
    { anio: 2026, fecha: esPagado2026 ? "10/07/2026" : "—", importe: esPagado2026 ? "$40.00" : "$20.00", estado: parcela.estadoPredial, reciboDisponible: esPagado2026 },
    { anio: 2025, fecha: "—", importe: "$20.00", estado: "Pagar" as const, reciboDisponible: false },
    { anio: 2024, fecha: "18/02/2024", importe: "$20.00", estado: "Pagado" as const, reciboDisponible: true }
  ];

  const avataresPredefinidos = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100"
  ];

  // Garantizar que siempre tengamos un arreglo base sobre el cual trabajar
  const listaPropietarios = Array.isArray(parcela.propietarios) ? parcela.propietarios : [];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 space-y-4 w-full max-h-[720px] overflow-y-auto scrollbar-thin">
      
      {/* 1. Cabecera */}
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

      {/* 2. Selector de Pestañas */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'info' 
              ? 'border-[#006837] text-[#006837]' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          Información General
        </button>
        <button
          onClick={() => setActiveTab('historial')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'historial' 
              ? 'border-[#006837] text-[#006837]' 
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Historial Registral (Dueños)
        </button>
      </div>

      {/* 3. Contenidos por Pestaña */}
      {activeTab === 'info' ? (
        <>
          {/* Grid de KPI Cards */}
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
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5">{parcela.titularesCount}</p>
            </div>
            <div className="border border-gray-100 bg-gray-50/40 rounded-xl p-2.5 sm:p-3">
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 truncate">Folio interno</p>
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 mt-0.5 truncate">{parcela.numero}</p>
            </div>
          </div>

          {/* Tabla de Titulares Activos actuales */}
          <div className="space-y-2">
            <h4 className="font-bold text-[11px] text-gray-400 uppercase tracking-wide font-black">
              Titulares Activos ({listaPropietarios.length})
            </h4>
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
                  {listaPropietarios.map((propietario, index) => {
                    //  CONTROL ANTICAÍDAS: Si no es una cadena válida, provee un fallback
                    const nombreSanitario = typeof propietario === 'string' ? propietario : 'Titular Desconocido';
                    
                    const porcentajeCalculado = Math.floor(100 / listaPropietarios.length);
                    const esUltimo = index === listaPropietarios.length - 1;
                    const porcentajeFinal = esUltimo 
                      ? 100 - (porcentajeCalculado * (listaPropietarios.length - 1)) 
                      : porcentajeCalculado;

                    const palabrasNombre = nombreSanitario.split(' ');
                    const primerNombre = palabrasNombre[0] || '—';
                    const apellidos = palabrasNombre.slice(1).join(' ') || '—';

                    return (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="py-2 flex items-center gap-2 whitespace-nowrap">
                          <img 
                            src={avataresPredefinidos[index % avataresPredefinidos.length]} 
                            className="w-6 h-6 rounded-full object-cover border border-gray-100 shadow-xs" 
                            alt={nombreSanitario} 
                          />
                          <div>
                            <p className="text-[11px] font-bold text-gray-900">{primerNombre}</p>
                            <p className="text-[9px] font-medium text-gray-400 -mt-0.5 truncate max-w-[120px]">{apellidos}</p>
                          </div>
                        </td>
                        <td className="py-2 font-mono font-medium text-gray-500 whitespace-nowrap">CERT-{1580 + index * 137}</td>
                        <td className="py-2 font-black text-gray-900">{porcentajeFinal}%</td>
                        <td className="py-2 font-medium text-gray-600 whitespace-nowrap">Ejidatario(a)</td>
                        <td className="py-2 font-medium text-gray-600 whitespace-nowrap">Cesión de derechos</td>
                        <td className="py-2 text-gray-400 font-normal leading-tight whitespace-nowrap">01/01/2015<br/><span className="text-[9px]">—</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historial de Pagos de Predial */}
          <div className="space-y-2">
            <h4 className="font-bold text-[11px] text-gray-400 uppercase tracking-wide font-black">Historial de pagos de predial</h4>
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
                  {registrosHistorialPredial.map((registro) => {
                    const esRegistroPagado = registro.estado === 'Pagado';
                    return (
                      <tr key={registro.anio} className="hover:bg-gray-50/40">
                        <td className="py-2 font-bold text-gray-900">{registro.anio}</td>
                        <td className="py-2 text-gray-500 font-normal">{registro.fecha}</td>
                        <td className={`py-2 font-bold ${esRegistroPagado ? 'text-gray-900' : 'text-red-600'}`}>{registro.importe}</td>
                        <td className="py-2">
                          <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${esRegistroPagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                            {registro.estado}
                          </span>
                        </td>
                        <td className="py-2 text-right">
                          {registro.reciboDisponible ? (
                            <button className="text-[#006837] hover:underline text-[10px] font-bold flex items-center justify-end gap-0.5 ml-auto">VER</button>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-normal">No disponible</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* 📜 VISTA DE HISTORIAL REGISTRAL (TRACTO SUCESIVO) */
        <div className="space-y-4 py-2">
          <div className="bg-amber-50/60 border border-amber-100 text-amber-800 rounded-xl p-3 text-[11px] flex gap-2">
            <span className="text-base">📜</span>
            <p>
              Este módulo registra el tracto sucesivo agrario. Los cambios aquí reflejados han sido aprobados por actas de asamblea y/o asambleas de delimitación del ejido.
            </p>
          </div>

          <div className="relative pl-6 border-l-2 border-slate-100 space-y-6 ml-3">
            {historialPropietarios.map((historico, idx) => {
              const esActual = idx === 0;
              return (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                    esActual ? 'border-[#006837] ring-4 ring-[#006837]/10' : 'border-slate-300'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${esActual ? 'bg-[#006837]' : 'bg-slate-300'}`} />
                  </div>

                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                          esActual ? 'bg-[#006837]/10 text-[#006837]' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {esActual ? 'Propietario Legítimo Activo' : 'Dueño Anterior (Histórico)'}
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
        </div>
      )}

    </div>
  );
};
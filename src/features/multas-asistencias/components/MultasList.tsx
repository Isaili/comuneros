"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, UserX, FileWarning, Pencil, Trash2 } from 'lucide-react';
import { Multa } from '../types/types';

interface ListProps {
  multas: Multa[];
  selectedId: string;
  onSelect: (multa: Multa) => void;
  onEditarClick: (multa: Multa) => void;
  onEliminarClick: (multa: Multa) => void;
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export const MultasList: React.FC<ListProps> = ({ multas, selectedId, onSelect, onEditarClick, onEliminarClick }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between min-h-[600px] w-full">
      <div>
        {/* Encabezado descriptivo */}
        <h3 className="font-bold text-gray-900 mb-4 text-base">
          Multas registradas ({multas.length})
        </h3>

        {/* ================= VISTA MOBILE / TABLET (Tarjetas) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {multas.map((m) => {
            const isSelected = selectedId === m.id;
            return (
              <div 
                key={m.id} 
                onClick={() => onSelect(m)}
                className={`border rounded-xl p-4 flex flex-col justify-between space-y-4 transition-all cursor-pointer ${
                  isSelected ? 'bg-[#006837]/5 border-[#006837]/20 shadow-xs' : 'bg-slate-50/50 border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="space-y-3">
                  {/* Fila superior: Comunero e Info Principal */}
                  <div className="flex items-start gap-2.5">
                    <img
                      src={m.comuneroFotografia}
                      alt={m.comuneroNombre}
                      className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={`font-bold text-sm truncate ${isSelected ? 'text-[#006837]' : 'text-gray-900'}`}>
                        {m.comuneroNombre}
                      </p>
                      <p className="text-xs text-gray-400 font-mono font-semibold">{m.folio}</p>
                    </div>
                  </div>

                  {/* Detalles del Registro */}
                  <div className="text-xs text-gray-500 space-y-1.5 pt-1 border-t border-gray-100/60">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tipo:</span>
                      {m.tipo === 'inasistencia' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          <UserX className="w-3 h-3" /> Inasistencia
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <FileWarning className="w-3 h-3" /> Otro
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fecha:</span>
                      <span className="font-semibold text-gray-700">{new Date(m.fechaGeneracion).toLocaleDateString('es-MX')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Monto:</span>
                      <span className="font-bold text-gray-900 text-sm">{formatoMoneda(m.cantidad)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Estado:</span>
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        m.estado === 'pagada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {m.estado === 'pagada' ? 'Pagada' : 'Pendiente'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones de la Tarjeta */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100/60" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => onEditarClick(m)}
                    className="flex-1 py-2 border border-gray-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button 
                    onClick={() => onEliminarClick(m)}
                    className="flex-1 py-2 border border-gray-100 rounded-lg hover:border-red-200 hover:bg-red-50 text-red-500 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Eliminar
                  </button>
                </div>
              </div>
            );
          })}
          {multas.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-400 text-xs font-medium">
              No se encontraron multas registradas.
            </div>
          )}
        </div>

        {/* ================= VISTA DESKTOP (Tabla) ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-2">Comunero</th>
                <th className="py-3 px-2">Tipo</th>
                <th className="py-3 px-2">Fecha</th>
                <th className="py-3 px-2">Cantidad</th>
                <th className="py-3 px-2">Estado</th>
                <th className="py-3 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {multas.map((m) => {
                const isSelected = selectedId === m.id;
                return (
                  <tr
                    key={m.id}
                    onClick={() => onSelect(m)}
                    className={`cursor-pointer transition-colors group ${
                      isSelected ? 'bg-[#006837]/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Comunero Perfil */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={m.comuneroFotografia}
                          alt={m.comuneroNombre}
                          className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className={`font-bold text-sm truncate ${isSelected ? 'text-[#006837]' : 'text-gray-900'}`}>
                            {m.comuneroNombre}
                          </p>
                          <p className="text-xs text-gray-400 font-mono font-semibold">{m.folio}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tipo de Multa */}
                    <td className="py-3 px-2 whitespace-nowrap">
                      {m.tipo === 'inasistencia' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          <UserX className="w-3 h-3" />
                          Inasistencia
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <FileWarning className="w-3 h-3" />
                          Otro
                        </span>
                      )}
                    </td>

                    {/* Fecha */}
                    <td className="py-3 px-2 text-gray-600 font-medium whitespace-nowrap">
                      {new Date(m.fechaGeneracion).toLocaleDateString('es-MX')}
                    </td>

                    {/* Cantidad */}
                    <td className="py-3 px-2 font-bold text-gray-900 whitespace-nowrap">
                      {formatoMoneda(m.cantidad)}
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                        m.estado === 'pagada' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                      }`}>
                        {m.estado === 'pagada' ? 'Pagada' : 'Pendiente'}
                      </span>
                    </td>

                    {/* Acciones Directas */}
                    <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => onEditarClick(m)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600 transition-all"
                          title="Editar multa"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => onEliminarClick(m)}
                          className="p-2 border border-gray-100 rounded-lg hover:border-red-200 hover:bg-red-50 text-red-500 transition-all"
                          title="Eliminar multa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación Unificada */}
      <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-50 text-xs font-bold text-gray-600 mt-4">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-lg bg-[#006837] text-white flex items-center justify-center">1</button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">2</button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">3</button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">4</button>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
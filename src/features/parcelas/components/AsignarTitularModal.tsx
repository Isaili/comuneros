"use client";

import React, { useState } from 'react';
import { UserPlus, X, Search, Check } from 'lucide-react';
import { Comunero } from '../../comuneros/types/types';

interface AsignarTitularModalProps {
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onAsignar: (comuneroId: string, nombreCompleto: string) => void;
}

export const AsignarTitularModal: React.FC<AsignarTitularModalProps> = ({
  comunerosRegistrados,
  onClose,
  onAsignar,
}) => {
  const [comuneroSeleccionadoId, setComuneroSeleccionadoId] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');


  const obtenerNombreCompleto = (c: Comunero) => {
    return [c.nombre, c.apellidoPaterno, c.apellidoMaterno].filter(Boolean).join(' ');
  };

  const comunerosFiltrados = comunerosRegistrados.filter((c) => {
    const term = busqueda.toLowerCase();
    const nombreCompleto = obtenerNombreCompleto(c).toLowerCase();
    const vecindario = (c.vecindario || '').toLowerCase();
    return nombreCompleto.includes(term) || vecindario.includes(term);
  });

  const handleSeleccionarComunero = (valorId: string) => {
    setComuneroSeleccionadoId(valorId);

    const comuneroObj = comunerosRegistrados.find((c) => c.id === valorId);

  
    const nombreCompleto = comuneroObj
      ? `${comuneroObj.nombre} ${comuneroObj.apellidoPaterno || ''} ${comuneroObj.apellidoMaterno || ''}`.trim()
      : '';

    if (comuneroObj) {
      onAsignar(comuneroObj.id, nombreCompleto);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comuneroSeleccionadoId) {
      alert('Por favor seleccione un titular.');
      return;
    }
    const comuneroObj = comunerosRegistrados.find((c) => c.id === comuneroSeleccionadoId);
    if (comuneroObj) {
      const nombreCompleto = obtenerNombreCompleto(comuneroObj);
      onAsignar(comuneroObj.id, nombreCompleto);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10 flex flex-col">
        {/* Header */}
        <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-700 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-gray-900">Asignar Titular de Parcela</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-gray-700">
          <div className="space-y-1">
            <label className="text-gray-500 font-bold block">Buscar Comunero / Avecindado</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o barrio..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-gray-800 outline-none focus:border-emerald-500 text-xs"
              />
            </div>
          </div>

          <div className="max-h-52 overflow-y-auto space-y-1 pr-1 border border-gray-100 rounded-xl p-2 bg-slate-50/50">
            {comunerosFiltrados.length > 0 ? (
              comunerosFiltrados.map((c) => {
                const nombreCompleto = obtenerNombreCompleto(c);
                const isSelected = comuneroSeleccionadoId === c.id;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSeleccionarComunero(c.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-white border-gray-100 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-xs">{nombreCompleto}</p>
                      <p className="text-[10px] text-gray-400 font-normal">
                        {c.tipo.toUpperCase()} • {c.vecindario}
                      </p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })
            ) : (
              <p className="text-center text-gray-400 text-[11px] py-4">
                No se encontraron resultados
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!comuneroSeleccionadoId}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-xs font-bold transition-colors"
            >
              Confirmar Asignación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignarTitularModal;
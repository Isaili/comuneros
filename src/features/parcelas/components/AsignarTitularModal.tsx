"use client";

import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Comunero } from '../../comuneros/types/types';
import { ComuneroPicker } from './shared/ComuneroPicker';

interface AsignarTitularModalProps {
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onAsignar: (comuneroId: string, nombreCompleto: string) => void;
}

// NOTA: el tipo Comunero ha tenido dos formas distintas en el código
// (una con `apellidos`, otra con `apellidoPaterno`/`apellidoMaterno`).
// Este helper soporta ambas mientras se unifica el tipo real en
// `features/comuneros/types/types.ts`.
const nombreCompletoDe = (c: Comunero) => {
  const anyC = c as any;
  const apellidos = anyC.apellidos ?? [anyC.apellidoPaterno, anyC.apellidoMaterno].filter(Boolean).join(' ');
  return [c.nombre, apellidos].filter(Boolean).join(' ').trim();
};

export const AsignarTitularModal: React.FC<AsignarTitularModalProps> = ({
  comunerosRegistrados,
  onClose,
  onAsignar,
}) => {
  const [seleccionadoId, setSeleccionadoId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const comunero = comunerosRegistrados.find(c => c.id === seleccionadoId);
    if (!comunero) {
      alert('Por favor seleccione un titular.');
      return;
    }
    onAsignar(comunero.id, nombreCompletoDe(comunero));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-visible z-10 flex flex-col">
        <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-700 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-gray-900">Asignar Titular de Parcela</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-gray-700">
          <div className="space-y-1">
            <label className="text-gray-500 font-bold block">Buscar Comunero / Avecindado</label>
            <ComuneroPicker
              items={comunerosRegistrados}
              selectedId={seleccionadoId}
              onSelect={(c) => setSeleccionadoId(c.id)}
              getId={(c) => c.id}
              getLabel={nombreCompletoDe}
              getSubtitle={(c) => `${c.tipo.toUpperCase()}${(c as any).vecindario ? ` • ${(c as any).vecindario}` : ''}`}
              placeholder="Buscar por nombre o barrio..."
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!seleccionadoId}
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
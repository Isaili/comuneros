"use client";
import React from 'react';
import { Pencil, MapPin } from 'lucide-react';
import { Neighborhood } from '../types/types';

interface Props {
  barrios: Neighborhood[];
  onEditar: (barrio: Neighborhood) => void;
}

export const BarriosList: React.FC<Props> = ({ barrios, onEditar }) => {
  if (barrios.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <MapPin className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-gray-500 font-semibold text-sm">Sin barrios registrados</p>
        <p className="text-gray-400 text-xs mt-1">Los barrios que agregues aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6">
      <h3 className="font-bold text-gray-900 mb-4 text-base">
        Lista de barrios <span className="text-gray-400 font-medium">({barrios.length})</span>
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="py-3 px-2">Nombre del barrio</th>
              <th className="py-3 px-2 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {barrios.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-2 font-bold text-gray-900">{b.name}</td>
                <td className="py-3 px-2 text-right">
                  <button
                    type="button"
                    onClick={() => onEditar(b)}
                    aria-label={`Editar ${b.name}`}
                    className="p-2 border border-gray-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
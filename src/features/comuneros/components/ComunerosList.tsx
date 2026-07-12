import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Comunero } from '@/features/comuneros/types/types';

interface ListProps {
  comuneros: Comunero[];
  selectedId: string;
  onSelect: (comunero: Comunero) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ComunerosList: React.FC<ListProps> = ({ comuneros, selectedId, onSelect, onEdit, onDelete }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 flex flex-col justify-between min-h-[600px]">
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-base">
          Lista de comuneros ({comuneros.length})
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="py-3 px-2">Nombre</th>
                <th className="py-3 px-2">Fecha de nacimiento</th>
                <th className="py-3 px-2">Estado civil</th>
                <th className="py-3 px-2">Colonia</th>
                <th className="py-3 px-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {comuneros.map((c) => (
                <tr 
                  key={c.id} 
                  onClick={() => onSelect(c)}
                  className={`cursor-pointer transition-colors group ${
                    selectedId === c.id ? 'bg-[#006837]/5' : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-2 flex items-center gap-3">
                    <img src={c.fotografia} alt={c.nombre} className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm" />
                    <div>
                      <p className={`font-bold leading-tight ${selectedId === c.id ? 'text-[#006837]' : 'text-gray-900'}`}>
                        {c.nombre}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">{c.apellidos}</p>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-600 font-medium">{c.fechaNacimiento}</td>
                  <td className="py-3 px-2 text-gray-600 font-medium">{c.estadoCivil}</td>
                  <td className="py-3 px-2 text-gray-600 font-medium">{c.colonia}</td>
                  <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => onEdit(c.id)} className="p-2 border border-gray-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600 transition-all">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onDelete(c.id)} className="p-2 border border-gray-100 rounded-lg hover:border-red-200 hover:bg-red-50 text-red-500 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-50 text-xs font-bold text-gray-600">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
        <button className="w-8 h-8 rounded-lg bg-[#006837] text-white flex items-center justify-center">1</button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">2</button>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">3</button>
        <span className="px-1 text-gray-400">...</span>
        <button className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center">13</button>
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
};
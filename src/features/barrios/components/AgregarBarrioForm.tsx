"use client";
import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import { Neighborhood } from '../types/types';

interface Props {
  onClose: () => void;
  onGuardar: (name: string, id?: string) => Promise<void>;
  barrioAEditar?: Neighborhood | null;
}

export const AgregarBarrioForm: React.FC<Props> = ({ onClose, onGuardar, barrioAEditar = null }) => {
  const esEdicion = !!barrioAEditar;
  const [name, setName] = useState(barrioAEditar?.name ?? '');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { setName(barrioAEditar?.name ?? ''); }, [barrioAEditar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) {
      setError('El nombre del barrio debe tener al menos 3 caracteres.');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      await onGuardar(name.trim(), barrioAEditar?.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error al guardar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-up"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
            <span className="p-1.5 bg-[#006837]/10 text-[#006837] rounded-lg">
              <MapPin className="w-4 h-4" />
            </span>
            {esEdicion ? 'Editar Barrio' : 'Registrar Nuevo Barrio'}
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-1.5 text-gray-700 font-semibold text-xs">
          <label className="text-gray-500 font-bold block">Nombre del barrio <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Barrio de Santa Ana"
            className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#006837]/30 transition-all ${error ? 'border-red-500' : 'border-gray-200'}`}
          />
          {error && <p className="text-red-500 text-[10px] font-bold mt-1">{error}</p>}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col-reverse sm:flex-row items-center gap-2 shrink-0">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting} className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed">
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Guardando...' : esEdicion ? 'Actualizar' : 'Guardar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
};
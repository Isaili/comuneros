"use client";

import React, { useRef } from 'react';
import { User, Save, X, Loader2 } from 'lucide-react';
import { Comunero, CrearComuneroPayload } from '../../types/types';
import { useComuneroForm } from './useComuneroForm';
import { FotoPerfilCapture, FotoPerfilCaptureHandle } from './FotoPerfilCapture';
import { DatosPersonalesSection } from './ DatosPersonalesSection';
import { DatosContactoSection } from './DatosContactoSection';
import { TipoYEstadoSection } from './TipoYEstadoSection';

interface AgregarComuneroFormProps {
  onClose: () => void;
  onGuardar: (payload: CrearComuneroPayload, fotoFile?: File | Blob | null, eliminarFoto?: boolean) => void;
  comuneroAEditar?: Comunero | any;
}

export const AgregarComuneroForm: React.FC<AgregarComuneroFormProps> = ({
  onClose,
  onGuardar,
  comuneroAEditar = null,
}) => {
  const {
    esEdicion,
    formData,
    errors,
    isSubmitting,
    barrios,
    loadingBarrios,
    fotografia,
    handleChange,
    handlePhotoCaptured,
    handlePhotoRemoved,
    handleSubmit,
  } = useComuneroForm({ comuneroAEditar, onGuardar });

  const fotoRef = useRef<FotoPerfilCaptureHandle>(null);

  const handleClose = () => {
    fotoRef.current?.stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-scale-up"
      >
        {isSubmitting && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-white/90 backdrop-blur-sm animate-fade-in">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#006837]/10" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#006837] border-r-[#006837] animate-spin" />
              <Save className="w-6 h-6 text-[#006837]" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-black text-gray-800">
                {esEdicion ? 'Actualizando registro' : 'Guardando registro'}
              </p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006837] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#006837] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#006837] animate-bounce" />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
            <span className="p-1.5 bg-[#006837]/10 text-[#006837] rounded-lg">
              <User className="w-4 h-4" />
            </span>
            {esEdicion ? 'Editar Expediente de Miembro' : 'Registrar Nuevo Miembro'}
          </h3>
          <button type="button" onClick={handleClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-gray-700 font-semibold text-xs">
          <FotoPerfilCapture
            ref={fotoRef}
            value={fotografia}
            required={!esEdicion}
            onCapture={handlePhotoCaptured}
            onRemove={handlePhotoRemoved}
          />

          <DatosPersonalesSection formData={formData} errors={errors} onChange={handleChange} />

          <DatosContactoSection
            formData={formData}
            errors={errors}
            onChange={handleChange}
            barrios={barrios}
            loadingBarrios={loadingBarrios}
          />

          <TipoYEstadoSection formData={formData} errors={errors} onChange={handleChange} />
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col-reverse sm:flex-row items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? 'Guardando...' : esEdicion ? 'Actualizar Cambios' : 'Guardar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
};
import React, { useState } from 'react';
import { RadioCardGroup } from './AgregarComuneroForm/Radiocardgroup';
import { TipoPersona, EstadoPersona } from '../types/types';

type Modo = 'tipo' | 'estado';

interface Props {
  modo: Modo;
  nombreCompleto: string;
  valorActual: string;
  onCancelar: () => void;
  onConfirmar: (valor: TipoPersona | EstadoPersona) => void | Promise<void>;
}

const OPCIONES_TIPO = [
  { value: 'comunero', label: 'Comunero', desc: 'Derechos de tierra' },
  { value: 'avecindado', label: 'Avecindado', desc: 'Residente con título' },
  { value: 'poblador', label: 'Poblador', desc: 'Residente sin título' },
];

const OPCIONES_ESTADO = [
  { value: 'activo', label: 'Activo', desc: 'En la comunidad' },
  { value: 'inactivo', label: 'Inactivo', desc: 'Sin participación' },
  { value: 'fallecido', label: 'Fallecido', desc: 'Requiere sucesión' },
];

const ACTIVE_CLASS_TIPO = { comunero: 'border-[#006837] bg-[#006837]/5 text-[#006837]' };
const ACTIVE_CLASS_ESTADO = {
  activo: 'border-[#006837] bg-[#006837]/5 text-[#006837]',
  inactivo: 'border-amber-500 bg-amber-50/40 text-amber-700',
  fallecido: 'border-gray-600 bg-gray-100/60 text-gray-700',
};

export const CambiarTipoEstadoModal: React.FC<Props> = ({
  modo,
  nombreCompleto,
  valorActual,
  onCancelar,
  onConfirmar,
}) => {
  const [valorSeleccionado, setValorSeleccionado] = useState(valorActual);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const esTipo = modo === 'tipo';
  const titulo = esTipo ? 'Cambiar tipo de persona' : 'Cambiar estatus';
  const opciones = esTipo ? OPCIONES_TIPO : OPCIONES_ESTADO;
  const activeClassNameByValue = esTipo ? ACTIVE_CLASS_TIPO : ACTIVE_CLASS_ESTADO;

  const handleConfirmar = async () => {
    if (valorSeleccionado === valorActual || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirmar(valorSeleccionado as TipoPersona | EstadoPersona);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onCancelar} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10 p-6 space-y-4 animate-slide-up">
        <div>
          <h3 className="text-base font-bold text-gray-900">{titulo}</h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">{nombreCompleto}</p>
        </div>

        <RadioCardGroup
          name="cambioValor"
          value={valorSeleccionado}
          onChange={(e) => setValorSeleccionado(e.target.value)}
          options={opciones}
          activeClassNameByValue={activeClassNameByValue}
        />

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onCancelar}
            disabled={isSubmitting}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={isSubmitting || valorSeleccionado === valorActual}
            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#006837] hover:bg-[#00552f] transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

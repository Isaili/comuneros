import React from 'react';
import { RadioCardGroup } from './Radiocardgroup';
import { ComuneroFormState } from './ comuneroForm.utils';

interface Props {
  formData: ComuneroFormState;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TipoYEstadoSection: React.FC<Props> = ({ formData, errors, onChange }) => (
  <>
    <div className="space-y-2">
      <label className="text-gray-500 font-bold block">
        Tipo de Miembro <span className="text-red-500">*</span>
      </label>
      <RadioCardGroup
        name="tipoComunero"
        value={formData.tipoComunero}
        onChange={onChange}
        options={[
          { value: 'comunero', label: 'Comunero', desc: 'Derechos de tierra' },
          { value: 'avecindado', label: 'Avecindado', desc: 'Residente con título' },
          { value: 'poblador', label: 'Poblador', desc: 'Residente sin título' },
        ]}
        activeClassNameByValue={{ comunero: 'border-[#006837] bg-[#006837]/5 text-[#006837]' }}
      />
      {errors.tipoComunero && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.tipoComunero}</p>}
    </div>

    <div className="space-y-2">
      <label className="text-gray-500 font-bold block">
        Estado <span className="text-red-500">*</span>
      </label>
      <RadioCardGroup
        name="estadoPersona"
        value={formData.estadoPersona}
        onChange={onChange}
        options={[
          { value: 'activo', label: 'Activo', desc: 'En la comunidad' },
          { value: 'inactivo', label: 'Inactivo', desc: 'Sin participación' },
          { value: 'fallecido', label: 'Fallecido', desc: 'Requiere sucesión' },
        ]}
        activeClassNameByValue={{
          activo: 'border-[#006837] bg-[#006837]/5 text-[#006837]',
          inactivo: 'border-amber-500 bg-amber-50/40 text-amber-700',
          fallecido: 'border-gray-600 bg-gray-100/60 text-gray-700',
        }}
      />
      {errors.estadoPersona && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.estadoPersona}</p>}
    </div>
  </>
);
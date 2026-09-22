import React from 'react';
import { FormField, inputClass, selectClass } from './Formfield';
import { ComuneroFormState } from './ comuneroForm.utils';

interface Props {
  formData: ComuneroFormState;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const DatosPersonalesSection: React.FC<Props> = ({ formData, errors, onChange }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label="Nombre(s)" required error={errors.nombre}>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={onChange}
          placeholder="Ej. Juan Carlos"
          className={inputClass(!!errors.nombre)}
        />
      </FormField>
      <FormField label="Estado Civil" required error={errors.estadoCivil}>
        <select name="estadoCivil" value={formData.estadoCivil} onChange={onChange} className={selectClass(!!errors.estadoCivil)}>
          <option value="">Selecciona...</option>
          <option value="soltero">Soltero(a)</option>
          <option value="casado">Casado(a)</option>
          <option value="viudo">Viudo(a)</option>
          <option value="divorciado">Divorciado(a)</option>
        </select>
      </FormField>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label="Apellido Paterno" required error={errors.apellidoPaterno}>
        <input
          type="text"
          name="apellidoPaterno"
          value={formData.apellidoPaterno}
          onChange={onChange}
          placeholder="Ej. Pérez"
          className={inputClass(!!errors.apellidoPaterno)}
        />
      </FormField>
      <FormField label="Apellido Materno" required error={errors.apellidoMaterno}>
        <input
          type="text"
          name="apellidoMaterno"
          value={formData.apellidoMaterno}
          onChange={onChange}
          placeholder="Ej. Gómez"
          className={inputClass(!!errors.apellidoMaterno)}
        />
      </FormField>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label="Fecha de Nacimiento" required error={errors.fechaNacimiento}>
        <input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={onChange}
          className={inputClass(!!errors.fechaNacimiento)}
        />
      </FormField>
      <FormField label="Fecha Comunero Desde" required error={errors.communityMemberSince}>
        <input
          type="date"
          name="communityMemberSince"
          value={formData.communityMemberSince}
          onChange={onChange}
          className={inputClass(!!errors.communityMemberSince)}
        />
      </FormField>
    </div>
  </>
);
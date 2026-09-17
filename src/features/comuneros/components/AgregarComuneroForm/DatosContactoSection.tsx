import React from 'react';
import { FormField, inputClass, selectClass } from './Formfield';
import { ComuneroFormState } from './ comuneroForm.utils';
import { Neighborhood } from '../../services/neighborhoodsApi';

interface Props {
  formData: ComuneroFormState;
  errors: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  barrios: Neighborhood[];
  loadingBarrios: boolean;
}

export const DatosContactoSection: React.FC<Props> = ({ formData, errors, onChange, barrios, loadingBarrios }) => (
  <>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField label="Teléfono" error={errors.telefono}>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={onChange}
          placeholder="Ej. 9611234567"
          className={inputClass(!!errors.telefono)}
        />
      </FormField>
      <FormField label="Barrio / Vecindario" required error={errors.neighborhoodId}>
        <select
          name="neighborhoodId"
          value={formData.neighborhoodId}
          onChange={onChange}
          disabled={loadingBarrios}
          className={selectClass(!!errors.neighborhoodId)}
        >
          <option value="">{loadingBarrios ? 'Cargando barrios...' : 'Selecciona un barrio...'}</option>
          {barrios.map((barrio) => (
            <option key={barrio.id} value={barrio.id}>
              {barrio.name}
            </option>
          ))}
        </select>
      </FormField>
    </div>

    <FormField label="Dirección Particular" required error={errors.address}>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={onChange}
        placeholder="Ej. Calle Benito Juárez #125"
        className={inputClass(!!errors.address)}
      />
    </FormField>
  </>
);
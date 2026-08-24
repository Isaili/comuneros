import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const getNeighborhoodsMock = vi.fn();

vi.mock('../services/neighborhoodsApi', () => ({
  getNeighborhoods: getNeighborhoodsMock,
}));

describe('AgregarComuneroForm', () => {
  it('prevents duplicate submissions while the create request is still pending', async () => {
    getNeighborhoodsMock.mockResolvedValue([{ id: 'bar-1', name: 'Centro' }]);

    const onGuardar = vi.fn(async () => new Promise((resolve) => setTimeout(resolve, 50)));

    render(
      <form>
        <button type="button">dummy</button>
      </form>
    );

    const { unmount } = render(
      <AgregarComuneroForm
        onClose={() => {}}
        onGuardar={onGuardar}
      />
    );

    fireEvent.change(screen.getByLabelText(/Nombre\(s\)/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/Apellido Paterno/i), { target: { value: 'López' } });
    fireEvent.change(screen.getByLabelText(/Apellido Materno/i), { target: { value: 'Méndez' } });
    fireEvent.change(screen.getByLabelText(/Fecha de Nacimiento/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/Fecha Comunero Desde/i), { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByLabelText(/Dirección Particular/i), { target: { value: 'Calle 1 #2' } });
    fireEvent.change(screen.getByLabelText(/Barrio \/ Vecindario/i), { target: { value: 'bar-1' } });
    fireEvent.change(screen.getByLabelText(/Estado Civil/i), { target: { value: 'soltero' } });
    fireEvent.click(screen.getByLabelText(/Comunero/i));
    fireEvent.click(screen.getByLabelText(/Activo/i));

    const submit = screen.getByRole('button', { name: /Guardar Registro/i });
    fireEvent.click(submit);
    fireEvent.click(submit);

    await waitFor(() => expect(onGuardar).toHaveBeenCalledTimes(1), { timeout: 200 });
    unmount();
  });
});

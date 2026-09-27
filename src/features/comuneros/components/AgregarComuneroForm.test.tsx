import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AgregarComuneroForm } from './AgregarComuneroForm'; 

const { getNeighborhoodsMock } = vi.hoisted(() => ({ getNeighborhoodsMock: vi.fn() }));

vi.mock('../services/neighborhoodsApi', () => ({
  getNeighborhoods: getNeighborhoodsMock,
}));

describe('AgregarComuneroForm', () => {
  it('allows registration without a photo and prevents duplicate submissions while saving', async () => {
    getNeighborhoodsMock.mockResolvedValue([{ id: 'bar-1', name: 'Centro' }]);

    const onGuardar = vi.fn(async () => new Promise((resolve) => setTimeout(resolve, 50)));

   
    const { container, unmount } = render(
      <AgregarComuneroForm
        onClose={() => {}}
        onGuardar={onGuardar}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Ej. Juan Carlos'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Pérez'), { target: { value: 'López' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Gómez'), { target: { value: 'Méndez' } });
    fireEvent.change(container.querySelector('[name="fechaNacimiento"]')!, { target: { value: '1990-01-01' } });
    fireEvent.change(container.querySelector('[name="communityMemberSince"]')!, { target: { value: '2024-01-01' } });
    fireEvent.change(screen.getByPlaceholderText('Ej. Calle Benito Juárez #125'), { target: { value: 'Calle 1 #2' } });
    fireEvent.change(container.querySelector('[name="neighborhoodId"]')!, { target: { value: 'bar-1' } });
    fireEvent.change(container.querySelector('[name="estadoCivil"]')!, { target: { value: 'soltero' } });
    fireEvent.click(container.querySelector('[name="tipoComunero"][value="comunero"]')!);
    fireEvent.click(container.querySelector('[name="estadoPersona"][value="activo"]')!);

    const submit = screen.getByRole('button', { name: /Guardar Registro/i });
    fireEvent.click(submit);
    fireEvent.click(submit);

    await waitFor(() => expect(onGuardar).toHaveBeenCalledTimes(1), { timeout: 200 });
    unmount();
  });
});
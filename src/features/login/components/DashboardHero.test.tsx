import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const { listarMock, plotsListMock } = vi.hoisted(() => ({
  listarMock: vi.fn(),
  plotsListMock: vi.fn(),
}));

vi.mock('../../comuneros/services/comunerosApi', () => ({
  comunerosApi: { listar: listarMock },
}));

vi.mock('../../parcelas/services/parcelas.service', () => ({
  plotsService: { list: plotsListMock },
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

import DashboardHero from './DashboardHero';

describe('DashboardHero', () => {
  it('loads comuneros and parcelas counts from the backend', async () => {
    listarMock.mockResolvedValue({ comuneros: [], total: 125, totalPages: 1 });
    plotsListMock.mockResolvedValue({
      data: { items: [], total: 84, page: 1, limit: 1 },
    });

    render(<DashboardHero />);

    await waitFor(() => {
      expect(listarMock).toHaveBeenCalledWith(1, 1);
    });

    await waitFor(() => {
      expect(plotsListMock).toHaveBeenCalledWith({
        page: 1,
        limit: 1,
        active: true,
      });
    });

    await waitFor(() => {
      expect(screen.getByText('125')).toBeInTheDocument();
      expect(screen.getByText('84')).toBeInTheDocument();
    });
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import NotFound from './components/NotFound';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: vi.fn(),
    push: vi.fn(),
  }),
}));

describe('NotFound component', () => {
  test('renders 404 and navigation actions', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText(/página no encontrada/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ir al inicio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Volver a navegación/i })).toBeInTheDocument();
  });
});

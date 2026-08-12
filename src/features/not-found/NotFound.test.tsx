import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from './components/NotFound';

describe('NotFound component', () => {
  test('renders 404 and buttons', () => {
    render(<NotFound />);
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByText(/Página no encontrada/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ir al inicio/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reportar error/i })).toBeInTheDocument();
  });
});

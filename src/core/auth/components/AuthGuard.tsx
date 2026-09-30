'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/core/api/apiClient';
import { tokenStorage } from '../services/tokenStorage';
import { userStorage } from '../services/userStorage';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Envuelve rutas privadas: valida la sesión contra el backend antes de pintar
// el contenido. No depende únicamente del interceptor de apiClient (que solo
// redirige ante un 401 real) porque un bloqueo CORS del navegador llega como
// error de red, no como 401, y se quedaría sin redirigir nunca.
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    let cancelado = false;

    const irALogin = () => {
      tokenStorage.clearAccessToken();
      userStorage.clearUser();
      window.location.href = '/login';
    };

    const verificarSesion = async () => {
      try {
        await apiClient.get('/users/me');
        if (!cancelado) setVerificado(true);
      } catch {
        if (!cancelado) irALogin();
      }
    };

    void verificarSesion();
    return () => {
      cancelado = true;
    };
  }, []);

  if (!verificado) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f8fafc]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1E4D3A]/20 border-t-[#1E4D3A]" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;

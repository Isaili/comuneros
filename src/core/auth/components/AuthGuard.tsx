'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/core/api/apiClient';
import { tokenStorage } from '../services/tokenStorage';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Envuelve rutas privadas: valida la sesión contra el backend antes de pintar
// el contenido. Si no hay sesión válida, el propio interceptor de apiClient
// (401 -> intenta refresh -> si falla, redirige a /login) se encarga de sacar al usuario.
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    let cancelado = false;

    const verificarSesion = async () => {
      if (!tokenStorage.getAccessToken()) {
        // Sin access token en memoria: puede que el refresh cookie siga vigente.
        // /users/me disparará el 401 -> el interceptor intentará refrescar solo.
      }
      try {
        await apiClient.get('/users/me');
        if (!cancelado) setVerificado(true);
      } catch {
        // Si la sesión no pudo restablecerse, el interceptor de apiClient ya
        // redirigió a /login (irALogin). No hacemos nada más aquí.
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

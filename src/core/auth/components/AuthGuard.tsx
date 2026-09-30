'use client';

import React, { useEffect, useState } from 'react';
import { tokenStorage } from '../services/tokenStorage';
import { userStorage } from '../services/userStorage';

interface AuthGuardProps {
  children: React.ReactNode;
}

// Decodifica el payload de un JWT sin verificar la firma (solo para leer "exp"
// y evitar mandar peticiones con un token obviamente vencido). La validación
// real de la firma la hace siempre el backend en cada request.
const tokenExpirado = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (typeof payload.exp !== 'number') return false;
    return payload.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
};

// Envuelve rutas privadas. No existe un endpoint como "/users/me" para validar
// la sesión contra el backend, así que se valida localmente la presencia y
// vigencia del access token; el 401 real de cada request (si el backend lo
// llega a exigir) sigue disparando el refresh/redirect vía el interceptor de apiClient.
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [verificado, setVerificado] = useState(false);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();

    if (!token || tokenExpirado(token)) {
      tokenStorage.clearAccessToken();
      userStorage.clearUser();
      window.location.href = '/login';
      return;
    }

    setVerificado(true);
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

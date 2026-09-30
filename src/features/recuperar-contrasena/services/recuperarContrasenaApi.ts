import { apiClient } from '@/core/api/apiClient';

// TODO: confirmar con Norberto los paths reales cuando entregue el endpoint de recuperación de contraseña.
const SOLICITAR_RECUPERACION_ENDPOINT = '/auth/forgot-password';
const RESTABLECER_CONTRASENA_ENDPOINT = '/auth/reset-password';

export const recuperarContrasenaApi = {
  solicitarRecuperacion: (correo: string) =>
    apiClient.post(SOLICITAR_RECUPERACION_ENDPOINT, { correo }),

  restablecerContrasena: (token: string, nuevaContrasena: string) =>
    apiClient.post(RESTABLECER_CONTRASENA_ENDPOINT, { token, nuevaContrasena }),
};

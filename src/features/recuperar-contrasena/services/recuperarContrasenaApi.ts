import { apiClient } from '@/core/api/apiClient';

export const recuperarContrasenaApi = {
  solicitarRecuperacion: (email: string) =>
    apiClient.post('/auth/password-reset/request', { email }),

  restablecerContrasena: (resetToken: string, newPassword: string) =>
    apiClient.post('/auth/password-reset/confirm', { resetToken, newPassword }),
};

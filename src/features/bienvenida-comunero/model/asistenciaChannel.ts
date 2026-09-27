import { EventoAsistencia } from './types';

export const CANAL_ASISTENCIA = 'kiosco-asistencia-channel';

/**
 * Crea el canal de comunicación en tiempo real. Devuelve null si el navegador
 * no soporta BroadcastChannel o si se ejecuta fuera del cliente (SSR).
 */
export function crearCanalAsistencia(): BroadcastChannel | null {
  if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return null;
  return new BroadcastChannel(CANAL_ASISTENCIA);
}


export function publicarEvento(canal: BroadcastChannel | null, evento: EventoAsistencia) {
  canal?.postMessage(evento);
}
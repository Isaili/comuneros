import { EventoAsistencia, SnapshotAsistencia } from './types';

export const CANAL_ASISTENCIA = 'kiosco-asistencia-channel';
export const SNAPSHOT_KEY = 'kiosco-asistencia:snapshot';

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


export function guardarSnapshot(snapshot: SnapshotAsistencia) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
  }
}

export function leerSnapshot(): SnapshotAsistencia | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SNAPSHOT_KEY);
    return raw ? (JSON.parse(raw) as SnapshotAsistencia) : null;
  } catch {
    return null;
  }
}
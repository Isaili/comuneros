const DASHBOARD_CACHE_KEY = 'dashboard_resumen_cache';
export const DASHBOARD_INVALIDATE_EVENT = 'dashboard:invalidate';

export function leerCacheDashboard() {
  if (typeof window === 'undefined') return null;
  try {
    const cache = window.localStorage.getItem(DASHBOARD_CACHE_KEY);
    return cache ? JSON.parse(cache) : null;
  } catch {
    return null;
  }
}

export function guardarCacheDashboard(resultado: { totales: { comuneros: number; parcelas: number } }) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(resultado));
  } catch {
    // localStorage puede fallar (modo privado, cuota llena, etc.) — no es crítico
  }
}

export function invalidarCacheDashboard() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DASHBOARD_CACHE_KEY);
  window.dispatchEvent(new Event(DASHBOARD_INVALIDATE_EVENT));
}
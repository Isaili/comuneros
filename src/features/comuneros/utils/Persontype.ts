/**
 * Fuente única de verdad para los 3 tipos de persona del sistema.
 * Úsalo en CUALQUIER componente que pinte el tipo (lista, detalle, badges, avatares, filtros)
 * para evitar que cada uno reinvente su propio mapeo y se desincronicen entre sí.
 *
 * Mapeo backend <-> front (debe coincidir con mapaTipoAInglés del formulario):
 *   COMMONER  <-> comunero
 *   RESIDENT  <-> avecindado
 *   INHABITANT <-> poblador
 */

import { TipoPersona } from '@/features/comuneros/types/types';

export type PersonTypeKey = TipoPersona;

export interface PersonTypeConfig {
  key: PersonTypeKey;
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  avatarGradient: string;
}

export const PERSON_TYPE_CONFIG: Record<PersonTypeKey, PersonTypeConfig> = {
  comunero: {
    key: 'comunero',
    label: 'Comunero',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-100',
    avatarGradient: 'from-emerald-400 to-[#006837]',
  },
  avecindado: {
    key: 'avecindado',
    label: 'Avecindado',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    badgeBorder: 'border-amber-100',
    avatarGradient: 'from-amber-300 to-amber-500',
  },
  poblador: {
    key: 'poblador',
    label: 'Poblador',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    badgeBorder: 'border-red-200',
    avatarGradient: 'from-red-400 to-red-600',
  },
};

/**
 * Normaliza cualquier variante que pueda venir del backend o del form
 * (español en minúsculas del form, o inglés en mayúsculas de la API)
 * a una de las 3 claves canónicas. Por defecto cae en 'avecindado'
 * únicamente si el valor no coincide con ningún tipo conocido.
 */
export function normalizePersonType(tipo: string | null | undefined): PersonTypeKey {
  const valor = String(tipo ?? '').trim().toUpperCase();

  if (valor === 'COMUNERO' || valor === 'COMMONER') return 'comunero';
  if (valor === 'POBLADOR' || valor === 'INHABITANT') return 'poblador';
  if (valor === 'AVECINDADO' || valor === 'RESIDENT') return 'avecindado';

  // Valor desconocido: no lo confundimos con comunero por accidente
  return 'avecindado';
}

export function getPersonTypeConfig(tipo: string | null | undefined): PersonTypeConfig {
  return PERSON_TYPE_CONFIG[normalizePersonType(tipo)];
}
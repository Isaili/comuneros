import { Comunero } from '../../types/types';
import { mapaEstadoCivilDesdeAPI, mapaEstadoPersonaDesdeAPI } from './comuneroForm.schema';

export interface ComuneroFormState {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  estadoCivil: string;
  telefono: string;
  tipoComunero: 'comunero' | 'avecindado' | 'poblador';
  estadoPersona: 'activo' | 'inactivo' | 'fallecido';
  neighborhoodId: string;
  address: string;
  communityMemberSince: string;
}

/** Formatea fechas ISO a YYYY-MM-DD para los <input type="date"> */
export function toInputDate(val?: string | null): string {
  if (!val) return '';
  return String(val).trim().split('T')[0] || '';
}

/** Construye el estado inicial del formulario a partir de un comunero existente (edición) o vacío (alta) */
export function buildInitialFormState(comuneroAEditar?: Comunero | any): ComuneroFormState {
  const hoyStr = new Date().toISOString().split('T')[0];

  const rawTipo = comuneroAEditar?.tipo ?? comuneroAEditar?.personType ?? 'comunero';
  const tipoComunero: ComuneroFormState['tipoComunero'] =
    rawTipo === 'COMMONER' || rawTipo === 'comunero'
      ? 'comunero'
      : rawTipo === 'INHABITANT' || rawTipo === 'poblador'
      ? 'poblador'
      : 'avecindado';

  const rawEstadoPersona = comuneroAEditar?.estado ?? comuneroAEditar?.status ?? 'activo';
  const estadoPersona = (mapaEstadoPersonaDesdeAPI[rawEstadoPersona] || 'activo') as ComuneroFormState['estadoPersona'];

  const rawEstadoCivil = comuneroAEditar?.estadoCivil ?? comuneroAEditar?.maritalStatus ?? 'soltero';
  const rawFechaNac = comuneroAEditar?.fechaNacimiento ?? comuneroAEditar?.birthDate;
  const rawFechaReg =
    comuneroAEditar?.communityMemberSince ?? comuneroAEditar?.fechaRegistro ?? comuneroAEditar?.createdAt;

  return {
    nombre: comuneroAEditar?.nombre ?? comuneroAEditar?.firstName ?? '',
    apellidoPaterno: comuneroAEditar?.apellidoPaterno ?? comuneroAEditar?.paternalLastName ?? '',
    apellidoMaterno: comuneroAEditar?.apellidoMaterno ?? comuneroAEditar?.maternalLastName ?? '',
    fechaNacimiento: toInputDate(rawFechaNac),
    estadoCivil: mapaEstadoCivilDesdeAPI[rawEstadoCivil] || 'soltero',
    telefono: comuneroAEditar?.telefono ?? comuneroAEditar?.phoneNumber ?? comuneroAEditar?.phone ?? '',
    tipoComunero,
    estadoPersona,
    neighborhoodId: comuneroAEditar?.neighborhoodId ?? comuneroAEditar?.neighborhood?.id ?? '',
    address: comuneroAEditar?.address ?? comuneroAEditar?.direccion ?? '',
    communityMemberSince: toInputDate(rawFechaReg) || hoyStr,
  };
}
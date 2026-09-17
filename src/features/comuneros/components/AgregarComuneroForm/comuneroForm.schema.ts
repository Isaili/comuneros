import * as Yup from 'yup';
import { CrearComuneroPayload } from '../../types/types';

export const comuneroValidationSchema = Yup.object().shape({
  nombre: Yup.string().min(3, 'El nombre debe tener al menos 3 caracteres').required('El nombre es obligatorio'),
  apellidoPaterno: Yup.string().min(2, 'Muy corto').required('El apellido paterno es obligatorio'),
  apellidoMaterno: Yup.string().min(2, 'Muy corto').required('El apellido materno es obligatorio'),
  fechaNacimiento: Yup.string().required('La fecha de nacimiento es obligatoria'),
  estadoCivil: Yup.string()
    .oneOf(['soltero', 'casado', 'divorciado', 'viudo', 'union_libre'], 'Selecciona un estado civil válido')
    .required('El estado civil es obligatorio'),
  telefono: Yup.string()
    .matches(/^[0-9]{10}$/, 'El teléfono debe tener exactamente 10 dígitos numéricos')
    .required('El teléfono es obligatorio'),
  tipoComunero: Yup.string()
    .oneOf(['comunero', 'avecindado', 'poblador'], 'Selecciona un tipo de miembro válido')
    .required('El tipo de miembro es obligatorio'),
  estadoPersona: Yup.string()
    .oneOf(['activo', 'inactivo', 'fallecido'], 'Selecciona un estado válido')
    .required('El estado de la persona es obligatorio'),
  neighborhoodId: Yup.string().required('Debe seleccionar un barrio o vecindario'),
  address: Yup.string().min(5, 'La dirección debe tener al menos 5 caracteres').required('La dirección es obligatoria'),
  communityMemberSince: Yup.string().required('La fecha de registro/ingreso es obligatoria'),
});

export const mapaTipoAInglés: Record<'comunero' | 'avecindado' | 'poblador', CrearComuneroPayload['personType']> = {
  comunero: 'COMMONER',
  avecindado: 'RESIDENT',
  poblador: 'INHABITANT',
};

export const mapaEstadoCivilAInglés: Record<string, CrearComuneroPayload['maritalStatus']> = {
  soltero: 'SINGLE',
  casado: 'MARRIED',
  divorciado: 'DIVORCED',
  viudo: 'WIDOWED',
  union_libre: 'FREE_UNION',
};

// Mapeos inversos para cuando editamos (de lo que viene de la API al select del form)
export const mapaEstadoCivilDesdeAPI: Record<string, string> = {
  SINGLE: 'soltero',
  MARRIED: 'casado',
  DIVORCED: 'divorciado',
  WIDOWED: 'viudo',
  FREE_UNION: 'union_libre',
  soltero: 'soltero',
  casado: 'casado',
  divorciado: 'divorciado',
  viudo: 'viudo',
  union_libre: 'union_libre',
};

export const mapaEstadoPersonaAInglés: Record<'activo' | 'inactivo' | 'fallecido', CrearComuneroPayload['status']> = {
  activo: 'ACTIVE',
  inactivo: 'INACTIVE',
  fallecido: 'DECEASED',
};

export const mapaEstadoPersonaDesdeAPI: Record<string, string> = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
  DECEASED: 'fallecido',
  activo: 'activo',
  inactivo: 'inactivo',
  fallecido: 'fallecido',
};
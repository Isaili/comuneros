export type TipoPersona = 'comunero' | 'avecindado' | 'poblador'
export type EstadoCivil = 'soltero' | 'casado' | 'divorciado' | 'viudo' | 'union_libre';
export type EstadoPersona = 'activo' | 'inactivo' | 'fallecido';

export interface Comunero {
  id: string;
  // Campos canonical backend / nuevos
  nombre?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  // Campos legacy / frontend convenience
  apellidos?: string; // ej. "Hernández López"
  nombreCompleto?: string;

  tipo: TipoPersona;
  estadoCivil?: EstadoCivil;
  fotografia?: string;
  vecindario?: string;       
  neighborhoodId?: string;  
  address?: string;         
  // Campos utilizados en varias vistas
  direccion?: string;
  colonia?: string;
  folioComunero?: string;
  terrenos?: any[];
  edad?: number;
  activo?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | 'DECEASED';
  fechaRegistro?: string;    
  telefono?: string;         
  fechaNacimiento?: string;  
  qrCode?: string;
}


export interface PersonaBackendDTO {
  id: string;
  personType: 'COMMONER' | 'RESIDENT' | 'INHABITANT';
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'FREE_UNION';
  photo?: string;
  neighborhoodName?: string;
  neighborhoodId?: string;
  address?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DECEASED';
  communityMemberSince: string;
  phoneNumber?: string;
  birthDate?: string;
  qrCode?: string;
}

export interface CrearComuneroPayload {
  personType: 'COMMONER' | 'RESIDENT' | 'INHABITANT';
  status: 'ACTIVE' | 'INACTIVE' | 'DECEASED';
  firstName: string;
  paternalLastName: string;
  maternalLastName: string;
  birthDate: string;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'FREE_UNION';
  phone: string;
  neighborhoodId: string;
  communityMemberSince: string;
  address: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedListDTO<T> {
  items: T[];
  total: number;
  page: string | number;
  limit: string | number;
}
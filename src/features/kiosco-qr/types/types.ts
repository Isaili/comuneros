export type EstadoReunion = 'programada' | 'en_curso' | 'finalizada' | 'cancelada';
export type AssemblyStatus = 'SCHEDULED' | 'REGISTRATION_OPEN' | 'IN_PROGRESS' | 'EXITS_OPEN' | 'COMPLETED' | 'CANCELED';
export type AssemblyType = 'ORDINARY' | 'EXTRAORDINARY';

export interface Reunion {
  id: string;
  nombre: string;
  fecha: string;
  horaInicio: string;
  lugar: string;
  estado: EstadoReunion;
  toleranciaMinutos: number; 
  tipo?: AssemblyType;
  totalAsistentes?: number;
}

export interface ComuneroKiosco {
  id: string;
  nombre: string;
  folio: string;
  fotografia: string;
}

export interface AsistenteRegistro {
  id: string;
  comuneroId: string;
  nombre: string;
  folio: string;
  fotografia: string;
  horaEntrada: string;
  horaSalida?: string;
  status?: string;
}
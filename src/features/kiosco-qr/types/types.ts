export type EstadoReunion = 'programada' | 'en_curso' | 'finalizada';

export interface Reunion {
  id: string;
  nombre: string;
  fecha: string; 
  horaInicio: string;
  lugar: string;
  estado: EstadoReunion;
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
}
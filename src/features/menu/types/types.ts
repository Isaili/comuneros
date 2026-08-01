export interface AsistenteHistorial {
  id: string;
  nombre: string;
  fotografia: string;
  folio: string;
  horaEntrada: string;
  horaSalida?: string;
}

export interface ReunionHistorial {
  id: string;
  nombre: string;
  fecha: string;
  horaInicio: string;
  lugar: string;
  asistentes: AsistenteHistorial[];
}

export type TipoIngreso = 'predial' | 'multa';

export interface Ingreso {
  id: string;
  fecha: string;
  tipo: TipoIngreso;
  concepto: string;
  comuneroNombre: string;
  folioReferencia: string;
  monto: number;
}
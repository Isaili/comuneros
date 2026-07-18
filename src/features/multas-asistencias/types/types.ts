export type TipoMulta = 'inasistencia' | 'otro';
export type EstadoMulta = 'pendiente' | 'pagada';

export interface AsambleaReferencia {
  id: string;
  nombre: string;
  fecha: string;
}

export interface Multa {
  id: string;
  folio: string;
  comuneroId: string;
  comuneroNombre: string;
  comuneroFotografia: string;
  tipo: TipoMulta;
  cantidad: number;
  fechaGeneracion: string;
  descripcion: string;
  estado: EstadoMulta;
  asamblea?: AsambleaReferencia; 
  fechaPago?: string;
  reciboFolio?: string;
}

export interface HistorialAsistencia {
  comuneroId: string;
  totalConvocatorias: number;
  totalFaltas: number;
  asambleasFaltadas: AsambleaReferencia[];
}
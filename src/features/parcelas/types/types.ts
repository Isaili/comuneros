import { TitularFila } from "./typesParcela";

export interface PropietarioHistorico {
  nombre: string;
  certificado: string;
  fechaAdquisicion: string;
  fechaCesion: string;
  actoJuridico: string;
  adquirente: string;
}

export interface PredialHistorico {
  anio: number;
  monto: number;
  estado: 'Pagado' | 'Pagar';
}

export interface Parcela {
  id: string;
  numero: string;
  superficie: string;
  titularesCount: number;
  propietarios: string[];
  estadoPredial: 'Pagado' | 'Pagar';
  titularesDetalle?: TitularFila[]; 
  
  historialPropietarios?: PropietarioHistorico[];
  historialPrediales?: PredialHistorico[];
}
export interface PropietarioHistoricoLote {
  nombre: string;
  certificado: string;
  fechaAdquisicion: string;
  fechaCesion: string;
  actoJuridico: string;
  adquirente: string;
  esActual?: boolean;
}

export interface PredialHistoricoLote {
  anio: number;
  monto: number;
  estado: 'Pagado' | 'Pagar';
}

export interface Lote {
  id?: string;
  folioInterno: string;
  numeroLote: string;
  largo: number;
  ancho: number;
  superficieM2: number;
  fechaRegistro: string;
  observaciones: string;
  estadoPredial: 'Pagado' | 'Pagar';
  propietario?: string;
  propietarios?: string[];
  certificado: string;
  calidadAgraria: string;
  actoJuridico: string;
  ubicacion?: string;
  estatus?: 'asignado' | 'disponible';
  historialPropietarios?: PropietarioHistoricoLote[];
  historialPrediales?: PredialHistoricoLote[];
  origenLoteId?: string;
  origenLoteNumero?: string;
  esFraccion?: boolean;
}
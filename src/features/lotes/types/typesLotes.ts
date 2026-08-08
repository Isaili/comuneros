export interface PropietarioHistoricoLote {
  nombre: string;
  certificado: string;
  fechaAdquisicion: string;
  fechaCesion: string;
  actoJuridico: string;
  adquirente: string;
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
  propietario: string; 
  certificado: string;
  calidadAgraria: string;
  actoJuridico: string;
  ubicacion?: string; // Campo opcional para UI
  estatus?: 'asignado' | 'disponible'; // Campo opcional para UI
  historialPropietarios?: PropietarioHistoricoLote[];
  historialPrediales?: PredialHistoricoLote[];
}
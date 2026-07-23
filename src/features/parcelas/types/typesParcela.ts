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

// Interfaz para el manejo de las filas dinámicas en el buscador de titulares activos
export interface TitularFila {
  comuneroId: string;
  nombreCompleto: string;
  certificado: string;
  hectareasPosesion: number;
  calidadAgraria: 'Ejidatario' | 'Avecindado' | 'Posesionario' | string;
  actoJuridico: 'Asignación' | 'Cesión de derechos' | 'Sucesión' | string;
  vigencia: 'Vigente' | string;
}

//  INTERFAZ DEFINITIVA PARA LA PARCELA
export interface Parcela {
  id: string;
  folioInterno?: string;
  numero: string;
  superficie: string;
  fechaRegistro?: string;
  observaciones?: string;
  estadoPredial: 'Pagado' | 'Pagar';
  titularesCount: number;
  propietarios: string[];
  titularesDetalle?: TitularFila[];   
  historialPropietarios?: PropietarioHistorico[]; 
  historialPrediales?: PredialHistorico[];
}
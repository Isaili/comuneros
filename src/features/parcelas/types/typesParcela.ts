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
  porcentajePosesion: number;
  calidadAgraria: 'Ejidatario' | 'Avecindado' | 'Posesionario' | string;
  actoJuridico: 'Asignación' | 'Cesión de derechos' | 'Sucesión' | string;
  vigencia: 'Vigente' | string;
}

//  INTERFAZ DEFINITIVA PARA LA PARCELA
export interface Parcela {
  id: string;                         // Requerido para listados y edición
  folioInterno?: string;              // Opcional para soportar mockups antiguos, requerido en nuevos
  numero: string;                     // Número de parcela (ej: P-001 o Parcela 155)
  superficie: string;                 // Con formato (ej: "2.50 ha")
  fechaRegistro?: string;             // Opcional para retrocompatibilidad
  observaciones?: string;             // Opcional
  estadoPredial: 'Pagado' | 'Pagar';
  titularesCount: number;             // Total de co-propietarios actuales
  propietarios: string[];             // Nombres completos de los titulares vigentes
  
  // Historiales opcionales unificados
  historialPropietarios?: PropietarioHistorico[]; 
  historialPrediales?: PredialHistorico[];
}
// src/features/parcelas/types/typesParcelas.ts

export interface PropietarioHistoricoFila {
  nombre: string;
  certificado: string;
  fechaAdquisicion: string;
  fechaCesion: string;
  actoJuridico: string;
  adquirente: string;
}

export interface PredialHistoricoFila {
  anio: number;
  monto: number;
  estado: 'Pagado' | 'Pagar';
}

export interface TitularFila {
  comuneroId: string;
  nombreCompleto: string;
  certificado: string;
  porcentajePosesion: number;
  calidadAgraria: string;
  actoJuridico: string;
  vigencia: string;
}

// 👑 INTERFAZ PARCELA DEFINITIVA Y UNIFICADA
export interface Parcela {
  id?: string;                  // Opcional para cuando se está creando
  folioInterno: string;          // Requerido por el formulario
  numero: string;                // Requerido por la lista y detalle
  superficie: string;            // Requerido por todos
  fechaRegistro: string;         // Requerido por el formulario
  observaciones: string;         // Requerido por el formulario
  estadoPredial: 'Pagado' | 'Pagar'; // Requerido por todos
  propietarios: string[];        // Requerido por todos
  titularesCount?: number;       // 👈 ¡FUSIONADO! Ahora la lista no dará error
  
  // Historiales usando los nombres del formulario
  historialPropietarios?: PropietarioHistoricoFila[]; 
  historialPrediales?: PredialHistoricoFila[];
}
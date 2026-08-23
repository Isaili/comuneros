/**
 * Modelo de dominio usado por toda la UI de Parcelas.
 *
 * Se construye combinando:
 *  - Los campos reales que expone el backend (PlotDTO -> id, numero,
 *    superficie, observaciones, activo, parentPlot).
 *  - Campos que la UI necesita pero que HOY no tienen endpoint propio
 *    (titularidad y predial). Se marcan con TODO_BACKEND y se administran
 *    localmente hasta que existan esos endpoints.
 */

export interface PropietarioHistorico {
  nombre: string;
  certificado: string;
  fechaAdquisicion: string;
  fechaCesion: string;
  actoJuridico: string;
  adquirente: string;
  /** Hectáreas que poseía este dueño histórico. La suma del historial debe cuadrar con la superficie total de la parcela. */
  posesionHa: number;
  /** Indica si este titular es el/los propietario(s) actual(es) en la parcela. */
  esActual?: boolean;
}

export interface PredialHistorico {
  anio: number;
  monto: number;
  estado: 'Pagado' | 'Pagar';
}

export interface TitularFila {
  comuneroId: string;
  nombreCompleto: string;
  certificado: string;
  hectareasPosesion: number;
  calidadAgraria: 'Comunero' | 'Avecindado' | 'Posesionario' | string;
  actoJuridico: 'Asignación' | 'Cesión de derechos' | 'Sucesión' | string;
  vigencia: 'Vigente' | string;
}

export interface Parcela {
  /** Id real del Plot en el backend. */
  id: string;
  /** = plotNumber. Se mantiene también como "folioInterno" por compatibilidad de UI. */
  folioInterno: string;
  numero: string;
  /** Texto ya formateado, ej. "2.50 ha" */
  superficie: string;
  /** Valor numérico crudo (= totalArea), útil para cálculos y para el formulario. */
  superficieHa: number;
  observaciones: string;
  /** = active del backend. Es el estado del REGISTRO (soft delete), no del predial. */
  activo: boolean;
  parentPlotNombre?: string | null;

  // ---- TODO_BACKEND: sin endpoint propio todavía ----
  estadoPredial: 'Pagado' | 'Pagar';
  titularesCount: number;
  propietarios: string[];
  titularesDetalle?: TitularFila[];
  historialPropietarios?: PropietarioHistorico[];
  historialPrediales?: PredialHistorico[];
}
/**
 * Tipos que reflejan EXACTAMENTE la forma del backend (/plots).
 * No deben mezclarse con el modelo de dominio (ver domain.types.ts).
 */

export interface PlotDTO {
  id: string;
  plotNumber: string;
  totalArea: number;
  observations: string;
  active: boolean;
  /** Nombre de la parcela padre, si este plot es una subdivisión. */
  parentPlot?: string | null;
}

export interface CreatePlotPayload {
  plotNumber: string;
  totalArea: number;
  observations?: string;
  parentPlotId?: string;
  active?: boolean;
}

export interface UpdatePlotPayload {
  plotNumber?: string;
  totalArea?: number;
  observations?: string;
}

export interface PlotListParams {
  plotNumber?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface PlotListData {
  items: PlotDTO[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}
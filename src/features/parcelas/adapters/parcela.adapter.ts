import { CreatePlotPayload, PlotDTO, UpdatePlotPayload } from '../types/api.types';
import { Parcela, PredialHistorico, PropietarioHistorico, TitularFila } from '../types/domain.types';

interface ParcelaExtrasInput {
  estadoPredial?: 'Pagado' | 'Pagar';
  propietarios?: string[];
  titularesCount?: number;
  titularesDetalle?: TitularFila[];
  historialPropietarios?: PropietarioHistorico[];
  historialPrediales?: PredialHistorico[];
}

export function plotToParcela(plot: PlotDTO, extras: ParcelaExtrasInput = {}): Parcela {
  const superficieHa = Number(plot.totalArea);
  const superficieValida = Number.isFinite(superficieHa) ? superficieHa : 0;

  return {
    id: plot.id,
    folioInterno: plot.plotNumber,
    numero: plot.plotNumber,
    superficie: `${superficieValida.toFixed(2)} ha`,
    superficieHa: superficieValida,
    observaciones: plot.observations ?? '',
    activo: plot.active,
    parentPlotNombre: plot.parentPlot ?? null,

    estadoPredial: extras.estadoPredial ?? 'Pagar',
    propietarios: extras.propietarios ?? [],
    titularesCount: extras.titularesCount ?? extras.propietarios?.length ?? 0,
    titularesDetalle: extras.titularesDetalle,
    historialPropietarios: extras.historialPropietarios ?? [],
    historialPrediales: extras.historialPrediales ?? [],
  };
}

export function parcelaToCreatePayload(input: {
  numero: string;
  superficieHa: number;
  observaciones?: string;
  parentPlotId?: string;
  activo?: boolean;
}): CreatePlotPayload {
  return {
    plotNumber: input.numero,
    totalArea: input.superficieHa,
    observations: input.observaciones ?? '',
    parentPlotId: input.parentPlotId,
    active: input.activo ?? true,
  };
}

export function parcelaToUpdatePayload(input: {
  numero?: string;
  superficieHa?: number;
  observaciones?: string;
}): UpdatePlotPayload {
  const payload: UpdatePlotPayload = {};
  if (input.numero !== undefined) payload.plotNumber = input.numero;
  if (input.superficieHa !== undefined) payload.totalArea = input.superficieHa;
  if (input.observaciones !== undefined) payload.observations = input.observaciones;
  return payload;
}
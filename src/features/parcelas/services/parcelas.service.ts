import { http } from './http';
import {
  ApiEnvelope,
  CreatePlotPayload,
  PlotDTO,
  PlotListData,
  PlotListParams,
  UpdatePlotPayload,
} from '../types/api.types';

export { ApiError } from './http';

function buildQuery(params: PlotListParams): string {
  const qs = new URLSearchParams();
  if (params.plotNumber) qs.set('plotNumber', params.plotNumber);
  if (params.active !== undefined) qs.set('active', String(params.active));
  qs.set('page', String(params.page ?? 1));
  qs.set('limit', String(params.limit ?? 10));
  return qs.toString();
}

// El swagger no deja 100% claro si POST/PATCH /plots devuelven el objeto
// plano o envuelto en { success, message, data } (activate/deactivate SÍ
// lo envuelven). Este helper soporta ambas formas para no romper si el
// backend ajusta el formato.
function unwrap(res: ApiEnvelope<PlotDTO> | PlotDTO): PlotDTO {
  return (res as ApiEnvelope<PlotDTO>).data ?? (res as PlotDTO);
}

export const plotsService = {
  list(params: PlotListParams = {}): Promise<ApiEnvelope<PlotListData>> {
    return http(`/plots?${buildQuery(params)}`);
  },

  create(payload: CreatePlotPayload): Promise<PlotDTO> {
    return http<ApiEnvelope<PlotDTO> | PlotDTO>(`/plots`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(unwrap);
  },

  update(id: string, payload: UpdatePlotPayload): Promise<PlotDTO> {
    return http<ApiEnvelope<PlotDTO> | PlotDTO>(`/plots/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }).then(unwrap);
  },

  activate(id: string): Promise<PlotDTO> {
    return http<ApiEnvelope<PlotDTO>>(`/plots/${id}/activate`, {
      method: 'PATCH',
    }).then(res => res.data);
  },

  deactivate(id: string): Promise<PlotDTO> {
    return http<ApiEnvelope<PlotDTO>>(`/plots/${id}/deactivate`, {
      method: 'PATCH',
    }).then(res => res.data);
  },
};
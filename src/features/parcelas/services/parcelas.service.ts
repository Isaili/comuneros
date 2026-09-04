import { http } from './http';
import {
  ApiEnvelope,
  CreateParcelPayload,
  ParcelDTO,
  ParcelDetailDTO,
  ParcelHistoryData,
  ParcelListParams,
} from '../types/api.types';

export { ApiError } from './http';

const query = (params: ParcelListParams = {}) => {
  const search = new URLSearchParams();
  search.set('page', String(params.page ?? 1));
  search.set('limit', String(params.limit ?? 12));
  if (params.parcelNumber) search.set('parcelNumber', params.parcelNumber);
  return search.toString();
};

export const plotsService = {
  list: (params: ParcelListParams = {}) =>
    http<ApiEnvelope<{ items: ParcelDTO[]; total: number; page: number; limit: number }>>(`/parcel?${query(params)}`),
  create: (payload: CreateParcelPayload) =>
    http<ApiEnvelope<ParcelDTO>>('/parcel', { method: 'POST', body: JSON.stringify(payload) }).then((res) => res.data),
  detail: (id: string) =>
    http<ApiEnvelope<ParcelDetailDTO>>(`/parcel/${id}`).then((res) => res.data),
  history: (id: string, page = 1, limit = 12, ownerName?: string) =>
    http<ApiEnvelope<ParcelHistoryData>>(`/parcel/${id}/history?${new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(ownerName ? { ownerName } : {}),
    }).toString()}`),
  initialOwners: (id: string, owners: Array<{ personId: string; hectares: number; certificate: string; transferType: string }>) =>
    http(`/parcel/${id}/initial-owner`, { method: 'POST', body: JSON.stringify({ owners }) }),
  historyCreate: (id: string, historicalOwners: unknown[]) =>
    http(`/parcel/${id}/history`, { method: 'POST', body: JSON.stringify({ historicalOwners }) }),
  transfer: (id: string, payload: { oldPersonId: string; newPersonId: string; newCertificate: string; transferType: string }) =>
    http(`/parcel/${id}/transfer`, { method: 'POST', body: JSON.stringify(payload) }),
  usageRight: (id: string, personId: string) =>
    http(`/parcel/${id}/usage-rights`, { method: 'POST', body: JSON.stringify({ personId }) }),
  removeUsageRight: (id: string, personId: string) =>
    http(`/parcel/${id}/usage-rights/${personId}`, { method: 'DELETE' }),
};

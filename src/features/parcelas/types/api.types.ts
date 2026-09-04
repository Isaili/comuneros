export interface ParcelDTO {
  id: string;
  parcelNumber: string;
  surfaceHectares: number;
  observations?: string;
  activeOwnersCount: number;
  activeUsageRightsCount: number;
}

export interface ParcelOwnerDTO {
  personId: string;
  fullName?: string;
  ownerName?: string;
  name?: string;
  photo?: string;
  transferType?: string;
  hectares?: number;
  certificate?: string;
  previousOwnerId?: string;
  startDate?: string;
  endDate?: string;
}

export interface ParcelDetailDTO extends ParcelDTO {
  activeOwners: ParcelOwnerDTO[];
  activeUsageRights: ParcelOwnerDTO[];
}

export interface ParcelHistoryData {
  items: ParcelOwnerDTO[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateParcelPayload {
  parcelNumber: string;
  surfaceHectares: number;
  observations?: string;
}

export interface ParcelListParams {
  page?: number;
  limit?: number;
  parcelNumber?: string;
  active?: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

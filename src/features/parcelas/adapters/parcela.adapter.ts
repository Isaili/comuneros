import { CreateParcelPayload, ParcelDTO, ParcelDetailDTO, ParcelOwnerDTO } from '../types/api.types';
import { Parcela, PredialHistorico, PropietarioHistorico, TitularFila } from '../types/domain.types';

interface ParcelaExtrasInput {
  estadoPredial?: 'Pagado' | 'Pagar';
  propietarios?: string[];
  titularesCount?: number;
  titularesDetalle?: TitularFila[];
  historialPropietarios?: PropietarioHistorico[];
  historialPrediales?: PredialHistorico[];
}

export function parcelToParcela(parcel: ParcelDTO | ParcelDetailDTO, extras: ParcelaExtrasInput = {}): Parcela {
  const superficieHa = Number(parcel.surfaceHectares);
  const superficieValida = Number.isFinite(superficieHa) ? superficieHa : 0;

  return {
    id: parcel.id,
    folioInterno: parcel.parcelNumber,
    numero: parcel.parcelNumber,
    superficie: `${superficieValida.toFixed(2)} ha`,
    superficieHa: superficieValida,
    observaciones: parcel.observations ?? '',
    activo: true,
    parentPlotNombre: null,

    estadoPredial: extras.estadoPredial ?? 'Pagar',
    propietarios: extras.propietarios ?? [],
    titularesCount: extras.titularesCount ?? extras.propietarios?.length ?? 0,
    titularesDetalle: extras.titularesDetalle,
    historialPropietarios: extras.historialPropietarios ?? [],
    historialPrediales: extras.historialPrediales ?? [],
  };
}

export const detailToParcela = (parcel: ParcelDetailDTO): Parcela => parcelToParcela(parcel, {
  propietarios: parcel.activeOwners.map((owner) => owner.fullName ?? owner.personId),
  titularesCount: parcel.activeOwnersCount,
  titularesDetalle: parcel.activeOwners.map((owner) => ({
    comuneroId: owner.personId,
    nombreCompleto: owner.fullName ?? owner.personId,
    foto: owner.photo,
    certificado: owner.certificate ?? '—',
    hectareasPosesion: owner.hectares ?? 0,
    calidadAgraria: 'Comunero',
    actoJuridico: owner.transferType ?? '—',
    vigencia: 'Vigente',
  })),
});

export const historyToPropietarios = (
  items: ParcelOwnerDTO[],
  activeOwners: ParcelOwnerDTO[] = [],
): PropietarioHistorico[] =>
  items.map((owner) => ({
    nombre: owner.fullName ?? owner.ownerName ?? owner.name ?? owner.personId,
    certificado: owner.certificate ?? '—',
    fechaAdquisicion: owner.startDate ?? '—',
    fechaCesion: owner.endDate ?? '—',
    actoJuridico: owner.transferType ?? '—',
    adquirente: activeOwners.find((activeOwner) => activeOwner.personId !== owner.personId)?.fullName
      ?? activeOwners[0]?.fullName
      ?? '—',
    posesionHa: owner.hectares ?? 0,
    esActual: false,
  }));

export function parcelaToCreatePayload(input: {
  numero: string;
  superficieHa: number;
  observaciones?: string;
  parentPlotId?: string;
  activo?: boolean;
}): CreateParcelPayload {
  return {
    parcelNumber: input.numero,
    surfaceHectares: input.superficieHa,
    observations: input.observaciones ?? '',
  };
}
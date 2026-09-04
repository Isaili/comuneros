import { Comunero, PersonaBackendDTO, TipoPersona, EstadoCivil } from '../types/types';
import { resolverQrCode } from './comunerosApi';

const mapaTipo: Record<PersonaBackendDTO['personType'], TipoPersona> = {
  COMMONER: 'comunero',
  RESIDENT: 'avecindado',
  INHABITANT: 'poblador',
};

const mapaEstadoCivil: Record<PersonaBackendDTO['maritalStatus'], EstadoCivil> = {
  SINGLE: 'soltero',
  MARRIED: 'casado',
  DIVORCED: 'divorciado',
  WIDOWED: 'viudo',
  FREE_UNION: 'union_libre',
};

export function mapearComuneroDesdeBackend(dto: PersonaBackendDTO): Comunero {
  return {
    id: dto.id,
    nombre: dto.firstName,
    apellidoPaterno: dto.paternalLastName,
    apellidoMaterno: dto.maternalLastName,
    tipo: mapaTipo[dto.personType] ?? 'comunero',
    estadoCivil: mapaEstadoCivil[dto.maritalStatus] ?? 'soltero',
    fotografia: dto.photo,
    vecindario: dto.neighborhoodName,
    neighborhoodId: dto.neighborhoodId,
    address: dto.address,
    status: dto.status,
    activo: dto.status === 'ACTIVE',
    fechaRegistro: dto.communityMemberSince,
    telefono: dto.phoneNumber ?? '',
    fechaNacimiento: dto.birthDate ?? '',
    qrCode: resolverQrCode(dto.qrCode, dto.id),
  };
}
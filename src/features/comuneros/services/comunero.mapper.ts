import { Comunero, PersonaBackendDTO, TipoPersona, EstadoCivil } from '../types/types';

const mapaTipo: Record<PersonaBackendDTO['personType'], TipoPersona> = {
  COMMUNER: 'comunero',
  RESIDENT: 'avecindado',
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
    vecindario: dto.neighborhood,
    activo: dto.status === 'ACTIVE',
    fechaRegistro: dto.communityMemberSince,
    telefono: dto.phone ?? '',
    fechaNacimiento: dto.birthDate ?? '',
    qrCode: dto.qrCode ?? '',
  };
}
import { apiClient } from '@/core/api/apiClient';
import { AssemblyStatus, AssemblyType, AsistenteRegistro, Reunion } from '../types/types';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

interface AssemblyDTO {
  id: string;
  title: string;
  scheduledDate: string;
  status: AssemblyStatus;
  type: AssemblyType;
  agreements?: string[];
  totalAttendees?: number;
}

interface AttendanceDTO {
  personId?: string;
  fullName?: string;
  photo?: string;
  status: string;
  attendanceStatus?: string;
  personType?: string;
  checkInAt?: string;
  checkOutAt?: string;
  recordedAt?: string | null;
  exitTime?: string | null;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'JUSTIFIED' | 'LEFT_EARLY';

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export const obtenerItemsPaginados = <T>(data: Paginated<T> | T[]): T[] =>
  Array.isArray(data) ? data : data.items;

const estadoDesdeApi: Record<AssemblyStatus, Reunion['estado']> = {
  SCHEDULED: 'programada',
  REGISTRATION_OPEN: 'en_curso',
  IN_PROGRESS: 'en_curso',
  EXITS_OPEN: 'en_curso',
  COMPLETED: 'finalizada',
  CANCELED: 'cancelada',
};

export const assemblyToReunion = (assembly: AssemblyDTO): Reunion => {
  const date = new Date(assembly.scheduledDate);
  return {
    id: assembly.id,
    nombre: assembly.title,
    fecha: assembly.scheduledDate,
    horaInicio: date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
    lugar: 'Asamblea comunitaria',
    estado: estadoDesdeApi[assembly.status],
    toleranciaMinutos: 15,
    tipo: assembly.type,
    totalAsistentes: assembly.totalAttendees ?? 0,
  };
};

export const attendanceToRegistro = (
  attendance: AttendanceDTO,
  index: number,
  fallbackEntryTime?: string,
): AsistenteRegistro => ({
  id: attendance.personId ?? attendance.fullName ?? `asistente-${index}`,
  comuneroId: attendance.personId ?? '',
  nombre: attendance.fullName ?? 'Asistente',
  folio: attendance.personId ?? '—',
  fotografia: attendance.photo ?? '',
  horaEntrada: attendance.checkInAt ?? attendance.recordedAt ?? fallbackEntryTime ?? '',
  horaSalida: attendance.checkOutAt ?? attendance.exitTime ?? undefined,
  status: attendance.status ?? attendance.attendanceStatus,
});

export const assembliesApi = {
  listar: (params: { status?: AssemblyStatus; type?: AssemblyType; date?: string; page?: number; limit?: number } = {}) =>
    apiClient.get<ApiEnvelope<Paginated<AssemblyDTO>>>('/assemblies', { params }),
  obtener: (id: string) => apiClient.get<ApiEnvelope<AssemblyDTO>>(`/assemblies/${id}`),
  crear: (payload: { title: string; scheduledDate: string; type: AssemblyType; agreements: string[] }) =>
    apiClient.post<ApiEnvelope<AssemblyDTO>>('/assemblies', payload),
  actualizar: (id: string, payload: { title: string; scheduledDate: string; agreements: string[] }) =>
    apiClient.put<ApiEnvelope<AssemblyDTO>>(`/assemblies/${id}`, payload),
  abrirRegistro: (id: string) => apiClient.patch(`/assemblies/${id}/start-registration`),
  bloquearRegistro: (id: string) => apiClient.patch(`/assemblies/${id}/lock-registration`),
  abrirSalidas: (id: string) => apiClient.patch(`/assemblies/${id}/open-exit`),
  cerrar: (id: string) => apiClient.patch(`/assemblies/${id}/close`),
  cancelar: (id: string) => apiClient.patch(`/assemblies/${id}/cancel`),
  asistencias: (id: string, params: {
    status?: AttendanceStatus;
    page?: number;
    limit?: number;
  } = {}) =>
    apiClient.get<ApiEnvelope<Paginated<AttendanceDTO>>>(`/assemblies/${id}/attendances`, { params }),
  entradaQr: (id: string, qrCode: string) =>
    apiClient.post<ApiEnvelope<AttendanceDTO>>(`/assemblies/${id}/attendances/qr`, { qrCode }),
  salidaQr: (id: string, qrCode: string) =>
    apiClient.patch<ApiEnvelope<AttendanceDTO>>(`/assemblies/${id}/attendances/qr-exit`, { qrCode }),
  justificar: (id: string, personId: string, observations: string) =>
    apiClient.patch(`/assemblies/${id}/attendances/justify`, { personId, observations }),
};

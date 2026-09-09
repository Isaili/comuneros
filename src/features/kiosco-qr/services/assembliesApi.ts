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
  fullName: string;
  photo?: string;
  status: string;
  personType?: string;
  checkInAt?: string;
  checkOutAt?: string;
}

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

const estadoDesdeApi: Record<AssemblyStatus, Reunion['estado']> = {
  SCHEDULED: 'programada',
  REGISTRATION_OPEN: 'en_curso',
  IN_PROGRESS: 'en_curso',
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

export const attendanceToRegistro = (attendance: AttendanceDTO, index: number): AsistenteRegistro => ({
  id: `${attendance.personId ?? attendance.fullName}-${index}`,
  comuneroId: attendance.personId ?? '',
  nombre: attendance.fullName,
  folio: attendance.personId ?? '—',
  fotografia: attendance.photo ?? '',
  horaEntrada: attendance.checkInAt ?? new Date().toISOString(),
  horaSalida: attendance.checkOutAt,
  status: attendance.status,
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
  cerrar: (id: string) => apiClient.patch(`/assemblies/${id}/close`),
  cancelar: (id: string) => apiClient.patch(`/assemblies/${id}/cancel`),
  asistencias: (id: string, params: Record<string, string | number | undefined> = {}) =>
    apiClient.get<ApiEnvelope<Paginated<AttendanceDTO>>>(`/assemblies/${id}/attendances`, { params }),
  entradaQr: (id: string, qrCode: string) =>
    apiClient.post<ApiEnvelope<AttendanceDTO>>(`/assemblies/${id}/attendances/qr`, { qrCode }),
  salidaQr: (id: string, qrCode: string) =>
    apiClient.patch<ApiEnvelope<AttendanceDTO>>(`/assemblies/${id}/attendances/qr-exit`, { qrCode }),
  justificar: (id: string, personId: string, observations: string) =>
    apiClient.patch(`/assemblies/${id}/attendances/justify`, { personId, observations }),
};

import { Reunion, AsistenteRegistro } from '../../kiosco-qr/types/types';

export type TipoEventoAsistencia = 'reunion_abierta' | 'reunion_cerrada' | 'entrada' | 'salida';

export interface EventoAsistencia {
  tipo: TipoEventoAsistencia;
  timestamp: string;
  reunion: Reunion | null;
  asistente?: AsistenteRegistro;
}

export interface SnapshotAsistencia {
  reunionActiva: Reunion | null;
  asistentes: AsistenteRegistro[];
}
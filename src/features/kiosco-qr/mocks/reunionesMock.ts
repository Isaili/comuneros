import { Reunion } from '../types/types';

export const reunionesMock: Reunion[] = [
  {
    id: 'reu-001',
    nombre: 'Asamblea ordinaria - Julio 2026',
    fecha: new Date().toISOString().slice(0, 10),
    horaInicio: '10:00',
    lugar: 'Salón ejidal principal',
    estado: 'programada',
    duracionMinutos: 120,
  },
  {
    id: 'reu-002',
    nombre: 'Asamblea de rendición de cuentas',
    fecha: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
    horaInicio: '09:00',
    lugar: 'Salón ejidal principal',
    estado: 'programada',
    duracionMinutos: 90,
  },
  {
    id: 'reu-003',
    nombre: 'Asamblea extraordinaria - Linderos',
    fecha: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString().slice(0, 10),
    horaInicio: '11:30',
    lugar: 'Anexo Ejidal Norte',
    estado: 'programada',
    duracionMinutos: 150,
  },
];
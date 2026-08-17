import { ReunionHistorial } from '../types/types';

const diasAtras = (n: number) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - n);
  return fecha.toISOString().slice(0, 10);
};

const horaISO = (dias: number, hora: string) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - dias);
  const [h, m] = hora.split(':').map(Number);
  fecha.setHours(h, m, 0, 0);
  return fecha.toISOString();
};

export const reunionesHistorialMock: ReunionHistorial[] = [
  {
    id: 'reu-h001',
    nombre: 'Asamblea ordinaria - Junio 2026',
    fecha: diasAtras(30),
    horaInicio: '10:00',
    lugar: 'Salón comunal principal',
    asistentes: [
      { id: 'a1', nombre: 'Juan Carlos Pérez Gómez', folio: 'COM-0101', fotografia: 'https://i.pravatar.cc/150?img=12', horaEntrada: horaISO(30, '10:02'), horaSalida: horaISO(30, '12:10') },
      { id: 'a2', nombre: 'María Elena López Ruiz', folio: 'COM-0102', fotografia: 'https://i.pravatar.cc/150?img=32', horaEntrada: horaISO(30, '10:05'), horaSalida: horaISO(30, '12:05') },
      { id: 'a3', nombre: 'Roberto Díaz Hernández', folio: 'COM-0103', fotografia: 'https://i.pravatar.cc/150?img=51', horaEntrada: horaISO(30, '10:11') },
      { id: 'a4', nombre: 'Ana Sofía Martínez Cruz', folio: 'COM-0104', fotografia: 'https://i.pravatar.cc/150?img=47', horaEntrada: horaISO(30, '10:20'), horaSalida: horaISO(30, '11:50') },
    ],
  },
  {
    id: 'reu-h002',
    nombre: 'Asamblea extraordinaria - Linderos',
    fecha: diasAtras(18),
    horaInicio: '11:30',
    lugar: 'Anexo Comunal Norte',
    asistentes: [
      { id: 'a5', nombre: 'José Antonio Hernández', folio: 'COM-0105', fotografia: 'https://i.pravatar.cc/150?img=15', horaEntrada: horaISO(18, '11:31'), horaSalida: horaISO(18, '13:00') },
      { id: 'a6', nombre: 'Guadalupe Torres Silva', folio: 'COM-0106', fotografia: 'https://i.pravatar.cc/150?img=26', horaEntrada: horaISO(18, '11:40') },
    ],
  },
  {
    id: 'reu-h003',
    nombre: 'Asamblea de rendición de cuentas',
    fecha: diasAtras(9),
    horaInicio: '09:00',
    lugar: 'Salón comunal principal',
    asistentes: [
      { id: 'a7', nombre: 'Juan Carlos Pérez Gómez', folio: 'COM-0101', fotografia: 'https://i.pravatar.cc/150?img=12', horaEntrada: horaISO(9, '09:01'), horaSalida: horaISO(9, '10:45') },
      { id: 'a8', nombre: 'Ana Sofía Martínez Cruz', folio: 'COM-0104', fotografia: 'https://i.pravatar.cc/150?img=47', horaEntrada: horaISO(9, '09:03'), horaSalida: horaISO(9, '10:40') },
      { id: 'a9', nombre: 'Roberto Díaz Hernández', folio: 'COM-0103', fotografia: 'https://i.pravatar.cc/150?img=51', horaEntrada: horaISO(9, '09:10'), horaSalida: horaISO(9, '10:50') },
      { id: 'a10', nombre: 'María Elena López Ruiz', folio: 'COM-0102', fotografia: 'https://i.pravatar.cc/150?img=32', horaEntrada: horaISO(9, '09:12') },
      { id: 'a11', nombre: 'Guadalupe Torres Silva', folio: 'COM-0106', fotografia: 'https://i.pravatar.cc/150?img=26', horaEntrada: horaISO(9, '09:18'), horaSalida: horaISO(9, '10:55') },
    ],
  },
  {
    id: 'reu-h004',
    nombre: 'Asamblea ordinaria - Mayo 2026',
    fecha: diasAtras(60),
    horaInicio: '10:00',
    lugar: 'Salón comunal principal',
    asistentes: [
      { id: 'a12', nombre: 'José Antonio Hernández', folio: 'COM-0105', fotografia: 'https://i.pravatar.cc/150?img=15', horaEntrada: horaISO(60, '10:04'), horaSalida: horaISO(60, '11:59') },
      { id: 'a13', nombre: 'Juan Carlos Pérez Gómez', folio: 'COM-0101', fotografia: 'https://i.pravatar.cc/150?img=12', horaEntrada: horaISO(60, '10:06'), horaSalida: horaISO(60, '12:00') },
    ],
  },
];
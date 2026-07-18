import { HistorialAsistencia } from '../types/types';

export const historialMock: HistorialAsistencia[] = [
  {
    comuneroId: '1',
    totalConvocatorias: 6,
    totalFaltas: 2,
    asambleasFaltadas: [
      { id: 'a1', nombre: 'Asamblea ordinaria mayo 2026', fecha: '2026-05-24' },
      { id: 'a0', nombre: 'Asamblea ordinaria enero 2026', fecha: '2026-01-18' },
    ],
  },
  {
    comuneroId: '2',
    totalConvocatorias: 6,
    totalFaltas: 0,
    asambleasFaltadas: [],
  },
  {
    comuneroId: '3',
    totalConvocatorias: 6,
    totalFaltas: 1,
    asambleasFaltadas: [
      { id: 'a2', nombre: 'Asamblea ordinaria marzo 2026', fecha: '2026-03-22' },
    ],
  },
  {
    comuneroId: '4',
    totalConvocatorias: 6,
    totalFaltas: 3,
    asambleasFaltadas: [
      { id: 'a3', nombre: 'Asamblea ordinaria noviembre 2025', fecha: '2025-11-30' },
      { id: 'a4', nombre: 'Asamblea extraordinaria diciembre 2025', fecha: '2025-12-14' },
      { id: 'a5', nombre: 'Asamblea ordinaria enero 2026', fecha: '2026-01-18' },
    ],
  },
];
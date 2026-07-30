import { Ingreso } from '../types/types';

const diasAtras = (n: number, hora: string) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() - n);
  const [h, m] = hora.split(':').map(Number);
  fecha.setHours(h, m, 0, 0);
  return fecha.toISOString();
};

export const ingresosMock: Ingreso[] = [
  { id: 'ing-001', fecha: diasAtras(0, '09:15'), tipo: 'predial', concepto: 'Predial Parcela #12', comuneroNombre: 'José Antonio Hernández', folioReferencia: 'PARCELA-12', monto: 25 },
  { id: 'ing-002', fecha: diasAtras(0, '10:40'), tipo: 'multa', concepto: 'Multa por inasistencia', comuneroNombre: 'Juan Carlos Pérez Gómez', folioReferencia: 'MUL-000123', monto: 800 },
  { id: 'ing-003', fecha: diasAtras(0, '11:05'), tipo: 'predial', concepto: 'Predial Lote #7', comuneroNombre: 'María Elena López Ruiz', folioReferencia: 'LOTE-07', monto: 20 },
  { id: 'ing-004', fecha: diasAtras(0, '13:20'), tipo: 'multa', concepto: 'Multa - Otro concepto', comuneroNombre: 'Ana Sofía Martínez Cruz', folioReferencia: 'MUL-000101', monto: 300 },

  { id: 'ing-005', fecha: diasAtras(1, '09:50'), tipo: 'multa', concepto: 'Multa por inasistencia', comuneroNombre: 'Roberto Díaz Hernández', folioReferencia: 'MUL-000119', monto: 800 },
  { id: 'ing-006', fecha: diasAtras(1, '12:10'), tipo: 'predial', concepto: 'Predial Parcela #4', comuneroNombre: 'Guadalupe Torres Silva', folioReferencia: 'PARCELA-04', monto: 30 },

  { id: 'ing-007', fecha: diasAtras(2, '10:00'), tipo: 'predial', concepto: 'Predial Parcela #9', comuneroNombre: 'José Antonio Hernández', folioReferencia: 'PARCELA-09', monto: 25 },
  { id: 'ing-008', fecha: diasAtras(2, '15:30'), tipo: 'predial', concepto: 'Predial Lote #3', comuneroNombre: 'María Elena López Ruiz', folioReferencia: 'LOTE-03', monto: 20 },

  { id: 'ing-009', fecha: diasAtras(3, '09:20'), tipo: 'multa', concepto: 'Multa por inasistencia', comuneroNombre: 'Ana Sofía Martínez Cruz', folioReferencia: 'MUL-000098', monto: 800 },

  { id: 'ing-010', fecha: diasAtras(4, '11:45'), tipo: 'predial', concepto: 'Predial Parcela #21', comuneroNombre: 'Roberto Díaz Hernández', folioReferencia: 'PARCELA-21', monto: 40 },
  { id: 'ing-011', fecha: diasAtras(4, '16:00'), tipo: 'multa', concepto: 'Multa - Otro concepto', comuneroNombre: 'Guadalupe Torres Silva', folioReferencia: 'MUL-000087', monto: 500 },

  { id: 'ing-012', fecha: diasAtras(5, '10:30'), tipo: 'predial', concepto: 'Predial Lote #15', comuneroNombre: 'Juan Carlos Pérez Gómez', folioReferencia: 'LOTE-15', monto: 20 },

  { id: 'ing-013', fecha: diasAtras(6, '09:10'), tipo: 'multa', concepto: 'Multa por inasistencia', comuneroNombre: 'María Elena López Ruiz', folioReferencia: 'MUL-000076', monto: 800 },
  { id: 'ing-014', fecha: diasAtras(6, '14:15'), tipo: 'predial', concepto: 'Predial Parcela #17', comuneroNombre: 'José Antonio Hernández', folioReferencia: 'PARCELA-17', monto: 25 },

  { id: 'ing-015', fecha: diasAtras(7, '10:00'), tipo: 'predial', concepto: 'Predial Parcela #2', comuneroNombre: 'Ana Sofía Martínez Cruz', folioReferencia: 'PARCELA-02', monto: 25 },
];
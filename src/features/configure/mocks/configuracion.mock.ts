import { ConfiguracionSistema, RegistroHistorial } from '../types/configuracion';

export const MOCK_CONFIGURACION: ConfiguracionSistema = {
  precioHectarea: 1200,
  precioLote: 5000,
  valorMultas: 800,
  tiempoToleranciaDias: 15,
};

export const MOCK_HISTORIAL: RegistroHistorial[] = [
  {
    id: '1',
    usuarioNombre: 'Administrador',
    usuarioEmail: 'admin@comisaria.gob.mx',
    usuarioIniciales: 'AD',
    configuracionNombre: 'Precio de predial por hectárea',
    valorAnterior: '$1,000.00',
    valorNuevo: '$1,200.00',
    fecha: '14/08/2026 10:30 AM',
  },
  {
    id: '2',
    usuarioNombre: 'Administrador',
    usuarioEmail: 'admin@comisaria.gob.mx',
    usuarioIniciales: 'AD',
    configuracionNombre: 'Precio de predial por lote',
    valorAnterior: '$4,500.00',
    valorNuevo: '$5,000.00',
    fecha: '14/08/2026 10:28 AM',
  },
  {
    id: '3',
    usuarioNombre: 'Administrador',
    usuarioEmail: 'admin@comisaria.gob.mx',
    usuarioIniciales: 'AD',
    configuracionNombre: 'Valor de las multas',
    valorAnterior: '$700.00',
    valorNuevo: '$800.00',
    fecha: '14/08/2026 10:25 AM',
  },
  {
    id: '4',
    usuarioNombre: 'Administrador',
    usuarioEmail: 'admin@comisaria.gob.mx',
    usuarioIniciales: 'AD',
    configuracionNombre: 'Tiempo de tolerancia',
    valorAnterior: '10 días',
    valorNuevo: '15 días',
    fecha: '14/08/2026 10:20 AM',
  },
];

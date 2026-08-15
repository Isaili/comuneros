export interface ConfiguracionSistema {
  precioHectarea: number;
  precioLote: number;
  valorMultas: number;
  tiempoToleranciaDias: number;
}

export interface RegistroHistorial {
  id: string;
  usuarioNombre: string;
  usuarioEmail: string;
  usuarioIniciales: string;
  configuracionNombre: string;
  valorAnterior: string;
  valorNuevo: string;
  fecha: string;
}
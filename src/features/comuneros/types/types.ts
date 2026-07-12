export interface Terreno {
  tipo: 'Parcela' | 'Lote';
  numero: number;
  folio: string;
  certificado?: string; // Solo para parcelas
  superficie: string;
  ubicacion: string;
}

export interface Comunero {
  id: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  edad: number;
  estadoCivil: 'Casado' | 'Soltero' | 'Divorciado' | 'Viudo';
  direccion: string;
  colonia: string;
  telefono: string;
  correo: string;
  fechaRegistro: string;
  folioComunero: string;
  fotografia: string;
  qrCode: string; // URL o placeholder del QR
  terrenos: Terreno[];
  activo: boolean;
}
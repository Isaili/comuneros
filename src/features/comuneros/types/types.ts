export interface Terreno {
  tipo: 'Parcela' | 'Lote';
  numero: number;
  folio: string;
  certificado?: string; 
  superficie: string;
  ubicacion: string;
  hectareasPosesion?: number; 
  pagoPredial?: number;        
}

export interface Comunero {
  id: string;
  nombre: string;
  apellidos: string;
  tipo: 'comunero' | 'avecindado';
  fechaNacimiento: string;
  edad: number;

  direccion: string;
  colonia: string;
  telefono: string;
  fechaRegistro: string;
  folioComunero: string;
  fotografia: string;
  qrCode: string; // URL o placeholder del QR
  terrenos: Terreno[];
  activo: boolean;
}
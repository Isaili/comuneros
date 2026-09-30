export type NivelFortaleza = 'muy-debil' | 'debil' | 'regular' | 'fuerte' | 'muy-fuerte';

export interface ResultadoEntropia {
  bits: number;
  nivel: NivelFortaleza;
  etiqueta: string;
  porcentaje: number;
}

const tamanoDelConjunto = (password: string): number => {
  let tamano = 0;
  if (/[a-z]/.test(password)) tamano += 26;
  if (/[A-Z]/.test(password)) tamano += 26;
  if (/[0-9]/.test(password)) tamano += 10;
  if (/[^a-zA-Z0-9]/.test(password)) tamano += 32;
  return tamano || 1;
};

// Entropía de Shannon aproximada: bits = longitud * log2(tamaño del alfabeto usado).
export const calcularEntropia = (password: string): ResultadoEntropia => {
  const bits = password.length === 0 ? 0 : Math.round(password.length * Math.log2(tamanoDelConjunto(password)));

  let nivel: NivelFortaleza = 'muy-debil';
  let etiqueta = 'Muy débil';
  if (bits >= 100) {
    nivel = 'muy-fuerte';
    etiqueta = 'Muy fuerte';
  } else if (bits >= 70) {
    nivel = 'fuerte';
    etiqueta = 'Fuerte';
  } else if (bits >= 45) {
    nivel = 'regular';
    etiqueta = 'Regular';
  } else if (bits >= 25) {
    nivel = 'debil';
    etiqueta = 'Débil';
  }

  const porcentaje = Math.max(4, Math.min(100, Math.round((bits / 100) * 100)));

  return { bits, nivel, etiqueta, porcentaje };
};

export const ENTROPIA_MINIMA_ACEPTABLE = 45;

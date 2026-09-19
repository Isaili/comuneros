import { Multa } from '../types/types';

// Tamaño de DISEÑO del recibo (lo usa ReciboMultaPDF)
export const PDF_WIDTH_MM = 200;
export const PDF_HEIGHT_MM = 150;

// Tamaño FINAL de la hoja del PDF (mantén siempre la proporción 4:3)
// 170mm de ancho -> 127.5mm de alto (un poco menos de media hoja carta)
export const OUTPUT_WIDTH_MM = 170;
export const OUTPUT_HEIGHT_MM = OUTPUT_WIDTH_MM * (PDF_HEIGHT_MM / PDF_WIDTH_MM);

const formatoMonto = (valor: number) =>
  valor.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const getDatosRecibo = (multa: Multa) => {
  const fechaPagoDate = multa.fechaPago ? new Date(multa.fechaPago) : null;

  const fechaPago = fechaPagoDate
    ? fechaPagoDate.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '—';

  const anio = fechaPagoDate ? fechaPagoDate.getFullYear() : new Date().getFullYear();

  return {
    fechaPago,
    concepto: multa.tipo === 'inasistencia' ? 'Multa por inasistencia' : 'Multa - Otro concepto',
    folioRecibo: multa.reciboFolio ?? `REC-MULTA-${multa.folio}-${anio}`,
    montoTexto: `$${formatoMonto(multa.cantidad)} MXN`
  };
};

export const descargarReciboPDF = async (element: HTMLElement, filename: string) => {
  const html2pdf = (await import('html2pdf.js')).default as any;


  const PX_PER_MM = 96 / 25.4; // ~3.78
  const targetWidthPx = Math.round(PDF_WIDTH_MM * PX_PER_MM);
  const targetHeightPx = Math.round(PDF_HEIGHT_MM * PX_PER_MM);

  const opciones: any = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: {
      scale: 4,
      useCORS: true,
      allowTaint: true,
      imageTimeout: 0,
      logging: false,
      backgroundColor: '#ffffff',
      width: targetWidthPx,
      height: targetHeightPx,
      windowWidth: targetWidthPx,
      windowHeight: targetHeightPx,
      onclone: (clonedDoc: Document) => {

        Array.from(clonedDoc.querySelectorAll('style, link[rel="stylesheet"]')).forEach((el) => {
          if (
            el.textContent &&
            (el.textContent.includes('lab(') ||
              el.textContent.includes('oklab(') ||
              el.textContent.includes('oklch('))
          ) {
            el.textContent = el.textContent
              .replace(/lab\([^)]+\)/g, '#000000')
              .replace(/oklab\([^)]+\)/g, '#000000')
              .replace(/oklch\([^)]+\)/g, '#000000')
              .replace(/lch\([^)]+\)/g, '#000000');
          }
        });
      }
    },

    jsPDF: { unit: 'mm', format: [OUTPUT_WIDTH_MM, OUTPUT_HEIGHT_MM], orientation: 'landscape' },
    pagebreak: { mode: 'avoid-all' }
  };

  await html2pdf().set(opciones).from(element).save();
};
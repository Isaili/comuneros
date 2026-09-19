"use client";

import React, { useState, useRef } from 'react';
import { X, CheckCircle, User, Download, ShieldCheck, Landmark } from 'lucide-react';

interface ProcesarPagoModalProps {
  type: 'parcela' | 'lote';
  item: any;
  onClose: () => void;
  onConfirmarPago: (id: string) => void;
}

export const ProcesarPagoModal: React.FC<ProcesarPagoModalProps> = ({
  type,
  item,
  onClose,
  onConfirmarPago
}) => {
  const [pagoCompletado, setPagoCompletado] = useState(item.estadoPredial === 'Pagado');
  const [generandoPDF, setGenerandoPDF] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const fechaHoy = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const hectareas = type === 'parcela' ? parseFloat(item.superficie) || 1 : 1;
  const tarifaBase = type === 'parcela' ? hectareas * 5 : 20;
  const costoFinal = tarifaBase * 2;

  const handlePagar = () => setPagoCompletado(true);
  const handleFinalizar = () => onConfirmarPago(item.id);

  // Recibo fijo a 20cm (largo) x 15cm (ancho) en el PDF final
  const PDF_WIDTH_MM = 200;
  const PDF_HEIGHT_MM = 150;

  const OUTPUT_WIDTH_MM = 170;
  const OUTPUT_HEIGHT_MM = OUTPUT_WIDTH_MM * (PDF_HEIGHT_MM / PDF_WIDTH_MM);

  const handleDescargarPDF = async () => {
    if (!pdfRef.current || generandoPDF) return;
    setGenerandoPDF(true);

    try {
      const html2pdf = (await import('html2pdf.js')).default as any;

      // Escala en px/mm alta para que logos y fondo se vean nítidos al tamaño final
      const PX_PER_MM = 96 / 25.4; // ~3.78
      const targetWidthPx = Math.round(PDF_WIDTH_MM * PX_PER_MM);
      const targetHeightPx = Math.round(PDF_HEIGHT_MM * PX_PER_MM);

      const opciones: any = {
        margin: 0,
        filename: `Recibo_Predial_${type}_${item.numero}.pdf`,
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
            // Reemplazo de colores incompatibles (lab/oklab/oklch) que rompen html2canvas
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
        // Formato exacto en mm: 200 x 150 (20 x 15 cm), landscape
        jsPDF: { unit: 'mm', format: [OUTPUT_WIDTH_MM, OUTPUT_HEIGHT_MM], orientation: 'landscape' },
        pagebreak: { mode: 'avoid-all' }
      };

      await html2pdf().set(opciones).from(pdfRef.current).save();
    } finally {
      setGenerandoPDF(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white border border-gray-100 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[92vh] sm:max-h-[unset] flex flex-col transition-all">

        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-50 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#006837]/10 flex items-center justify-center shrink-0">
              <Landmark className="w-4 h-4 text-[#006837]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-gray-900">
                {pagoCompletado ? 'Comprobante Oficial de Pago' : 'Confirmación de Liquidación'}
              </h3>
              <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
                Ref: {type.toUpperCase()} #{item.numero}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Contenido Dinámico */}
        <div className="p-4 sm:p-6 space-y-4">
          {!pagoCompletado ? (
            <>
              <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-3 sm:p-3.5 space-y-2">
                <div className="flex items-start gap-2 text-xs font-semibold text-gray-500">
                  <User className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase font-bold leading-none">Propietario</p>
                    <p className="text-gray-900 mt-1 font-bold text-xs sm:text-sm break-words">{item.propietarios.join(', ')}</p>
                  </div>
                </div>
                {type === 'parcela' && (
                  <div className="flex justify-between items-center text-xs border-t border-gray-100 pt-2 text-gray-600 font-semibold">
                    <span>Superficie Registrada</span>
                    <span className="font-bold text-gray-900">{item.superficie}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wide">Desglose de derechos</h4>
                <div className="bg-white border border-gray-100 rounded-2xl p-3 space-y-2.5 text-xs font-semibold text-gray-600">
                  <div className="flex justify-between">
                    <span>Monto Predial Base</span>
                    <span className="font-mono text-gray-900">${tarifaBase.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-red-600 bg-red-50/50 p-2.5 rounded-xl gap-2">
                    <div className="text-[10px] sm:text-[11px] leading-tight font-bold">
                      <p>Recargo por Pago Extemporáneo</p>
                      <p className="text-[8px] sm:text-[9px] text-red-500 font-semibold mt-0.5">Duplicado automático (Desp. de Marzo)</p>
                    </div>
                    <span className="font-mono font-bold shrink-0">+${tarifaBase.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#006837]/5 border border-[#006837]/10 rounded-2xl p-3.5 sm:p-4 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700">Total Neto a Recaudar:</span>
                <span className="text-lg sm:text-xl font-black text-[#006837] font-mono">${costoFinal.toFixed(2)}</span>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-center gap-2 pt-1 sm:pt-2">
                <button onClick={onClose} className="w-full sm:w-1/2 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50">
                  Cancelar
                </button>
                <button onClick={handlePagar} className="w-full sm:w-1/2 py-2.5 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Hacer Pago
                </button>
              </div>
            </>
          ) : (
            <>
              {/* ========================================== */}
              {/* 1. RECIBO PARA PANTALLA (VISTA PREVIA)      */}
              {/* ========================================== */}
              <div
                style={{ backgroundColor: '#ffffff', borderColor: '#a7f3d0' }}
                className="relative border-2 rounded-2xl p-6 sm:p-8 space-y-5 font-semibold text-xs overflow-hidden shadow-sm"
              >
                <img
                  src="/fondo.png"
                  alt="Fondo Iglesia Copainalá"
                  className="absolute inset-0 w-full h-full object-cover opacity-[0.35] pointer-events-none z-0"
                />
                {/* Marco ornamental doble */}
                <div className="absolute inset-2 border border-[#a7f3d0]/60 rounded-xl pointer-events-none z-0" />

                <div className="relative z-10 space-y-5">
                  <div style={{ borderColor: '#6ee7b7' }} className="flex items-center justify-between border-b-2 pb-3">
                    <img
                      src="/recibo3.png"
                      alt="Logo Copainalá"
                      className="w-40 h-30 object-contain shrink-0"
                    />

                    <div className="text-center flex-1 px-3">
                      <h4 style={{ color: '#064e3b' }} className="text-base font-black uppercase tracking-tight leading-snug">
                        Casa de Bienes Comunales
                      </h4>
                      <p style={{ color: '#047857' }} className="text-xs font-bold uppercase mt-0.5">Copainalá, Chiapas</p>
                      <p style={{ color: '#6b7280' }} className="text-[10px] uppercase mt-0.5 tracking-wider font-semibold">
                        Tesorería y Administración Comunal
                      </p>
                      <span
                        style={{ backgroundColor: 'rgba(236, 253, 245, 0.95)', color: '#064e3b', borderColor: '#a7f3d0' }}
                        className="inline-flex items-center gap-1 mt-1.5 border text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        Recibo Oficial de Pago
                      </span>
                    </div>

                    <div className="w-40 shrink-0 hidden sm:block" />
                  </div>

                  <div
                    style={{ backgroundColor: 'rgba(240, 253, 244, 0.9)', borderColor: '#d1fae5' }}
                    className="flex justify-between items-center text-xs p-3 rounded-xl border backdrop-blur-[1px]"
                  >
                    <div>
                      <span style={{ color: '#6b7280' }} className="font-bold">Folio: </span>
                      <span style={{ color: '#064e3b' }} className="font-black font-mono">REC-{type.toUpperCase()}-{item.numero}-2026</span>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }} className="font-bold">Fecha: </span>
                      <span style={{ color: '#111827' }} className="font-bold">{fechaHoy}</span>
                    </div>
                  </div>

                  <div style={{ borderColor: '#e5e7eb' }} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 border-y border-dashed py-3 text-left text-xs">
                    <div className="flex flex-col gap-0.5">
                      <span style={{ color: '#6b7280' }} className="text-[9px] uppercase font-bold tracking-wide">Contribuyente</span>
                      <span style={{ color: '#111827' }} className="font-bold">{item.propietarios.join(', ')}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span style={{ color: '#6b7280' }} className="text-[9px] uppercase font-bold tracking-wide">Concepto</span>
                      <span style={{ color: '#111827' }} className="font-bold">Pago Predial {type === 'parcela' ? 'Parcela' : 'Lote'} #{item.numero}</span>
                    </div>
                    {type === 'parcela' && (
                      <div className="flex flex-col gap-0.5">
                        <span style={{ color: '#6b7280' }} className="text-[9px] uppercase font-bold tracking-wide">Superficie Terreno</span>
                        <span style={{ color: '#111827' }} className="font-bold">{item.superficie}</span>
                      </div>
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span style={{ color: '#6b7280' }} className="text-[9px] uppercase font-bold tracking-wide">Forma de Pago</span>
                      <span style={{ color: '#111827' }} className="font-bold">Efectivo (Una sola exhibición)</span>
                    </div>
                  </div>

                  <div
                    style={{ backgroundColor: 'rgba(249, 250, 251, 0.55)', borderColor: '#e5e7eb' }}
                    className="flex justify-between items-center border rounded-xl p-3.5 backdrop-blur-[1px]"
                  >
                    <span style={{ color: '#374151' }} className="font-bold text-xs uppercase">Monto Total Liquidado:</span>
                    <span style={{ color: '#065f46' }} className="text-xl font-black font-mono">${costoFinal.toFixed(2)} MXN</span>
                  </div>

                  <div className="text-center space-y-3 pt-2">
                    <p style={{ color: '#374151' }} className="text-[9px] leading-tight italic font-semibold">
                      Este recibo es comprobante legal de no adeudo del impuesto predial comunal correspondiente al ejercicio fiscal actual.
                    </p>

                    <div className="pt-3 flex justify-around items-end">
                      <div style={{ borderColor: '#4b5563' }} className="border-t w-36 text-center pt-1">
                        <p style={{ color: '#1f2937' }} className="text-[8px] font-bold uppercase">Tesorero Comunal</p>
                      </div>
                      <div style={{ borderColor: '#4b5563' }} className="border-t w-36 text-center pt-1">
                        <p style={{ color: '#1f2937' }} className="text-[8px] font-bold uppercase">Firma / Sello Recibido</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ======================================================= */}
              {/* 2. RECIBO OCULTO PARA PDF — 20cm x 15cm (200mm x 150mm)  */}
              {/* ======================================================= */}
              <div className="fixed top-0 left-0 -translate-x-[9999px] pointer-events-none" aria-hidden="true">
                <div
                  ref={pdfRef}
                  style={{
                    width: `${PDF_WIDTH_MM}mm`,
                    height: `${PDF_HEIGHT_MM}mm`,
                    padding: '9mm 12mm',
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                  className="relative flex flex-col font-semibold text-[11px] overflow-hidden"
                >
                  <img
                    src="/fondo.png"
                    alt="Fondo"
                    className="absolute inset-0 w-full h-full object-cover opacity-[0.35] pointer-events-none z-0"
                  />
                  <div className="absolute inset-[3mm] border border-[#a7f3d0] rounded-2xl pointer-events-none z-0" />

                  <div className="relative z-10 flex flex-col h-full justify-between gap-3">
                    {/* Encabezado */}
                    <div>
                      <div style={{ borderColor: '#6ee7b7' }} className="flex items-center justify-between border-b-2 pb-2.5">
                        <img
                          src="/recibo3.png"
                          alt="Logo Copainalá"
                          className="w-48 h-30 object-contain shrink-0"
                        />

                        <div className="text-center flex-1 px-3">
                          <h4 style={{ color: '#064e3b' }} className="text-sm font-black uppercase tracking-tight leading-tight">
                            Casa de Bienes Comunales
                          </h4>
                          <p style={{ color: '#047857' }} className="text-[10px] font-bold uppercase mt-0.5">Copainalá, Chiapas</p>
                          <p style={{ color: '#6b7280' }} className="text-[8.5px] uppercase mt-0.5 tracking-wider font-semibold">
                            Tesorería y Administración Comunal
                          </p>
                          <span
                            style={{ backgroundColor: 'rgba(236, 253, 245, 0.95)', color: '#064e3b', borderColor: '#a7f3d0' }}
                            className="inline-block mt-1 border text-[8.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                          >
                            Recibo Oficial de Pago
                          </span>
                        </div>

                        <div className="w-44 shrink-0" />
                      </div>

                      <div
                        style={{ backgroundColor: 'rgba(240, 253, 244, 0.9)', borderColor: '#d1fae5' }}
                        className="flex justify-between items-center text-[10px] p-2 mt-2.5 rounded-lg border"
                      >
                        <div>
                          <span style={{ color: '#6b7280' }} className="font-bold">Folio: </span>
                          <span style={{ color: '#064e3b' }} className="font-black font-mono">REC-{type.toUpperCase()}-{item.numero}-2026</span>
                        </div>
                        <div>
                          <span style={{ color: '#6b7280' }} className="font-bold">Fecha: </span>
                          <span style={{ color: '#111827' }} className="font-bold">{fechaHoy}</span>
                        </div>
                      </div>

                      <div
                        style={{ borderColor: '#e5e7eb' }}
                        className="grid grid-cols-2 gap-x-5 gap-y-1.5 border-y border-dashed py-2.5 mt-2.5 text-left text-[10px]"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span style={{ color: '#6b7280' }} className="text-[8px] uppercase font-bold tracking-wide">Contribuyente</span>
                          <span style={{ color: '#111827' }} className="font-bold">{item.propietarios.join(', ')}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span style={{ color: '#6b7280' }} className="text-[8px] uppercase font-bold tracking-wide">Concepto</span>
                          <span style={{ color: '#111827' }} className="font-bold">Pago Predial {type === 'parcela' ? 'Parcela' : 'Lote'} #{item.numero}</span>
                        </div>
                        {type === 'parcela' && (
                          <div className="flex flex-col gap-0.5">
                            <span style={{ color: '#6b7280' }} className="text-[8px] uppercase font-bold tracking-wide">Superficie Terreno</span>
                            <span style={{ color: '#111827' }} className="font-bold">{item.superficie}</span>
                          </div>
                        )}
                        <div className="flex flex-col gap-0.5">
                          <span style={{ color: '#6b7280' }} className="text-[8px] uppercase font-bold tracking-wide">Forma de Pago</span>
                          <span style={{ color: '#111827' }} className="font-bold">Efectivo (Una sola exhibición)</span>
                        </div>
                      </div>
                    </div>

                    {/* Total */}
                    <div
                      style={{ backgroundColor: 'rgba(249, 250, 251, 0.55)', borderColor: '#e5e7eb' }}
                      className="flex justify-between items-center border rounded-xl p-2.5"
                    >
                      <span style={{ color: '#374151' }} className="font-bold text-[10px] uppercase">Monto Total Liquidado:</span>
                      <span style={{ color: '#065f46' }} className="text-lg font-black font-mono">${costoFinal.toFixed(2)} MXN</span>
                    </div>

                    {/* Pie: leyenda y firmas */}
                    <div className="text-center space-y-2">
                      <p style={{ color: '#374151' }} className="text-[8px] leading-tight italic font-semibold px-4">
                        Este recibo es comprobante legal de no adeudo del impuesto predial comunal correspondiente al ejercicio fiscal actual.
                      </p>

                      <div className="pt-1.5 flex justify-around items-end">
                        <div style={{ borderColor: '#4b5563' }} className="border-t w-32 text-center pt-1">
                          <p style={{ color: '#1f2937' }} className="text-[7.5px] font-bold uppercase">Tesorero Comunal</p>
                        </div>
                        <div style={{ borderColor: '#4b5563' }} className="border-t w-32 text-center pt-1">
                          <p style={{ color: '#1f2937' }} className="text-[7.5px] font-bold uppercase">Firma / Sello Recibido</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button
                  onClick={handleDescargarPDF}
                  disabled={generandoPDF}
                  className="w-full sm:w-1/2 py-3 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  {generandoPDF ? 'Generando PDF…' : 'Descargar Recibo (PDF)'}
                </button>
                <button onClick={handleFinalizar} className="w-full sm:w-1/2 py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold transition-colors">
                  Listo / Finalizar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
"use client";

import React, { useState, useRef } from 'react';
import { X, CheckCircle, User, Download } from 'lucide-react';

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

  const handleDescargarPDF = async () => {
    if (!pdfRef.current) return;

    const html2pdf = (await import('html2pdf.js')).default as any;

    const opciones: any = {
      margin: 0,
      filename: `Recibo_Predial_${type}_${item.numero}.pdf`,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { 
        scale: 4, 
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc: Document) => {
          // Reemplazo de colores incompatibles
          Array.from(clonedDoc.querySelectorAll('style, link[rel="stylesheet"]')).forEach((el) => {
            if (el.textContent && (el.textContent.includes('lab(') || el.textContent.includes('oklab(') || el.textContent.includes('oklch('))) {
              el.textContent = el.textContent
                .replace(/lab\([^)]+\)/g, '#000000')
                .replace(/oklab\([^)]+\)/g, '#000000')
                .replace(/oklch\([^)]+\)/g, '#000000')
                .replace(/lch\([^)]+\)/g, '#000000');
            }
          });
        }
      }, 
      jsPDF: { unit: 'mm', format: [140, 100], orientation: 'landscape' },
      pagebreak: { mode: 'avoid-all' }
    };

    html2pdf().set(opciones).from(pdfRef.current).save();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white border border-gray-100 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-3xl overflow-y-auto max-h-[92vh] sm:max-h-[unset] flex flex-col transition-all">
        
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-50 bg-gray-50/50">
          <div>
            <h3 className="text-xs sm:text-sm font-black text-gray-900">
              {pagoCompletado ? 'Comprobante Oficial de Pago' : 'Confirmación de Liquidación'}
            </h3>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">
              Ref: {type.toUpperCase()} #{item.numero}
            </p>
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
              {/* 1. RECIBO PARA PANTALLA (FRONT-END GRANDE) */}
              {/* ========================================== */}
              <div 
                style={{ backgroundColor: '#ffffff', borderColor: '#a7f3d0' }}
                className="relative border-2 rounded-2xl p-6 sm:p-7 space-y-5 font-semibold text-xs overflow-hidden shadow-sm"
              >
                <img 
                  src="/fondo.png" 
                  alt="Fondo Iglesia Copainalá" 
                  className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none z-0" 
                />

                <div className="relative z-10 space-y-5">
                  <div style={{ borderColor: '#6ee7b7' }} className="flex items-center justify-between border-b-2 pb-3">
                    <img 
                      src="/recibo2.png" 
                      alt="Logo Copainalá" 
                      className="w-20 h-20 object-contain shrink-0" 
                    />
                    
                    <div className="text-center flex-1 px-3">
                      <h4 style={{ color: '#064e3b' }} className="text-base font-black uppercase tracking-tight">Casa de Bienes Comunales</h4>
                      <p style={{ color: '#047857' }} className="text-xs font-bold uppercase mt-0.5">Copainalá, Chiapas</p>
                      <p style={{ color: '#6b7280' }} className="text-[10px] uppercase mt-0.5 tracking-wider font-semibold">Tesorería y Administración Comunal</p>
                      <span style={{ backgroundColor: 'rgba(236, 253, 245, 0.9)', color: '#064e3b', borderColor: '#a7f3d0' }} className="inline-block mt-1.5 border text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                        Recibo Oficial de Pago
                      </span>
                    </div>

                    <div className="w-20 shrink-0 hidden sm:block"></div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(240, 253, 244, 0.85)', borderColor: '#d1fae5' }} className="flex justify-between items-center text-xs p-3 rounded-xl border backdrop-blur-[1px]">
                    <div>
                      <span style={{ color: '#6b7280' }} className="font-bold">Folio: </span>
                      <span style={{ color: '#064e3b' }} className="font-black font-mono">REC-{type.toUpperCase()}-{item.numero}-2026</span>
                    </div>
                    <div>
                      <span style={{ color: '#6b7280' }} className="font-bold">Fecha: </span>
                      <span style={{ color: '#111827' }} className="font-bold">{fechaHoy}</span>
                    </div>
                  </div>

                  <div style={{ borderColor: '#d1d5db' }} className="space-y-2 border-b border-dashed pb-3 text-left text-xs">
                    <div style={{ borderColor: 'rgba(243, 244, 246, 0.8)' }} className="flex justify-between gap-2 border-b pb-1">
                      <span style={{ color: '#4b5563' }} className="font-semibold">Contribuyente:</span>
                      <span style={{ color: '#111827' }} className="font-bold text-right">{item.propietarios.join(', ')}</span>
                    </div>
                    <div style={{ borderColor: 'rgba(243, 244, 246, 0.8)' }} className="flex justify-between gap-2 border-b pb-1">
                      <span style={{ color: '#4b5563' }} className="font-semibold">Concepto:</span>
                      <span style={{ color: '#111827' }} className="font-bold text-right">Pago Predial {type === 'parcela' ? 'Parcela' : 'Lote'} #{item.numero}</span>
                    </div>
                    {type === 'parcela' && (
                      <div style={{ borderColor: 'rgba(243, 244, 246, 0.8)' }} className="flex justify-between gap-2 border-b pb-1">
                        <span style={{ color: '#4b5563' }} className="font-semibold">Superficie Terreno:</span>
                        <span style={{ color: '#111827' }} className="font-bold">{item.superficie}</span>
                      </div>
                    )}
                    <div style={{ borderColor: 'rgba(243, 244, 246, 0.8)' }} className="flex justify-between gap-2 border-b pb-1">
                      <span style={{ color: '#4b5563' }} className="font-semibold">Forma de Pago:</span>
                      <span style={{ color: '#111827' }} className="font-bold">Efectivo (Una sola exhibición)</span>
                    </div>
                  </div>

                  <div style={{ backgroundColor: 'rgba(249, 250, 251, 0.85)', borderColor: '#e5e7eb' }} className="flex justify-between items-center border rounded-xl p-3 backdrop-blur-[1px]">
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
              {/* 2. RECIBO OCULTO DEDICADO SOLO PARA DESCARGAR PDF       */}
              {/* ======================================================= */}
              <div className="absolute top-[-9999px] left-[-9999px]">
                <div 
                  ref={pdfRef}
                  style={{ 
                    width: '140mm', 
                    height: '100mm', 
                    padding: '6mm 8mm', 
                    backgroundColor: '#ffffff',
                    boxSizing: 'border-box'
                  }}
                  className="relative space-y-2 font-semibold text-[10px] overflow-hidden"
                >
                  <img 
                    src="/fondo.png" 
                    alt="Fondo" 
                    className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none z-0" 
                  />

                  <div className="relative z-10 space-y-2">
                    <div style={{ borderColor: '#6ee7b7' }} className="flex items-center justify-between border-b-2 pb-1.5">
                      <img 
                        src="/recibo2.png" 
                        alt="Logo Copainalá" 
                        className="w-12 h-12 object-contain shrink-0" 
                      />
                      
                      <div className="text-center flex-1 px-2">
                        <h4 style={{ color: '#064e3b' }} className="text-xs font-black uppercase tracking-tight leading-none">Casa de Bienes Comunales</h4>
                        <p style={{ color: '#047857' }} className="text-[9px] font-bold uppercase mt-0.5">Copainalá, Chiapas</p>
                        <p style={{ color: '#6b7280' }} className="text-[7.5px] uppercase mt-0.5 tracking-wider font-semibold">Tesorería y Administración Comunal</p>
                        <span style={{ backgroundColor: 'rgba(236, 253, 245, 0.9)', color: '#064e3b', borderColor: '#a7f3d0' }} className="inline-block mt-0.5 border text-[7.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                          Recibo Oficial de Pago
                        </span>
                      </div>

                      <div className="w-12 shrink-0"></div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(240, 253, 244, 0.85)', borderColor: '#d1fae5' }} className="flex justify-between items-center text-[9px] p-1.5 rounded-lg border">
                      <div>
                        <span style={{ color: '#6b7280' }} className="font-bold">Folio: </span>
                        <span style={{ color: '#064e3b' }} className="font-black font-mono">REC-{type.toUpperCase()}-{item.numero}-2026</span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }} className="font-bold">Fecha: </span>
                        <span style={{ color: '#111827' }} className="font-bold">{fechaHoy}</span>
                      </div>
                    </div>

                    <div style={{ borderColor: '#d1d5db' }} className="space-y-1 border-b border-dashed pb-1.5 text-left text-[9.5px]">
                      <div style={{ borderColor: 'rgba(243, 244, 246, 0.8)' }} className="flex justify-between gap-2 border-b pb-0.5">
                        <span style={{ color: '#4b5563' }} className="font-semibold">Contribuyente:</span>
                        <span style={{ color: '#111827' }} className="font-bold text-right">{item.propietarios.join(', ')}</span>
                      </div>
                      <div style={{ borderColor: 'rgba(243, 244, 246, 0.8)' }} className="flex justify-between gap-2 border-b pb-0.5">
                        <span style={{ color: '#4b5563' }} className="font-semibold">Concepto:</span>
                        <span style={{ color: '#111827' }} className="font-bold text-right">Pago Predial {type === 'parcela' ? 'Parcela' : 'Lote'} #{item.numero}</span>
                      </div>
                      {type === 'parcela' && (
                        <div style={{ borderColor: 'rgba(243, 244, 246, 0.8)' }} className="flex justify-between gap-2 border-b pb-0.5">
                          <span style={{ color: '#4b5563' }} className="font-semibold">Superficie Terreno:</span>
                          <span style={{ color: '#111827' }} className="font-bold">{item.superficie}</span>
                        </div>
                      )}
                      <div style={{ borderColor: 'rgba(243, 244, 246, 0.8)' }} className="flex justify-between gap-2 border-b pb-0.5">
                        <span style={{ color: '#4b5563' }} className="font-semibold">Forma de Pago:</span>
                        <span style={{ color: '#111827' }} className="font-bold">Efectivo (Una sola exhibición)</span>
                      </div>
                    </div>

                    <div style={{ backgroundColor: 'rgba(249, 250, 251, 0.85)', borderColor: '#e5e7eb' }} className="flex justify-between items-center border rounded-lg p-1.5">
                      <span style={{ color: '#374151' }} className="font-bold text-[8.5px] uppercase">Monto Total Liquidado:</span>
                      <span style={{ color: '#065f46' }} className="text-sm font-black font-mono">${costoFinal.toFixed(2)} MXN</span>
                    </div>

                    <div className="text-center space-y-1 pt-0.5">
                      <p style={{ color: '#374151' }} className="text-[7px] leading-tight italic font-semibold">
                        Este recibo es comprobante legal de no adeudo del impuesto predial comunal correspondiente al ejercicio fiscal actual.
                      </p>
                      
                      <div className="pt-2 flex justify-around items-end">
                        <div style={{ borderColor: '#4b5563' }} className="border-t w-24 text-center pt-0.5">
                          <p style={{ color: '#1f2937' }} className="text-[6.5px] font-bold uppercase">Tesorero Comunal</p>
                        </div>
                        <div style={{ borderColor: '#4b5563' }} className="border-t w-24 text-center pt-0.5">
                          <p style={{ color: '#1f2937' }} className="text-[6.5px] font-bold uppercase">Firma / Sello Recibido</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Botones de Acción */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <button onClick={handleDescargarPDF} className="w-full sm:w-1/2 py-3 border border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
                  <Download className="w-4 h-4 text-emerald-600" />
                  Descargar Recibo (PDF)
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
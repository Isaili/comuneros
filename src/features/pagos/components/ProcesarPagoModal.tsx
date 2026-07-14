"use client";

import React, { useState } from 'react';
import { X, CheckCircle, Receipt, User, Printer } from 'lucide-react';

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
  const fechaHoy = new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // 1. Obtener la superficie numérica si es parcela (Ej: "2.50 ha" -> 2.50)
  const hectareas = type === 'parcela' ? parseFloat(item.superficie) || 1 : 1;

  // 2. Determinar tarifas base
  // Parcelas: $5 por ha | Lotes: $20 tarifa fija
  const tarifaBase = type === 'parcela' ? hectareas * 5 : 20;

  // 3. Aplicar regla del recargo por mes (Julio > Marzo), por ende se duplica
  const costoFinal = tarifaBase * 2; 

  const handlePagar = () => {
    setPagoCompletado(true);
  };

  const handleFinalizar = () => {
    onConfirmarPago(item.id);
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4 print:bg-white print:p-0">
      
      {/* Contenedor principal del Modal */}
      <div className="bg-white border border-gray-100 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md overflow-y-auto max-h-[90vh] sm:max-h-[unset] flex flex-col animate-scale-up print:shadow-none print:border-none print:w-full print:max-w-full">
        
        {/* Cabecera (Se oculta al imprimir) */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-50 bg-gray-50/50 print:hidden">
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
        <div className="p-4 sm:p-5 space-y-4 print:p-0">
          
          {!pagoCompletado ? (
            /* ================= VISTA DE COBRO ANTES DEL PAGO ================= */
            <>
              {/* Información del Contribuyente */}
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

              {/* Desglose Matemático */}
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

              {/* Banner de Modalidad Única */}
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-3 sm:p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs sm:text-sm">$</div>
                <div>
                  <p className="text-xs font-bold text-emerald-900">Una sola exhibición</p>
                  <p className="text-[9px] sm:text-[10px] text-emerald-700 font-semibold mt-0.5">La liquidación debe ser cubierta en efectivo al momento.</p>
                </div>
              </div>

              {/* Gran Total */}
              <div className="bg-[#006837]/5 border border-[#006837]/10 rounded-2xl p-3.5 sm:p-4 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700">Total Neto a Recaudar:</span>
                <span className="text-lg sm:text-xl font-black text-[#006837] font-mono">${costoFinal.toFixed(2)}</span>
              </div>

              {/* Acciones de Cobro */}
              <div className="flex flex-col-reverse sm:flex-row items-center gap-2 pt-1 sm:pt-2">
                <button
                  onClick={onClose}
                  className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handlePagar}
                  className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Hacer Pago
                </button>
              </div>
            </>
          ) : (
            /* ================= VISTA COMPLEMENTARIA: RECIBO IMPRIMIBLE ================= */
            <>
              {/* Recibo Formato Ticket */}
              <div className="border border-dashed border-gray-200 rounded-2xl p-4 sm:p-5 bg-slate-50/50 space-y-4 text-center font-semibold text-xs text-gray-500 relative print:border-none print:bg-white print:p-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 bg-emerald-100 text-emerald-800 text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full print:hidden">
                  Transacción Exitosa
                </div>

                <div className="pt-2 flex flex-col items-center">
                  <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 mb-2" />
                  <h4 className="text-xs sm:text-sm font-black text-gray-900">TESORERÍA EJIDAL</h4>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase mt-0.5">Recibo de pago predial</p>
                </div>

                <div className="border-t border-b border-dashed border-gray-200 py-3 sm:py-3.5 space-y-2 text-left font-semibold">
                  <div className="flex justify-between gap-4"><span className="text-gray-400">Contribuyente:</span><span className="text-gray-900 font-bold text-right truncate max-w-[180px] sm:max-w-[220px]">{item.propietarios.join(', ')}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-gray-400">Concepto:</span><span className="text-gray-900 text-right">Predial {type === 'parcela' ? 'Parcela' : 'Lote'} #{item.numero}</span></div>
                  {type === 'parcela' && <div className="flex justify-between"><span className="text-gray-400">Superficie:</span><span className="text-gray-900">{item.superficie}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-400">Fecha de Pago:</span><span className="text-gray-900">{fechaHoy}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Forma de Pago:</span><span className="text-gray-900">Efectivo</span></div>
                </div>

                <div className="flex justify-between items-center bg-white border border-gray-100 rounded-xl p-3">
                  <span className="font-bold text-gray-700 text-xs">Monto Cobrado</span>
                  <span className="text-sm sm:text-base font-black text-emerald-700 font-mono">${costoFinal.toFixed(2)}</span>
                </div>

                <p className="text-[8px] sm:text-[9px] text-gray-400 leading-normal pt-1">
                  Este documento sirve como comprobante oficial de no adeudo para el ejercicio fiscal actual de 2026.
                </p>
              </div>

              {/* Botonera Recibo (Oculta por completo al imprimir) */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1 sm:pt-2 print:hidden">
                <button
                  onClick={handleImprimir}
                  className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4 text-gray-500" />
                  Imprimir Recibo
                </button>
                <button
                  onClick={handleFinalizar}
                  className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                >
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
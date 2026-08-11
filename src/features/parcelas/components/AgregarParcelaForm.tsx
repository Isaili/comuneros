"use client";

import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Calculator, Landmark, FileText, History, DollarSign } from 'lucide-react';
import { Parcela, PropietarioHistorico, PredialHistorico } from '../types/domain.types';
import { FechaTextInput } from './shared/Fechatextinput';

export interface ParcelaFormPayload {
  numero: string;
  superficieHa: number;
  observaciones: string;
  estadoPredial: 'Pagado' | 'Pagar';
  historialPropietarios: PropietarioHistorico[];
  historialPrediales: PredialHistorico[];
}

interface AgregarParcelaFormProps {
  onClose: () => void;
  onGuardar: (payload: ParcelaFormPayload) => void;
  parcelaAEditar?: Parcela | null;
  guardando?: boolean;
}

export const AgregarParcelaForm: React.FC<AgregarParcelaFormProps> = ({
  onClose,
  onGuardar,
  parcelaAEditar,
  guardando = false,
}) => {
  const esEdicion = !!parcelaAEditar;

  const [superficie, setSuperficie] = useState<number>(0);
  const [numeroParcela, setNumeroParcela] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [estadoPredialActual, setEstadoPredialActual] = useState<'Pagado' | 'Pagar'>('Pagar');

  const [historialPropietarios, setHistorialPropietarios] = useState<PropietarioHistorico[]>([]);
  const [historialPrediales, setHistorialPrediales] = useState<PredialHistorico[]>([]);

  useEffect(() => {
    if (parcelaAEditar) {
      setNumeroParcela(parcelaAEditar.numero);
      setSuperficie(parcelaAEditar.superficieHa);
      setObservaciones(parcelaAEditar.observaciones);
      setEstadoPredialActual(parcelaAEditar.estadoPredial);
      setHistorialPropietarios(parcelaAEditar.historialPropietarios || []);
      setHistorialPrediales(parcelaAEditar.historialPrediales || []);
    } else {
      setNumeroParcela('');
      setSuperficie(0);
      setObservaciones('');
      setEstadoPredialActual('Pagar');
      setHistorialPropietarios([]);
      setHistorialPrediales([]);
    }
  }, [parcelaAEditar]);

  const costoPorHectarea = 5;
  const pagoPredialCalculado = superficie * costoPorHectarea;

  const agregarPropietarioHistorico = () => {
    setHistorialPropietarios(prev => [...prev, { nombre: '', certificado: '', fechaAdquisicion: '', fechaCesion: '', actoJuridico: 'Cesión de derechos', adquirente: '' }]);
  };
  const eliminarPropietarioHistorico = (index: number) => {
    setHistorialPropietarios(prev => prev.filter((_, i) => i !== index));
  };
  const actualizarPropietarioHistorico = (index: number, campo: keyof PropietarioHistorico, valor: string) => {
    setHistorialPropietarios(prev => prev.map((item, i) => i === index ? { ...item, [campo]: valor } : item));
  };

  const agregarPredialHistorico = () => {
    const ultimoAnio = historialPrediales.length > 0 ? Math.min(...historialPrediales.map(p => p.anio)) - 1 : new Date().getFullYear() - 1;
    setHistorialPrediales(prev => [...prev, { anio: ultimoAnio, monto: pagoPredialCalculado, estado: 'Pagar' }]);
  };
  const eliminarPredialHistorico = (index: number) => {
    setHistorialPrediales(prev => prev.filter((_, i) => i !== index));
  };
  const actualizarPredialHistorico = (index: number, campo: keyof PredialHistorico, valor: any) => {
    setHistorialPrediales(prev => prev.map((item, i) => i === index ? { ...item, [campo]: valor } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar({
      numero: numeroParcela,
      superficieHa: superficie,
      observaciones,
      estadoPredial: estadoPredialActual,
      historialPropietarios,
      historialPrediales,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-gray-700 text-xs font-semibold">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <span className="p-1.5 bg-[#006837]/10 text-[#006837] rounded-lg">
                <Landmark className="w-4 h-4" />
              </span>
              {esEdicion ? 'Modificar Expediente de Parcela Comunal' : 'Alta de Parcela Comunal'}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Registro físico y catastral de la parcela. La asignación de titular(es) se realiza por separado, desde el expediente.
            </p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Identificador de sistema</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[#006837] font-black text-sm truncate">
                {parcelaAEditar?.id ?? 'Se asigna al guardar'}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Nº de Parcela (En Certificado) *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" required placeholder="Ej. Parcela 155" value={numeroParcela} onChange={(e) => setNumeroParcela(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none focus:border-[#006837]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Superficie (Hectáreas) *</label>
              <div className="relative">
                <input type="number" step="0.0001" min="0.0001" required placeholder="Ej. 2.50" value={superficie || ''} onChange={(e) => setSuperficie(Number(e.target.value))} className="w-full pr-12 pl-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none focus:border-[#006837]" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">ha</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Estado Predial Año Actual</label>
              <select value={estadoPredialActual} onChange={(e) => setEstadoPredialActual(e.target.value as 'Pagado' | 'Pagar')} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none cursor-pointer focus:border-[#006837]">
                <option value="Pagar">Pendiente de Pago (Pagar)</option>
                <option value="Pagado">Liquidado (Pagado)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-[#006837]/5 p-4 rounded-xl border border-[#006837]/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#006837]/10 text-[#006837] rounded-xl"><Calculator className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Tasa Predial Calculada ($5/ha)</p>
                <p className="text-base font-black text-gray-900">${pagoPredialCalculado.toFixed(2)} MXN</p>
              </div>
            </div>
            <div className="text-right">
              {(parcelaAEditar?.titularesCount || 0) > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                  {parcelaAEditar!.titularesCount} titular(es) asignado(s)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                  Sin titular asignado — se asigna después de guardar
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider flex items-center gap-1 text-amber-800">
                <History className="w-4 h-4" /> Historial Registral de Dueños Anteriores
              </h4>
              <button type="button" onClick={agregarPropietarioHistorico} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100/60">
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Registrar Dueño Pasado
              </button>
            </div>

            <div className="border border-gray-100 rounded-xl shadow-xs overflow-hidden bg-white">
              {historialPropietarios.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-amber-50/40 text-gray-500 font-black uppercase border-b border-gray-100">
                      <th className="p-3">Nombre del Ex-Dueño</th>
                      <th className="p-3 w-[120px]">Certificado</th>
                      <th className="p-3 w-[120px]">Adquisición</th>
                      <th className="p-3 w-[120px]">Fecha Cesión</th>
                      <th className="p-3 w-[140px]">Acto de Transmisión</th>
                      <th className="p-3">Adquirente</th>
                      <th className="p-3 w-[50px] text-center">Quitar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {historialPropietarios.map((hist, index) => (
                      <tr key={index} className="hover:bg-amber-50/10">
                        <td className="p-2"><input type="text" required value={hist.nombre} onChange={(e) => actualizarPropietarioHistorico(index, 'nombre', e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800 font-bold focus:border-amber-500" /></td>
                        <td className="p-2"><input type="text" required value={hist.certificado} onChange={(e) => actualizarPropietarioHistorico(index, 'certificado', e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800" /></td>
                        <td className="p-2">
                          <FechaTextInput
                            required
                            value={hist.fechaAdquisicion}
                            onChange={(v) => actualizarPropietarioHistorico(index, 'fechaAdquisicion', v)}
                            className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800 text-center"
                          />
                        </td>
                        <td className="p-2">
                          <FechaTextInput
                            required
                            value={hist.fechaCesion}
                            onChange={(v) => actualizarPropietarioHistorico(index, 'fechaCesion', v)}
                            className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800 text-center"
                          />
                        </td>
                        <td className="p-2">
                          <select value={hist.actoJuridico} onChange={(e) => actualizarPropietarioHistorico(index, 'actoJuridico', e.target.value)} className="w-full px-1 py-2 bg-white border border-gray-200 rounded-lg outline-none cursor-pointer">
                            <option value="Cesión de derechos">Cesión de Derechos</option>
                            <option value="Sucesión Hereditaria">Sucesión Hereditaria</option>
                            <option value="Compraventa">Compraventa Contractual</option>
                            <option value="Donación Directa">Donación Directa</option>
                          </select>
                        </td>
                        <td className="p-2"><input type="text" required value={hist.adquirente} onChange={(e) => actualizarPropietarioHistorico(index, 'adquirente', e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800" /></td>
                        <td className="p-2 text-center">
                          <button type="button" onClick={() => eliminarPropietarioHistorico(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center text-gray-400 font-medium text-[11px]">Sin transferencias registradas.</div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider flex items-center gap-1 text-red-800">
                <DollarSign className="w-4 h-4" /> Historial de Pagos Prediales
              </h4>
              <button type="button" onClick={agregarPredialHistorico} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-800 border border-red-200 rounded-lg hover:bg-red-100/60">
                <Plus className="w-3.5 h-3.5 stroke-[3]" /> Cargar Año Anterior
              </button>
            </div>

            <div className="border border-gray-100 rounded-xl shadow-xs overflow-hidden bg-white max-w-2xl">
              {historialPrediales.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-red-50/40 text-gray-500 font-black uppercase border-b border-gray-100">
                      <th className="p-3 w-[150px]">Año Predial</th>
                      <th className="p-3 w-[180px]">Monto del Derecho ($)</th>
                      <th className="p-3">Estado del Cobro</th>
                      <th className="p-3 w-[60px] text-center">Quitar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {historialPrediales.map((pred, index) => (
                      <tr key={index} className="hover:bg-red-50/10">
                        <td className="p-2"><input type="number" required value={pred.anio} onChange={(e) => actualizarPredialHistorico(index, 'anio', Number(e.target.value))} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-center font-bold text-gray-800 outline-none" /></td>
                        <td className="p-2"><input type="number" step="0.01" required value={pred.monto} onChange={(e) => actualizarPredialHistorico(index, 'monto', Number(e.target.value))} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-gray-800 outline-none font-mono" /></td>
                        <td className="p-2">
                          <select value={pred.estado} onChange={(e) => actualizarPredialHistorico(index, 'estado', e.target.value)} className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg outline-none font-bold cursor-pointer">
                            <option value="Pagado">PAGADO</option>
                            <option value="Pagar"> POR PAGAR</option>
                          </select>
                        </td>
                        <td className="p-2 text-center">
                          <button type="button" onClick={() => eliminarPredialHistorico(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center text-gray-400 font-medium text-[11px]">Sin deudas ni pagos previos.</div>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-500 font-bold block">Observaciones</label>
            <textarea rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none focus:border-[#006837]" />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row items-center gap-2 shrink-0">
          <button type="button" onClick={onClose} className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl font-bold text-gray-500 bg-white hover:bg-gray-50">Cancelar</button>
          <button type="submit" disabled={guardando} className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#006837] hover:bg-[#00522b] disabled:opacity-60 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs">
            <Save className="w-4 h-4" />
            {guardando ? 'Guardando...' : esEdicion ? 'Guardar Cambios' : 'Registrar Parcela'}
          </button>
        </div>
      </form>
    </div>
  );
};
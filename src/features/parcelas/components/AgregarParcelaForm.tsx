"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Plus, Trash2, Calculator, Landmark, FileText, Calendar, AlertCircle, Search, History, DollarSign, Check, ChevronDown } from 'lucide-react';

import { Comunero } from '../../comuneros/types/types';

// Importaciones modularizadas desde tu archivo de tipos de parcelas
import { 
  Parcela, 
  TitularFila, 
  PropietarioHistoricoFila, 
  PredialHistoricoFila 
} from '../types/typesParcela';

interface AgregarParcelaFormProps {
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onGuardar: (nuevaParcela: any) => void;
  parcelaAEditar?: Parcela | null;
}

export const AgregarParcelaForm: React.FC<AgregarParcelaFormProps> = ({
  comunerosRegistrados,
  onClose,
  onGuardar,
  parcelaAEditar
}) => {
  // 1. Estados principales de la Parcela
  const [superficie, setSuperficie] = useState<number>(0);
  const [tieneMultiplesTitulares, setTieneMultiplesTitulares] = useState<boolean>(false);
  const [numeroParcela, setNumeroParcela] = useState<string>('');
  const [fechaRegistro, setFechaRegistro] = useState<string>(new Date().toISOString().split('T')[0]);
  const [observaciones, setObservaciones] = useState<string>('');
  const [folioInterno, setFolioInterno] = useState<string>('');
  const [estadoPredialActual, setEstadoPredialActual] = useState<'Pagado' | 'Pagar'>('Pagar');

  // 2. Estado para Titulares Activos
  const [titulares, setTitulares] = useState<TitularFila[]>([
    { comuneroId: '', nombreCompleto: '', certificado: '', porcentajePosesion: 100, calidadAgraria: 'Ejidatario', actoJuridico: 'Asignación', vigencia: 'Vigente' }
  ]);

  // 3. Historiales
  const [historialPropietarios, setHistorialPropietarios] = useState<PropietarioHistoricoFila[]>([]);
  const [historialPrediales, setHistorialPrediales] = useState<PredialHistoricoFila[]>([]);

  // Estados de control para el buscador con lupa por fila
  const [busquedas, setBusquedas] = useState<{ [key: number]: string }>({});
  const [menusAbiertos, setMenusAbiertos] = useState<{ [key: number]: boolean }>({});
  const [errorPorcentaje, setErrorPorcentaje] = useState<string>('');
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // 🔄 Efecto de rellenado automático (Edición vs Creación)
  useEffect(() => {
    if (parcelaAEditar) {
      const numSuperficie = Number(parcelaAEditar.superficie.replace(' ha', ''));
      
      setFolioInterno(parcelaAEditar.id ? `P-${parcelaAEditar.id}` : 'P-000');
      setNumeroParcela(parcelaAEditar.numero);
      setSuperficie(isNaN(numSuperficie) ? 0 : numSuperficie);
      setEstadoPredialActual(parcelaAEditar.estadoPredial as 'Pagado' | 'Pagar');
      setHistorialPropietarios(parcelaAEditar.historialPropietarios || []);
      setHistorialPrediales(parcelaAEditar.historialPrediales || []);
      
      if (parcelaAEditar.propietarios && parcelaAEditar.propietarios.length > 0) {
        setTieneMultiplesTitulares(parcelaAEditar.propietarios.length > 1);
        
        const filasMapeadas = parcelaAEditar.propietarios.map(nombreCompleto => {
          const comuneroEncontrado = comunerosRegistrados.find(
            c => `${c.nombre} ${c.apellidos}`.toLowerCase() === nombreCompleto.toLowerCase()
          );
          
          return {
            comuneroId: comuneroEncontrado ? comuneroEncontrado.id : '',
            nombreCompleto: nombreCompleto,
            certificado: 'CERT-EXISTENTE', 
            porcentajePosesion: Math.floor(100 / parcelaAEditar.propietarios.length),
            calidadAgraria: 'Ejidatario',
            actoJuridico: 'Asignación',
            vigencia: 'Vigente'
          };
        });
        setTitulares(filasMapeadas);
      }
    } else {
      const numeroAleatorio = Math.floor(100 + Math.random() * 900);
      setFolioInterno(`P-${numeroAleatorio}`);
    }
  }, [parcelaAEditar, comunerosRegistrados]);

  // Cerrar buscadores al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.keys(dropdownRefs.current).forEach((key) => {
        const index = Number(key);
        if (dropdownRefs.current[index] && !dropdownRefs.current[index]?.contains(event.target as Node)) {
          setMenusAbiertos(prev => ({ ...prev, [index]: false }));
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const costoPorHectarea = 5;
  const pagoPredialCalculado = superficie * costoPorHectarea;

  const handleToggleMultiples = (multiple: boolean) => {
    setTieneMultiplesTitulares(multiple);
    setBusquedas({});
    if (!multiple) {
      setTitulares([{ comuneroId: '', nombreCompleto: '', certificado: '', porcentajePosesion: 100, calidadAgraria: 'Ejidatario', actoJuridico: 'Asignación', vigencia: 'Vigente' }]);
      setErrorPorcentaje('');
    } else {
      setTitulares([
        { comuneroId: '', nombreCompleto: '', certificado: '', porcentajePosesion: 50, calidadAgraria: 'Ejidatario', actoJuridico: 'Cesión de derechos', vigencia: 'Vigente' },
        { comuneroId: '', nombreCompleto: '', certificado: '', porcentajePosesion: 50, calidadAgraria: 'Ejidatario', actoJuridico: 'Cesión de derechos', vigencia: 'Vigente' }
      ]);
    }
  };

  // --- LÓGICA DE PROPIETARIOS HISTÓRICOS ---
  const agregarPropietarioHistorico = () => {
    setHistorialPropietarios(prev => [...prev, { nombre: '', certificado: '', fechaAdquisicion: '', fechaCesion: '', actoJuridico: 'Cesión de derechos', adquirente: '' }]);
  };

  const eliminarPropietarioHistorico = (index: number) => {
    setHistorialPropietarios(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarPropietarioHistorico = (index: number, campo: keyof PropietarioHistoricoFila, valor: string) => {
    setHistorialPropietarios(prev => prev.map((item, i) => i === index ? { ...item, [campo]: valor } : item));
  };

  // --- LÓGICA DE PREDIALES HISTÓRICOS ---
  const agregarPredialHistorico = () => {
    const ultimoAnio = historialPrediales.length > 0 ? Math.min(...historialPrediales.map(p => p.anio)) - 1 : new Date().getFullYear() - 1;
    setHistorialPrediales(prev => [...prev, { anio: ultimoAnio, monto: pagoPredialCalculado, estado: 'Pagar' }]);
  };

  const eliminarPredialHistorico = (index: number) => {
    setHistorialPrediales(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarPredialHistorico = (index: number, campo: keyof PredialHistoricoFila, valor: any) => {
    setHistorialPrediales(prev => prev.map((item, i) => i === index ? { ...item, [campo]: valor } : item));
  };

  // --- LÓGICA DE SELECCIÓN CON FILTRADO ---
  const handleActualizarTitular = (index: number, campo: keyof TitularFila, valor: any) => {
    setTitulares(prev => {
      const copia = [...prev];
      if (campo === 'comuneroId') {
        const comuneroObj = comunerosRegistrados.find(c => c.id === valor);
        copia[index].comuneroId = valor;
        copia[index].nombreCompleto = comuneroObj ? `${comuneroObj.nombre} ${comuneroObj.apellidos}` : '';
      } else {
        copia[index] = { ...copia[index], [campo]: valor };
      }
      return copia;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const sumaPorcentajes = titulares.reduce((acc, curr) => acc + Number(curr.porcentajePosesion), 0);
    if (sumaPorcentajes !== 100) {
      setErrorPorcentaje(`La suma de los porcentajes de posesión debe ser exactamente 100%. Actualmente es del ${sumaPorcentajes}%.`);
      return;
    }

    if (titulares.some(t => t.nombreCompleto.trim() === '')) {
      alert("Por favor, selecciona o ingrese un nombre para cada titular activo.");
      return;
    }

    setErrorPorcentaje('');

    const nuevaParcela = {
      folioInterno,
      superficie: `${superficie.toFixed(2)} ha`,
      numero: numeroParcela,
      fechaRegistro,
      observaciones,
      estadoPredial: estadoPredialActual,
      titularesCount: titulares.length,
      propietarios: titulares.map(t => t.nombreCompleto),
      titularesDetalle: titulares,
      historialPropietarios,
      historialPrediales
    };

    onGuardar(nuevaParcela);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <form 
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-gray-700 text-xs font-semibold"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
              <span className="p-1.5 bg-[#006837]/10 text-[#006837] rounded-lg">
                <Landmark className="w-4 h-4" />
              </span>
              {parcelaAEditar ? 'Modificar Expediente de Parcela Ejidal' : 'Alta Integral de Parcela Ejidal (Con Históricos)'}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Buscador avanzado para +1500 registros, tracto sucesivo cronológico e historial hacendario.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>

        {/* Cuerpo con Scroll */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Fila 1: Datos Físicos de la Parcela */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Folio Interno</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[#006837] font-black text-sm">{folioInterno || "Generando..."}</div>
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
              <label className="text-gray-500 font-bold block">Fecha de Registro Oficial *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="date" required value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none focus:border-[#006837]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Estado Año Actual</label>
              <select value={estadoPredialActual} onChange={(e) => setEstadoPredialActual(e.target.value as 'Pagado' | 'Pagar')} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none cursor-pointer focus:border-[#006837]">
                <option value="Pagar">Pendiente de Pago (Pagar)</option>
                <option value="Pagado">Liquidado (Pagado)</option>
              </select>
            </div>
          </div>

          {/* Tasa predial y Control de Titulares */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-[#006837]/5 p-4 rounded-xl border border-[#006837]/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#006837]/10 text-[#006837] rounded-xl"><Calculator className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Tasa Predial Calculada Año Corriente ($5/ha)</p>
                <p className="text-base font-black text-gray-900">${pagoPredialCalculado.toFixed(2)} MXN</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => handleToggleMultiples(false)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!tieneMultiplesTitulares ? 'bg-[#006837] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>Un solo Titular</button>
              <button type="button" onClick={() => handleToggleMultiples(true)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tieneMultiplesTitulares ? 'bg-[#006837] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>Múltiples Titulares</button>
            </div>
          </div>

          {/* SECCIÓN 1: TITULARES ACTIVOS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider text-emerald-800">1. Titulares Activos Vigentes</h4>
              {tieneMultiplesTitulares && (
                <button type="button" onClick={() => setTitulares(p => [...p, { comuneroId: '', nombreCompleto: '', certificado: '', porcentajePosesion: 0, calidadAgraria: 'Ejidatario', actoJuridico: 'Cesión de derechos', vigencia: 'Vigente' }])} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#006837]/10 text-[#006837] rounded-lg hover:bg-[#006837]/20">
                  <Plus className="w-3.5 h-3.5 stroke-[3]" /> Agregar Co-titular
                </button>
              )}
            </div>

            <div className="border border-gray-100 rounded-xl shadow-xs overflow-visible bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-gray-400 font-black uppercase border-b border-gray-100">
                    <th className="p-3">Buscar Comunero (Nombre o Folio) *</th>
                    <th className="p-3 w-[140px]">Nº Certificado *</th>
                    <th className="p-3 w-[100px]">% Posesión</th>
                    <th className="p-3 w-[130px]">Calidad Agraria</th>
                    <th className="p-3 w-[140px]">Acto de Adquisición</th>
                    {tieneMultiplesTitulares && <th className="p-3 w-[50px] text-center">Quitar</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {titulares.map((titular, index) => {
                    const query = busquedas[index] ?? titular.nombreCompleto;
                    const filteredComuneros = comunerosRegistrados.filter(c => 
                      `${c.nombre} ${c.apellidos}`.toLowerCase().includes(query.toLowerCase()) ||
                      c.folioComunero.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 5);

                    return (
                      <tr key={index} className="hover:bg-slate-50/30">
                        <td className="p-2 relative overflow-visible">
                          <div ref={el => { dropdownRefs.current[index] = el; }} className="relative w-full">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                              type="text"
                              required
                              placeholder="🔎 Escriba para buscar..."
                              value={query}
                              onFocus={() => setMenusAbiertos(prev => ({ ...prev, [index]: true }))}
                              onChange={(e) => {
                                setBusquedas(prev => ({ ...prev, [index]: e.target.value }));
                                setMenusAbiertos(prev => ({ ...prev, [index]: true }));
                                if (!e.target.value) handleActualizarTitular(index, 'comuneroId', '');
                              }}
                              className="w-full pl-8 pr-7 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 font-bold outline-none focus:border-[#006837]"
                            />
                            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                            
                            {menusAbiertos[index] && (
                              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                                {filteredComuneros.length > 0 ? (
                                  filteredComuneros.map(c => (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        handleActualizarTitular(index, 'comuneroId', c.id);
                                        setBusquedas(prev => ({ ...prev, [index]: `${c.nombre} ${c.apellidos}` }));
                                        setMenusAbiertos(prev => ({ ...prev, [index]: false }));
                                      }}
                                      className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-gray-700 font-semibold flex items-center justify-between border-b border-gray-50 last:border-0"
                                    >
                                      <div>
                                        <p className="text-gray-900 text-xs font-bold">{c.nombre} {c.apellidos}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{c.tipo.toUpperCase()} • Folio: {c.folioComunero}</p>
                                      </div>
                                      {titular.comuneroId === c.id && <Check className="w-4 h-4 text-[#006837]" />}
                                    </button>
                                  ))
                                ) : (
                                  <div className="p-3 text-center text-gray-400 text-[11px] font-medium">Ningún comunero coincide con el término.</div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="p-2"><input type="text" required placeholder="CERT-XXXX" value={titular.certificado} onChange={(e) => handleActualizarTitular(index, 'certificado', e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-gray-800 outline-none" /></td>
                        <td className="p-2"><div className="relative"><input type="number" required disabled={!tieneMultiplesTitulares} value={titular.porcentajePosesion} onChange={(e) => handleActualizarTitular(index, 'porcentajePosesion', Number(e.target.value))} className="w-full pr-5 pl-2 py-2 border border-gray-200 rounded-lg text-gray-800 disabled:bg-slate-50" /><span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400">%</span></div></td>
                        <td className="p-2">
                          <select value={titular.calidadAgraria} onChange={(e) => handleActualizarTitular(index, 'calidadAgraria', e.target.value)} className="w-full px-1 py-2 bg-white border border-gray-200 rounded-lg outline-none">
                            <option value="Ejidatario">Ejidatario(a)</option>
                            <option value="Avecindado">Avecindado(a)</option>
                            <option value="Posesionario">Posesionario(a)</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <select value={titular.actoJuridico} onChange={(e) => handleActualizarTitular(index, 'actoJuridico', e.target.value)} className="w-full px-1 py-2 bg-white border border-gray-200 rounded-lg outline-none">
                            <option value="Asignación">Asignación Directa</option>
                            <option value="Cesión de derechos">Cesión de derechos</option>
                            <option value="Sucesión">Sucesión hereditaria</option>
                          </select>
                        </td>
                        {tieneMultiplesTitulares && (
                          <td className="p-2 text-center">
                            <button type="button" disabled={titulares.length <= 1} onClick={() => setTitulares(p => p.filter((_, i) => i !== index))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {errorPorcentaje && <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2.5 rounded-xl"><AlertCircle className="w-4 h-4" /><span className="text-[11px] font-bold">{errorPorcentaje}</span></div>}
          </div>

          {/* SECCIÓN 2: TRACTO SUCESIVO */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider flex items-center gap-1 text-amber-800">
                <History className="w-4 h-4" /> 2. Historial Registral de Dueños Anteriores (Tracto Sucesivo)
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
                      <th className="p-3">Nombre Completo del Ex-Dueño</th>
                      <th className="p-3 w-[120px]">Certificado</th>
                      <th className="p-3 w-[120px]">Adquisición</th>
                      <th className="p-3 w-[120px]">Fecha Cesión</th>
                      <th className="p-3 w-[140px]">Acto de Transmisión</th>
                      <th className="p-3">Adquirente (Quién recibió)</th>
                      <th className="p-3 w-[50px] text-center">Quitar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {historialPropietarios.map((hist, index) => (
                      <tr key={index} className="hover:bg-amber-50/10">
                        <td className="p-2"><input type="text" required placeholder="Ej. Pedro Martínez" value={hist.nombre} onChange={(e) => actualizarPropietarioHistorico(index, 'nombre', e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800 font-bold focus:border-amber-500" /></td>
                        <td className="p-2"><input type="text" required placeholder="CERT-012" value={hist.certificado} onChange={(e) => actualizarPropietarioHistorico(index, 'certificado', e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800" /></td>
                        <td className="p-2"><input type="text" required placeholder="DD/MM/YYYY" value={hist.fechaAdquisicion} onChange={(e) => actualizarPropietarioHistorico(index, 'fechaAdquisicion', e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800 text-center" /></td>
                        <td className="p-2"><input type="text" required placeholder="DD/MM/YYYY" value={hist.fechaCesion} onChange={(e) => actualizarPropietarioHistorico(index, 'fechaCesion', e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800 text-center" /></td>
                        <td className="p-2">
                          <select value={hist.actoJuridico} onChange={(e) => actualizarPropietarioHistorico(index, 'actoJuridico', e.target.value)} className="w-full px-1 py-2 bg-white border border-gray-200 rounded-lg outline-none cursor-pointer">
                            <option value="Cesión de derechos">Cesión de Derechos</option>
                            <option value="Sucesión Hereditaria">Sucesión Hereditaria</option>
                            <option value="Compraventa">Compraventa Contractual</option>
                            <option value="Donación Directa">Donación Directa</option>
                          </select>
                        </td>
                        <td className="p-2"><input type="text" required placeholder="Ej. José Hernández" value={hist.adquirente} onChange={(e) => actualizarPropietarioHistorico(index, 'adquirente', e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800" /></td>
                        <td className="p-2 text-center">
                          <button type="button" onClick={() => eliminarPropietarioHistorico(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center text-gray-400 font-medium text-[11px]">No se han registrado transferencias pasadas. La parcela iniciará limpia de historial.</div>
              )}
            </div>
          </div>

          {/* SECCIÓN 3: HISTORIAL DE PREDIALES PASADOS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider flex items-center gap-1 text-red-800">
                <DollarSign className="w-4 h-4" /> 3. Historial Fiscal Hacendario (Años Anteriores)
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
                        <td className="p-2">
                          <input type="number" required placeholder="Ej. 2025" value={pred.anio} onChange={(e) => actualizarPredialHistorico(index, 'anio', Number(e.target.value))} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-center font-bold text-gray-800 outline-none" />
                        </td>
                        <td className="p-2">
                          <input type="number" step="0.01" required placeholder="0.00" value={pred.monto} onChange={(e) => actualizarPredialHistorico(index, 'monto', Number(e.target.value))} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-gray-800 outline-none font-mono" />
                        </td>
                        <td className="p-2">
                          <select value={pred.estado} onChange={(e) => actualizarPredialHistorico(index, 'estado', e.target.value)} className="w-full px-2 py-2 bg-white border border-gray-200 rounded-lg outline-none font-bold cursor-pointer">
                            <option value="Pagado">🟢 PAGADO (Al corriente)</option>
                            <option value="Pagar">🔴 POR PAGAR (Adeudo)</option>
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
                <div className="p-4 text-center text-gray-400 font-medium text-[11px]">No se registran deudas ni pagos de años pasados. Inicia al corriente.</div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-1.5">
            <label className="text-gray-500 font-bold block">Observaciones Especiales y Notas de Archivo</label>
            <textarea rows={2} placeholder="Detalles particulares del expediente..." value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none focus:border-[#006837]" />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row items-center gap-2 shrink-0">
          <button type="button" onClick={onClose} className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl font-bold text-gray-500 bg-white hover:bg-gray-50">Cancelar</button>
          <button type="submit" className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-xs">
            <Save className="w-4 h-4" /> 
            {parcelaAEditar ? 'Guardar Cambios del Expediente' : 'Registrar Expediente Completo'}
          </button>
        </div>
      </form>
    </div>
  );
};
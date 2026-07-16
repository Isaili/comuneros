"use client";

import React, { useState, useEffect, useRef } from 'react';
import { X, Landmark, FileText, Calendar, AlertCircle, Search, History, DollarSign, Check, ChevronDown, Move } from 'lucide-react';

import { Comunero } from '../../comuneros/types/types';

import { 
  Lote, 
  PropietarioHistoricoLote, 
  PredialHistoricoLote 
} from '../types/typesLotes';

interface AgregarLoteFormProps {
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onGuardar: (nuevoLote: Lote) => void;
  loteAEditar?: Lote | null;
}

export const AgregarLoteForm: React.FC<AgregarLoteFormProps> = ({
  comunerosRegistrados,
  onClose,
  onGuardar,
  loteAEditar
}) => {
  // 1. Estados principales del Lote (Inicia por defecto en 10x20)
  const [largo, setLargo] = useState<number>(10);
  const [ancho, setAncho] = useState<number>(20);
  const [numeroLote, setNumeroLote] = useState<string>('');
  const [fechaRegistro, setFechaRegistro] = useState<string>(new Date().toISOString().split('T')[0]);
  const [observaciones, setObservaciones] = useState<string>('');
  const [folioInterno, setFolioInterno] = useState<string>('');
  const [estadoPredialActual, setEstadoPredialActual] = useState<'Pagado' | 'Pagar'>('Pagar');

  // 2. Estado para el Titular Único
  const [comuneroId, setComuneroId] = useState<string>('');
  const [nombreCompleto, setNombreCompleto] = useState<string>('');
  const [certificado, setCertificado] = useState<string>('');
  const [calidadAgraria, setCalidadAgraria] = useState<string>('Ejidatario');
  const [actoJuridico, setActoJuridico] = useState<string>('Asignación');

  // 3. Historiales vinculados
  const [historialPropietarios, setHistorialPropietarios] = useState<PropietarioHistoricoLote[]>([]);
  const [historialPrediales, setHistorialPrediales] = useState<PredialHistoricoLote[]>([]);

  // Estados del Buscador de Comuneros
  const [busqueda, setBusqueda] = useState<string>('');
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // 🔄 Rellenado automático al abrir el formulario (Edición vs Creación)
  useEffect(() => {
    if (loteAEditar) {
      setFolioInterno(loteAEditar.id ? `L-${loteAEditar.id}` : 'L-000');
      setNumeroLote(loteAEditar.numeroLote);
      setLargo(loteAEditar.largo || 10);
      setAncho(loteAEditar.ancho || 20);
      setEstadoPredialActual(loteAEditar.estadoPredial);
      setCertificado(loteAEditar.certificado || '');
      setCalidadAgraria(loteAEditar.calidadAgraria || 'Ejidatario');
      setActoJuridico(loteAEditar.actoJuridico || 'Asignación');
      setHistorialPropietarios(loteAEditar.historialPropietarios || []);
      setHistorialPrediales(loteAEditar.historialPrediales || []);
      setObservaciones(loteAEditar.observaciones || '');
      
      if (loteAEditar.propietario) {
        const comuneroEncontrado = comunerosRegistrados.find(
          c => `${c.nombre} ${c.apellidos}`.toLowerCase() === loteAEditar.propietario.toLowerCase()
        );
        if (comuneroEncontrado) {
          setComuneroId(comuneroEncontrado.id);
          setNombreCompleto(`${comuneroEncontrado.nombre} ${comuneroEncontrado.apellidos}`);
          setBusqueda(`${comuneroEncontrado.nombre} ${comuneroEncontrado.apellidos}`);
        } else {
          setNombreCompleto(loteAEditar.propietario);
          setBusqueda(loteAEditar.propietario);
        }
      }
    } else {
      const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
      setFolioInterno(`L-${numeroAleatorio}`);
    }
  }, [loteAEditar, comunerosRegistrados]);

  // Manejador para cerrar menús al clickear fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🧮 FÓRMULAS CORREGIDAS (Tasa de $0.10 por m² para que 10x20m = $20 pesos)
  const superficieCalculadaM2 = largo * ancho;
  const costoPorM2 = 0.10; 
  const pagoPredialCalculado = superficieCalculadaM2 * costoPorM2;

  // --- LÓGICA DE PROPIETARIOS HISTÓRICOS ---
  const agregarPropietarioHistorico = () => {
    setHistorialPropietarios(prev => [...prev, { nombre: '', certificado: '', fechaAdquisicion: '', fechaCesion: '', actoJuridico: 'Cesión de derechos', adquirente: '' }]);
  };

  const eliminarPropietarioHistorico = (index: number) => {
    setHistorialPropietarios(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarPropietarioHistorico = (index: number, campo: keyof PropietarioHistoricoLote, valor: string) => {
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

  const actualizarPredialHistorico = (index: number, campo: keyof PredialHistoricoLote, valor: any) => {
    setHistorialPrediales(prev => prev.map((item, i) => i === index ? { ...item, [campo]: valor } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreCompleto.trim()) {
      alert("Por favor, busque y seleccione un titular activo para este lote.");
      return;
    }

    const nuevoLote: Lote = {
      folioInterno,
      numeroLote,
      largo,
      ancho,
      superficieM2: superficieCalculadaM2,
      fechaRegistro,
      observaciones,
      estadoPredial: estadoPredialActual,
      propietario: nombreCompleto,
      certificado,
      calidadAgraria,
      actoJuridico,
      historialPropietarios,
      historialPrediales
    };

    onGuardar(nuevoLote);
  };

  const filteredComuneros = comunerosRegistrados.filter(c => 
    `${c.nombre} ${c.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.folioComunero.toLowerCase().includes(busqueda.toLowerCase())
  ).slice(0, 5);

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
              <span className="p-1.5 bg-emerald-700/10 text-emerald-700 rounded-lg">
                <Landmark className="w-4 h-4" />
              </span>
              {loteAEditar ? 'Modificar Registro de Lote Habitacional' : 'Alta Integral de Lote Habitacional'}
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Control de dimensiones individuales, propiedad privada no transferible de forma múltiple e historial contributivo.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Cartel Informativo */}
          <div className="flex items-start gap-2.5 bg-sky-50 border border-sky-100 p-3.5 rounded-xl">
            <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-sky-800 leading-relaxed font-medium">
              <strong className="font-bold">Nota de subdivisión:</strong> Si este lote representa la separación de una fracción de terreno anterior, recuerde que <strong className="font-bold">debe generar un nuevo número de lote y folio interno único</strong> para la parte segregada. Las dimensiones serán recalculadas de manera independiente para cada título de propiedad resultante.
            </div>
          </div>

          {/* Fila 1: Datos Físicos y Medidas del Lote */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Folio Lote</label>
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-emerald-700 font-black text-sm">{folioInterno || "Generando..."}</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Nº de Lote Oficial *</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" required placeholder="Ej. Lote 14-B" value={numeroLote} onChange={(e) => setNumeroLote(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none focus:border-emerald-700" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Ancho (Metros) *</label>
              <div className="relative">
                <input type="number" min="1" step="0.01" required value={ancho || ''} onChange={(e) => setAncho(Number(e.target.value))} className="w-full pr-8 pl-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none focus:border-emerald-700" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">m</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Largo (Metros) *</label>
              <div className="relative">
                <input type="number" min="1" step="0.01" required value={largo || ''} onChange={(e) => setLargo(Number(e.target.value))} className="w-full pr-8 pl-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none focus:border-emerald-700" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">m</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Fecha de Asignación *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="date" required value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)} className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none focus:border-emerald-700" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Estado Predial Año Actual</label>
              <select value={estadoPredialActual} onChange={(e) => setEstadoPredialActual(e.target.value as 'Pagado' | 'Pagar')} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none cursor-pointer focus:border-emerald-700">
                <option value="Pagar">Por Pagar</option>
                <option value="Pagado">Liquidado (Pagado)</option>
              </select>
            </div>
          </div>

          {/* Fila Calculadora: Superficie y Costo Predial Modificado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-100/60 text-emerald-800 rounded-xl"><Move className="w-5 h-5 animate-pulse" /></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Medida de Superficie Resultante</p>
                <p className="text-base font-black text-gray-900">
                  {ancho}m × {largo}m = <span className="text-emerald-700">{superficieCalculadaM2.toFixed(2)} m²</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 md:justify-end">
              <div className="p-3 bg-slate-100 text-gray-700 rounded-xl"><DollarSign className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">Predial Calculado ($0.10 por m²)</p>
                <p className="text-base font-black text-gray-900">${pagoPredialCalculado.toFixed(2)} MXN</p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 1: TITULAR VIGENTE DEL LOTE */}
          <div className="space-y-3">
            <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider text-emerald-800">1. Propietario o Titular Vigente (Límite: 1)</h4>
            
            <div className="border border-gray-100 rounded-xl shadow-xs p-4 bg-slate-50/40 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Selector/Buscador del Comunero */}
                <div className="space-y-1.5 relative" ref={dropdownRef}>
                  <label className="text-gray-500 font-bold block">Buscar Titular *</label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="🔎 Escriba nombre o folio..."
                      value={busqueda}
                      onFocus={() => setMenuAbierto(true)}
                      onChange={(e) => {
                        setBusqueda(e.target.value);
                        setMenuAbierto(true);
                        if (!e.target.value) {
                          setComuneroId('');
                          setNombreCompleto('');
                        }
                      }}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 font-bold outline-none focus:border-emerald-700 text-xs"
                    />
                  </div>

                  {menuAbierto && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                      {filteredComuneros.length > 0 ? (
                        filteredComuneros.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              setComuneroId(c.id);
                              setNombreCompleto(`${c.nombre} ${c.apellidos}`);
                              setBusqueda(`${c.nombre} ${c.apellidos}`);
                              setMenuAbierto(false);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-gray-700 font-semibold flex items-center justify-between border-b border-gray-50 last:border-0"
                          >
                            <div>
                              <p className="text-gray-900 text-xs font-bold">{c.nombre} {c.apellidos}</p>
                              <p className="text-[10px] text-gray-400 font-medium">{c.tipo.toUpperCase()} • Folio: {c.folioComunero}</p>
                            </div>
                            {comuneroId === c.id && <Check className="w-4 h-4 text-emerald-700" />}
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-400 text-[11px] font-medium">Ningún comunero coincide con el término.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Certificado */}
                <div className="space-y-1.5">
                  <label className="text-gray-500 font-bold block">Nº de Certificado Habitacional *</label>
                  <input type="text" required placeholder="CERT-LOTE-XXXX" value={certificado} onChange={(e) => setCertificado(e.target.value)} className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 outline-none focus:border-emerald-700 text-xs" />
                </div>

                {/* Calidad Agraria */}
                <div className="space-y-1.5">
                  <label className="text-gray-500 font-bold block">Calidad Agraria</label>
                  <select value={calidadAgraria} onChange={(e) => setCalidadAgraria(e.target.value)} className="w-full px-1.5 py-2 bg-white border border-gray-200 rounded-lg outline-none text-xs">
                    <option value="Ejidatario">Ejidatario(a)</option>
                    <option value="Avecindado">Avecindado(a)</option>
                    <option value="Posesionario">Posesionario(a)</option>
                  </select>
                </div>

                {/* Acto de Adquisición */}
                <div className="space-y-1.5">
                  <label className="text-gray-500 font-bold block">Acto de Adquisición</label>
                  <select value={actoJuridico} onChange={(e) => setActoJuridico(e.target.value)} className="w-full px-1.5 py-2 bg-white border border-gray-200 rounded-lg outline-none text-xs">
                    <option value="Asignación">Asignación Directa</option>
                    <option value="Cesión de derechos">Cesión de derechos</option>
                    <option value="Sucesión">Sucesión hereditaria</option>
                  </select>
                </div>

              </div>
            </div>
          </div>

          {/* SECCIÓN 2: TRACTO SUCESIVO */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider flex items-center gap-1 text-amber-800">
                <History className="w-4 h-4" /> 2. Historial Registral de Dueños Pasados (Subdivisiones o Traspasos)
              </h4>
              <button type="button" onClick={agregarPropietarioHistorico} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100/60">
                Registrar Antecesor
              </button>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
              {historialPropietarios.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-amber-50/40 text-gray-500 font-black uppercase border-b border-gray-100">
                      <th className="p-3">Nombre Completo del Cedente</th>
                      <th className="p-3 w-[120px]">Certificado Anterior</th>
                      <th className="p-3 w-[120px]">Adquisición</th>
                      <th className="p-3 w-[120px]">Fecha Cesión</th>
                      <th className="p-3 w-[140px]">Acto de Transmisión</th>
                      <th className="p-3">Adquirente (Quién recibió)</th>
                      <th className="p-3 w-[50px] text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {historialPropietarios.map((hist, index) => (
                      <tr key={index} className="hover:bg-amber-50/10">
                        <td className="p-2"><input type="text" required placeholder="Ej. Pedro Martínez" value={hist.nombre} onChange={(e) => actualizarPropietarioHistorico(index, 'nombre', e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg outline-none text-gray-800 focus:border-amber-500" /></td>
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
                          <button type="button" onClick={() => eliminarPropietarioHistorico(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center text-gray-400 font-medium text-[11px]">No se han registrado transferencias pasadas. El lote iniciará libre de cargas previas.</div>
              )}
            </div>
          </div>

          {/* SECCIÓN 3: HISTORIAL DE PREDIALES PASADOS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-gray-900 font-black text-xs uppercase tracking-wider flex items-center gap-1 text-red-800">
                <DollarSign className="w-4 h-4" /> 3. Historial de Pagos Prediales (Años Anteriores)
              </h4>
              <button type="button" onClick={agregarPredialHistorico} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-800 border border-red-200 rounded-lg hover:bg-red-100/60">
                Registrar Año Fiscal Pasado
              </button>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-hidden bg-white max-w-2xl">
              {historialPrediales.length > 0 ? (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-red-50/40 text-gray-500 font-black uppercase border-b border-gray-100">
                      <th className="p-3 w-[150px]">Año Fiscal</th>
                      <th className="p-3 w-[180px]">Monto del Derecho ($)</th>
                      <th className="p-3">Estado del Pago</th>
                      <th className="p-3 w-[60px] text-center"></th>
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
                          <button type="button" onClick={() => eliminarPredialHistorico(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center text-gray-400 font-medium text-[11px]">No se registran adeudos del lote en ejercicios pasados.</div>
              )}
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-1.5">
            <label className="text-gray-500 font-bold block">Observaciones y Notas de Colindancia</label>
            <textarea rows={2} placeholder="Indique colindancias, notas del trazo habitacional o subdivisiones históricas..." value={observaciones} onChange={(e) => setObservaciones(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl text-gray-800 font-bold outline-none focus:border-emerald-700" />
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-600 transition-colors">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm">
            Guardar Registro Lote
          </button>
        </div>
      </form>
    </div>
  );
};
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, X, Search, Plus, Trash2, Check } from 'lucide-react';
import { Lote } from '../types/typesLotes';
import { Comunero } from '../../comuneros/types/types';

export interface NuevoPropietarioInput {
  id: string;
  nombre: string;
  certificado: string;
}

export interface DatosTraspasoLotePayload {
  nuevosPropietarios: NuevoPropietarioInput[];
  actoJuridico: string;
  fecha: string;
}

interface TraspasarLoteModalProps {
  lote: Lote;
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onConfirmar: (datos: DatosTraspasoLotePayload) => void;
}

export const TraspasarLoteModal: React.FC<TraspasarLoteModalProps> = ({
  lote,
  comunerosRegistrados,
  onClose,
  onConfirmar
}) => {
  const [actoJuridico, setActoJuridico] = useState<string>('Cesión de derechos');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const [adquirentes, setAdquirentes] = useState<NuevoPropietarioInput[]>([
    { id: '1', nombre: '', certificado: `CERT-${lote.folioInterno}-01` }
  ]);

  const [menuAbiertoIndex, setMenuAbiertoIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuAbiertoIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const obtenerNombreCompleto = (c: Comunero) => {
    return `${c.nombre} ${c.apellidoPaterno || ''} ${c.apellidoMaterno || ''}`.trim();
  };

  const comunerosDisponibles = comunerosRegistrados.filter(c => {
    const nombreCompleto = obtenerNombreCompleto(c).toLowerCase();
    return nombreCompleto !== (lote.propietario || '').toLowerCase();
  });

  const getFilteredComuneros = (termino: string) => {
    const term = (termino || '').toLowerCase();
    return comunerosDisponibles.filter(c => {
      const nombre = obtenerNombreCompleto(c).toLowerCase();
      const vecindario = (c.vecindario || '').toLowerCase();
      return nombre.includes(term) || vecindario.includes(term);
    }).slice(0, 5);
  };

  const agregarAdquirente = () => {
    const num = adquirentes.length + 1;
    setAdquirentes(prev => [
      ...prev,
      { id: Date.now().toString(), nombre: '', certificado: `CERT-${lote.folioInterno}-0${num}` }
    ]);
  };

  const eliminarAdquirente = (id: string) => {
    if (adquirentes.length <= 1) {
      alert("Debe haber al menos un nuevo adquirente para realizar el traspaso.");
      return;
    }
    setAdquirentes(prev => prev.filter(item => item.id !== id));
  };

  const actualizarAdquirente = (id: string, campo: 'nombre' | 'certificado', valor: string) => {
    setAdquirentes(prev => prev.map(item => item.id === id ? { ...item, [campo]: valor } : item));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const incompletos = adquirentes.some(a => !a.nombre.trim() || !a.certificado.trim());
    if (incompletos) {
      alert("Por favor asegúrese de asignar el nombre y el número de certificado para cada adquirente.");
      return;
    }

    onConfirmar({
      nuevosPropietarios: adquirentes,
      actoJuridico,
      fecha
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-visible z-10 flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/10 text-amber-700 rounded-lg">
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Traspasar Lote — {lote.numeroLote}</h3>
              <p className="text-[10px] text-gray-500">
                Titular actual: <strong className="text-gray-700">{lote.propietario || 'Sin titular'}</strong> • Folio: {lote.folioInterno}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-gray-700 overflow-y-auto flex-1">
          
          {/* Acto y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-xl border border-gray-100">
            <div className="space-y-1">
              <label className="text-gray-500 font-bold block">Acto Jurídico *</label>
              <select 
                value={actoJuridico} 
                onChange={(e) => setActoJuridico(e.target.value)} 
                className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg outline-none text-xs"
              >
                <option value="Cesión de derechos">Cesión de derechos</option>
                <option value="Sucesión">Sucesión hereditaria</option>
                <option value="Compraventa">Compraventa comunitaria</option>
                <option value="Donación">Donación</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-500 font-bold block">Fecha del Traspaso *</label>
              <input 
                type="date" 
                required 
                value={fecha} 
                onChange={(e) => setFecha(e.target.value)} 
                className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg outline-none text-xs" 
              />
            </div>
          </div>

          {/* Adquirentes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-800">Nuevo(s) Adquirente(s)</h4>
              <button
                type="button"
                onClick={agregarAdquirente}
                className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Copropietario
              </button>
            </div>

            {adquirentes.map((adquirente, index) => {
              const filteredList = getFilteredComuneros(adquirente.nombre);

              return (
                <div key={adquirente.id} className="p-3 border border-gray-100 rounded-xl bg-slate-50/30 space-y-2 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400">Adquirente #{index + 1}</span>
                    {adquirentes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => eliminarAdquirente(adquirente.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Buscador de Comunero */}
                    <div className="space-y-1 relative" ref={menuAbiertoIndex === index ? dropdownRef : null}>
                      <label className="text-[10px] text-gray-500 font-bold block">Buscar Nombre *</label>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input
                          type="text"
                          required
                          placeholder="🔎 Buscar comunero..."
                          value={adquirente.nombre}
                          onFocus={() => setMenuAbiertoIndex(index)}
                          onChange={(e) => {
                            actualizarAdquirente(adquirente.id, 'nombre', e.target.value);
                            setMenuAbiertoIndex(index);
                          }}
                          className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-800 font-bold outline-none focus:border-amber-500 text-xs"
                        />
                      </div>

                      {menuAbiertoIndex === index && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto">
                          {filteredList.length > 0 ? (
                            filteredList.map(c => {
                              const nombreComunero = obtenerNombreCompleto(c);
                              return (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => {
                                    actualizarAdquirente(adquirente.id, 'nombre', nombreComunero);
                                    setMenuAbiertoIndex(null);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-amber-50 text-gray-700 font-semibold flex items-center justify-between border-b border-gray-50 last:border-0"
                                >
                                  <div>
                                    <p className="text-gray-900 text-xs font-bold">{nombreComunero}</p>
                                    <p className="text-[10px] text-gray-400 font-medium">{c.tipo.toUpperCase()} • {c.vecindario}</p>
                                  </div>
                                  {adquirente.nombre === nombreComunero && <Check className="w-3.5 h-3.5 text-amber-600" />}
                                </button>
                              );
                            })
                          ) : (
                            <div className="p-2 text-center text-gray-400 text-[10px]">No coincide ningún comunero.</div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Certificado */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-gray-500 font-bold block">Nuevo Certificado *</label>
                      <input
                        type="text"
                        required
                        value={adquirente.certificado}
                        onChange={(e) => actualizarAdquirente(adquirente.id, 'certificado', e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-gray-800 outline-none focus:border-amber-500 text-xs"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Acciones */}
          <div className="flex gap-2 pt-3 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs font-bold transition-colors">
              Confirmar Traspaso
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
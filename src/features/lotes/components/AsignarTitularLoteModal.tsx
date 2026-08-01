"use client";

import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, X, Search, Check } from 'lucide-react';
import { Lote } from '../types/typesLotes';
import { Comunero } from '../../comuneros/types/types';

export interface TitularLoteAsignado {
  nombreCompleto: string;
  certificado: string;
  calidadAgraria: string;
  actoJuridico: string;
}

interface AsignarTitularLoteModalProps {
  lote: Lote;
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onAsignar: (titular: TitularLoteAsignado) => void;
}

// Modal para asignar el titular de un lote que se registró sin dueño.
// Contiene los mismos campos que antes vivían dentro del formulario de
// "Agregar Lote" (búsqueda de comunero, certificado, calidad agraria y acto jurídico).
export const AsignarTitularLoteModal: React.FC<AsignarTitularLoteModalProps> = ({
  lote,
  comunerosRegistrados,
  onClose,
  onAsignar
}) => {
  const [comuneroId, setComuneroId] = useState<string>('');
  const [nombreCompleto, setNombreCompleto] = useState<string>('');
  const [certificado, setCertificado] = useState<string>(`CERT-LOTE-${Math.floor(1000 + Math.random() * 9000)}`);
  const [calidadAgraria, setCalidadAgraria] = useState<string>('Ejidatario');
  const [actoJuridico, setActoJuridico] = useState<string>('Asignación');

  const [busqueda, setBusqueda] = useState<string>('');
  const [menuAbierto, setMenuAbierto] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredComuneros = comunerosRegistrados.filter(c =>
    `${c.nombre} ${c.apellidos}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.folioComunero.toLowerCase().includes(busqueda.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombreCompleto.trim()) {
      alert("Por favor, busque y seleccione un titular para este lote.");
      return;
    }
    if (!certificado.trim()) {
      alert("Por favor, capture el número de certificado del titular.");
      return;
    }

    onAsignar({ nombreCompleto, certificado, calidadAgraria, actoJuridico });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-visible z-10 flex flex-col max-h-[90vh]">

        {/* Encabezado */}
        <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-700/10 text-emerald-700 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Asignar Titular — Lote {lote.numeroLote}</h3>
              <p className="text-[10px] text-gray-500">
                Este lote aún no tiene titular registrado • Superficie: <strong className="text-emerald-800">{lote.superficieM2.toFixed(2)} m²</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-gray-700 overflow-y-auto flex-1">
          <div className="border border-gray-100 rounded-xl shadow-xs p-4 bg-slate-50/40">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Selector/Buscador del Comunero */}
              <div className="space-y-1.5 relative md:col-span-2" ref={dropdownRef}>
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
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-gray-500 font-bold block">Acto de Adquisición</label>
                <select value={actoJuridico} onChange={(e) => setActoJuridico(e.target.value)} className="w-full px-1.5 py-2 bg-white border border-gray-200 rounded-lg outline-none text-xs">
                  <option value="Asignación">Asignación Directa</option>
                  <option value="Cesión de derechos">Cesión de derechos</option>
                  <option value="Sucesión">Sucesión hereditaria</option>
                </select>
              </div>

            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2 pt-2 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs font-bold transition-colors">
              Asignar Titular
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
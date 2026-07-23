"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, X, Search, Check, Plus, Trash2 } from 'lucide-react';
import { Lote } from '../types/typesLotes';
import { Comunero } from '../../comuneros/types/types';

interface AdquirenteFila {
  comuneroId: string;
  nombreCompleto: string;
  certificado: string;
}

interface TraspasarLoteProps {
  lote: Lote;
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onConfirmar: (datosTraspaso: {
    nuevosPropietarios: { nombre: string; certificado: string }[];
    actoJuridico: string;
    fecha: string;
  }) => void;
}

export const TraspasarLoteModal: React.FC<TraspasarLoteProps> = ({
  lote,
  comunerosRegistrados,
  onClose,
  onConfirmar
}) => {
  const [actoJuridico, setActoJuridico] = useState('Cesión de derechos');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  // 👥 Lista dinámica de nuevos adquirentes
  const [adquirentes, setAdquirentes] = useState<AdquirenteFila[]>([
    { 
      comuneroId: '', 
      nombreCompleto: '', 
      certificado: `CERT-${Math.floor(1000 + Math.random() * 9000)}`
    }
  ]);

  // Estados independientes para los buscadores por cada fila
  const [busquedas, setBusquedas] = useState<{ [key: number]: string }>({});
  const [menusAbiertos, setMenusAbiertos] = useState<{ [key: number]: boolean }>({});
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Cerrar menús desplegables al hacer clic fuera
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

  const agregarFilaAdquirente = () => {
    setAdquirentes(prev => [
      ...prev,
      {
        comuneroId: '',
        nombreCompleto: '',
        certificado: `CERT-${Math.floor(1000 + Math.random() * 9000)}`
      }
    ]);
  };

  const eliminarFilaAdquirente = (index: number) => {
    if (adquirentes.length > 1) {
      setAdquirentes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const actualizarAdquirente = (index: number, campo: keyof AdquirenteFila, valor: string) => {
    setAdquirentes(prev => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [campo]: valor };
      return copia;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que no haya filas vacías
    if (adquirentes.some(a => a.comuneroId === '' || !a.nombreCompleto)) {
      alert("Por favor, seleccione un comunero o avecindado válido para cada adquirente.");
      return;
    }

    // Formatear fecha a DD/MM/YYYY
    const [year, month, day] = fecha.split('-');
    const fechaFormateada = `${day}/${month}/${year}`;

    onConfirmar({
      nuevosPropietarios: adquirentes.map(a => ({
        nombre: a.nombreCompleto,
        certificado: a.certificado
      })),
      actoJuridico,
      fecha: fechaFormateada
    });
  };

  // Filtrar para evitar auto-traspasarse al propietario actual
  const comunerosDisponibles = comunerosRegistrados.filter(
    c => `${c.nombre} ${c.apellidos}`.toLowerCase() !== lote.propietario.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-visible z-10 animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Encabezado */}
        <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Traspasar Titularidad — Lote {lote.numeroLote}
              </h3>
              <p className="text-[10px] text-gray-500">
                Titular actual: <strong className="text-gray-700">{lote.propietario}</strong> • Superficie Total: <strong className="text-emerald-800">{lote.superficieM2} m²</strong> ({lote.largo}m x {lote.ancho}m)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-gray-700 overflow-y-auto flex-1">
          
          {/* Fila: Acto Jurídico y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <label className="block text-gray-500">Acto Jurídico de Transmisión</label>
              <select
                value={actoJuridico}
                onChange={(e) => setActoJuridico(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none text-gray-800"
              >
                <option value="Cesión de derechos">Cesión de Derechos</option>
                <option value="Sucesión Hereditaria">Sucesión Hereditaria</option>
                <option value="Compraventa">Compraventa Contractual</option>
                <option value="Donación Directa">Donación Directa</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-500">Fecha de Formalización</label>
              <input
                type="date"
                required
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none text-gray-800"
              />
            </div>
          </div>

          {/* Tabla Dinámica de Nuevos Adquirentes */}
          <div className="space-y-2 overflow-visible">
            <div className="flex items-center justify-between">
              <label className="text-gray-900 font-bold block uppercase tracking-wider text-[10px] text-emerald-800">
                Nuevos Titulares / Adquirentes
              </label>
              <button
                type="button"
                onClick={agregarFilaAdquirente}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-[#006837] border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Co-titular
              </button>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-visible shadow-xs bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-gray-400 font-black uppercase border-b border-gray-100 text-[10px]">
                    <th className="p-3">Buscar Comunero/Avecindado *</th>
                    <th className="p-3 w-[200px]">Nº Certificado Emitido *</th>
                    {adquirentes.length > 1 && <th className="p-3 w-[50px] text-center">Quitar</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {adquirentes.map((adq, index) => {
                    const query = busquedas[index] ?? adq.nombreCompleto;
                    const sugeridos = comunerosDisponibles.filter(c => 
                      `${c.nombre} ${c.apellidos}`.toLowerCase().includes(query.toLowerCase()) ||
                      c.folioComunero.toLowerCase().includes(query.toLowerCase())
                    ).slice(0, 5);

                    return (
                      <tr key={index} className="hover:bg-slate-50/20">
                        {/* BUSCADOR */}
                        <td className="p-2 relative overflow-visible">
                          <div ref={el => { dropdownRefs.current[index] = el; }} className="relative w-full">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                              type="text"
                              required
                              placeholder="🔎 Buscar por nombre o folio..."
                              value={query}
                              onFocus={() => setMenusAbiertos(prev => ({ ...prev, [index]: true }))}
                              onChange={(e) => {
                                setBusquedas(prev => ({ ...prev, [index]: e.target.value }));
                                setMenusAbiertos(prev => ({ ...prev, [index]: true }));
                                if (!e.target.value) actualizarAdquirente(index, 'comuneroId', '');
                              }}
                              className="w-full pl-8 pr-7 py-2 border border-gray-200 rounded-lg text-gray-800 outline-none focus:border-[#006837]"
                            />
                            {menusAbiertos[index] && (
                              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-40 overflow-y-auto">
                                {sugeridos.length > 0 ? (
                                  sugeridos.map(c => {
                                    const nombre = `${c.nombre} ${c.apellidos}`;
                                    return (
                                      <button
                                        key={c.id}
                                        type="button"
                                        onClick={() => {
                                          actualizarAdquirente(index, 'comuneroId', c.id ?? '');
                                          actualizarAdquirente(index, 'nombreCompleto', nombre);
                                          setBusquedas(prev => ({ ...prev, [index]: nombre }));
                                          setMenusAbiertos(prev => ({ ...prev, [index]: false }));
                                        }}
                                        className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-gray-700 flex items-center justify-between border-b border-gray-50 text-[11px]"
                                      >
                                        <div>
                                          <p className="font-bold text-gray-900">{nombre}</p>
                                          <p className="text-[10px] text-gray-400 font-medium">{c.tipo.toUpperCase()} • {c.folioComunero}</p>
                                        </div>
                                        {adq.comuneroId === c.id && <Check className="w-3.5 h-3.5 text-[#006837]" />}
                                      </button>
                                    );
                                  })
                                ) : (
                                  <div className="p-2 text-center text-gray-400 text-[11px]">No hay coincidencias.</div>
                                )}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* CERTIFICADO */}
                        <td className="p-2">
                          <input
                            type="text"
                            required
                            value={adq.certificado}
                            onChange={(e) => actualizarAdquirente(index, 'certificado', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-gray-800 font-mono outline-none"
                          />
                        </td>

                        {/* ELIMINAR FILA */}
                        {adquirentes.length > 1 && (
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => eliminarFilaAdquirente(index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Advertencia Legal */}
          <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-[10px] font-medium leading-tight shrink-0">
            ⚠️ <strong>Nota Registral:</strong> La transferencia se aplicará sobre la totalidad de la superficie del terreno (<strong>{lote.superficieM2} m²</strong>). El propietario actual ({lote.propietario}) pasará automáticamente al historial registral del lote.
          </div>

          {/* Acciones */}
          <div className="flex gap-2 pt-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl shadow-xs font-bold transition-colors"
            >
              Ejecutar Traspaso de Lote
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
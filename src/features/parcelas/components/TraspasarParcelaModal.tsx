"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, X, Search, Check, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Parcela } from '../types/types';
import { Comunero } from '../../comuneros/types/types';

interface AdquirenteFila {
  comuneroId: string;
  nombreCompleto: string;
  certificado: string;
  hectareasPosesion: number;
}

interface TraspasarProps {
  parcela: Parcela;
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onConfirmar: (datosTraspaso: {
    nuevosPropietarios: { nombre: string; certificado: string; hectareas: number }[];
    actoJuridico: string;
    fecha: string;
  }) => void;
}

export const TraspasarParcelaModal: React.FC<TraspasarProps> = ({
  parcela,
  comunerosRegistrados,
  onClose,
  onConfirmar
}) => {
  const [actoJuridico, setActoJuridico] = useState('Cesión de derechos');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [errorHectareas, setErrorHectareas] = useState<string>('');

  // Extraer el valor numérico de la superficie (ej. "12.5 ha" -> 12.5)
  const superficieTotal = parseFloat(parcela.superficie.replace(/[^0-9.]/g, '')) || 0;

  // 👥 Lista dinámica de nuevos adquirentes
  const [adquirentes, setAdquirentes] = useState<AdquirenteFila[]>([
    { 
      comuneroId: '', 
      nombreCompleto: '', 
      certificado: `CERT-${Math.floor(1000 + Math.random() * 9000)}`, 
      hectareasPosesion: superficieTotal 
    }
  ]);

  // Estados independientes para los buscadores de cada fila
  const [busquedas, setBusquedas] = useState<{ [key: number]: string }>({});
  const [menusAbiertos, setMenusAbiertos] = useState<{ [key: number]: boolean }>({});
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Cerrar menús al hacer click afuera
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
        certificado: `CERT-${Math.floor(1000 + Math.random() * 9000)}`,
        hectareasPosesion: 0
      }
    ]);
  };

  const eliminarFilaAdquirente = (index: number) => {
    if (adquirentes.length > 1) {
      setAdquirentes(prev => prev.filter((_, i) => i !== index));
    }
  };

  const actualizarAdquirente = (index: number, campo: keyof AdquirenteFila, valor: any) => {
    setAdquirentes(prev => {
      const copia = [...prev];
      copia[index] = { ...copia[index], [campo]: valor };
      return copia;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validar que la suma de hectáreas no supere la superficie total de la parcela
    const sumaHectareas = adquirentes.reduce((acc, curr) => acc + Number(curr.hectareasPosesion), 0);
    
    // Margen de tolerancia para decimales en flotantes
    if (Math.abs(sumaHectareas - superficieTotal) > 0.001) {
      setErrorHectareas(
        `La suma de hectáreas distribuidas debe coincidir exactamente con la superficie total de la parcela (${superficieTotal} ha). Actualmente suma ${sumaHectareas.toFixed(2)} ha.`
      );
      return;
    }

    // 2. Validar que no haya filas sin comunero asignado
    if (adquirentes.some(a => a.comuneroId === '')) {
      alert("Por favor, asigne un comunero válido a cada fila de adquirente.");
      return;
    }

    setErrorHectareas('');

    // Formatear fecha a DD/MM/YYYY
    const [year, month, day] = fecha.split('-');
    const fechaFormateada = `${day}/${month}/${year}`;

    onConfirmar({
      nuevosPropietarios: adquirentes.map(a => ({
        nombre: a.nombreCompleto,
        certificado: a.certificado,
        hectareas: a.hectareasPosesion
      })),
      actoJuridico,
      fecha: fechaFormateada
    });
  };

  // Filtrar para no poder traspasarse al primer dueño actual
  const comunerosDisponibles = comunerosRegistrados.filter(
    c => `${c.nombre} ${c.apellidos}` !== parcela.propietarios[0]
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
              <h3 className="text-sm font-bold text-gray-900">Traspasar Cesión de Derechos — Parcela {parcela.numero}</h3>
              <p className="text-[10px] text-gray-500">
                Titulares actuales: {parcela.propietarios.join(', ')} • Superficie Total: <strong className="text-emerald-800">{superficieTotal} ha</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-gray-700 overflow-y-auto flex-1">
          
          {/* Fila: Acto y Fecha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <label className="block text-gray-500">Acto Jurídico de Transmisión</label>
              <select
                value={actoJuridico}
                onChange={(e) => setActoJuridico(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none text-gray-800"
              >
                <option value="Cesión de derechos">Cesión de Derechos (Copropiedad)</option>
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

          {/* Tabla Dinámica de Adquirentes */}
          <div className="space-y-2 overflow-visible">
            <div className="flex items-center justify-between">
              <label className="text-gray-900 font-bold block uppercase tracking-wider text-[10px] text-emerald-800">
                Nuevos Adquirentes Destinatarios
              </label>
              <button
                type="button"
                onClick={agregarFilaAdquirente}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-[#006837] border border-emerald-200 rounded-lg hover:bg-emerald-100"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Co-titular
              </button>
            </div>

            <div className="border border-gray-100 rounded-xl overflow-visible shadow-xs bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-gray-400 font-black uppercase border-b border-gray-100 text-[10px]">
                    <th className="p-3">Buscar Comunero/Avecindado *</th>
                    <th className="p-3 w-[150px]">Nº Certificado Emitido *</th>
                    <th className="p-3 w-[120px]">Superficie (ha) *</th>
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
                        {/* BUSCADOR CON LUPA POR FILA */}
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
                                          actualizarAdquirente(index, 'comuneroId', c.id);
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
                            className="w-full px-2 py-2 border border-gray-200 rounded-lg text-gray-800 font-mono outline-none"
                          />
                        </td>

                        {/* HECTÁREAS */}
                        <td className="p-2">
                          <div className="relative">
                            <input
                              type="number"
                              step="0.01"
                              min="0.01"
                              max={superficieTotal}
                              required
                              value={adq.hectareasPosesion}
                              onChange={(e) => actualizarAdquirente(index, 'hectareasPosesion', Number(e.target.value))}
                              className="w-full pr-7 pl-2 py-2 border border-gray-200 rounded-lg text-gray-800 text-center outline-none font-bold"
                            />
                            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]">ha</span>
                          </div>
                        </td>

                        {/* ELIMINAR FILA */}
                        {adquirentes.length > 1 && (
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => eliminarFilaAdquirente(index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
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
            
            {errorHectareas && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-[11px] font-bold">{errorHectareas}</span>
              </div>
            )}
          </div>

          {/* Advertencia Legal */}
          <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-[10px] font-medium leading-tight shrink-0">
            ⚠️ <strong>Nota Registral:</strong> Los titulares actuales pasarán al Tracto Sucesivo Histórico. La titularidad vigente se fragmentará según las hectáreas definidas asignadas a cada titular.
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
              Ejecutar Traspaso Colectivo
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
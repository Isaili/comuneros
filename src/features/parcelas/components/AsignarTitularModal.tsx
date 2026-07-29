"use client";

import React, { useState, useEffect, useRef } from 'react';
import { UserPlus, X, Search, Check, Plus, Trash2, AlertCircle } from 'lucide-react';
import { Parcela, TitularFila } from '../types/typesParcela';
import { Comunero } from '../../comuneros/types/types';

interface AsignarTitularModalProps {
  parcela: Parcela;
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onAsignar: (titulares: TitularFila[]) => void;
}

// Modal para asignar el/los primer(os) titular(es) a una parcela que se
// registró sin dueño. Contiene los mismos campos que antes vivían dentro
// del formulario de "Agregar Parcela" (búsqueda de comunero, certificado,
// hectáreas, calidad agraria y acto jurídico).
export const AsignarTitularModal: React.FC<AsignarTitularModalProps> = ({
  parcela,
  comunerosRegistrados,
  onClose,
  onAsignar
}) => {
  const superficieTotal = parseFloat(parcela.superficie.replace(/[^0-9.]/g, '')) || 0;

  const [tieneMultiplesTitulares, setTieneMultiplesTitulares] = useState(false);
  const [titulares, setTitulares] = useState<TitularFila[]>([
    { comuneroId: '', nombreCompleto: '', certificado: '', hectareasPosesion: superficieTotal, calidadAgraria: 'Ejidatario', actoJuridico: 'Asignación', vigencia: 'Vigente' }
  ]);

  const [busquedas, setBusquedas] = useState<{ [key: number]: string }>({});
  const [menusAbiertos, setMenusAbiertos] = useState<{ [key: number]: boolean }>({});
  const [errorHectareas, setErrorHectareas] = useState<string>('');
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

  // Si es "un solo titular", siempre se queda con el 100% de la superficie
  useEffect(() => {
    if (!tieneMultiplesTitulares) {
      setTitulares(prev => {
        if (prev.length === 0) return prev;
        const copia = [...prev];
        copia[0] = { ...copia[0], hectareasPosesion: superficieTotal };
        return copia;
      });
    }
  }, [tieneMultiplesTitulares, superficieTotal]);

  const handleToggleMultiples = (multiple: boolean) => {
    setTieneMultiplesTitulares(multiple);
    setBusquedas({});
    setErrorHectareas('');
    if (!multiple) {
      setTitulares([{ comuneroId: '', nombreCompleto: '', certificado: '', hectareasPosesion: superficieTotal, calidadAgraria: 'Ejidatario', actoJuridico: 'Asignación', vigencia: 'Vigente' }]);
    } else {
      const mitad = Number((superficieTotal / 2).toFixed(4));
      setTitulares([
        { comuneroId: '', nombreCompleto: '', certificado: '', hectareasPosesion: mitad, calidadAgraria: 'Ejidatario', actoJuridico: 'Cesión de derechos', vigencia: 'Vigente' },
        { comuneroId: '', nombreCompleto: '', certificado: '', hectareasPosesion: mitad, calidadAgraria: 'Ejidatario', actoJuridico: 'Cesión de derechos', vigencia: 'Vigente' }
      ]);
    }
  };

  const agregarFilaTitular = () => {
    setTitulares(prev => [...prev, { comuneroId: '', nombreCompleto: '', certificado: '', hectareasPosesion: 0, calidadAgraria: 'Ejidatario', actoJuridico: 'Cesión de derechos', vigencia: 'Vigente' }]);
  };

  const eliminarFilaTitular = (index: number) => {
    if (titulares.length > 1) {
      setTitulares(prev => prev.filter((_, i) => i !== index));
    }
  };

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

    const sumaHectareas = titulares.reduce((acc, curr) => acc + Number(curr.hectareasPosesion), 0);
    const diferencia = Math.abs(sumaHectareas - superficieTotal);

    if (diferencia > 0.0001) {
      setErrorHectareas(`La suma de las hectáreas poseídas debe ser exactamente igual a la superficie total (${superficieTotal.toFixed(4)} ha). Actualmente suma ${sumaHectareas.toFixed(4)} ha.`);
      return;
    }

    if (titulares.some(t => t.nombreCompleto.trim() === '')) {
      alert("Por favor, selecciona o ingresa un nombre para cada titular.");
      return;
    }

    if (titulares.some(t => t.certificado.trim() === '')) {
      alert("Por favor, captura el número de certificado de cada titular.");
      return;
    }

    setErrorHectareas('');
    onAsignar(titulares);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-visible z-10 flex flex-col max-h-[90vh]">

        {/* Encabezado */}
        <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#006837]/10 text-[#006837] rounded-lg">
              <UserPlus className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Asignar Titular — Parcela {parcela.numero}</h3>
              <p className="text-[10px] text-gray-500">
                Esta parcela aún no tiene titular registrado • Superficie Total: <strong className="text-emerald-800">{superficieTotal} ha</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-gray-700 overflow-y-auto flex-1">

          {/* Toggle un titular / múltiples */}
          <div className="flex justify-end gap-3 bg-[#006837]/5 p-3 rounded-xl border border-[#006837]/10">
            <button type="button" onClick={() => handleToggleMultiples(false)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!tieneMultiplesTitulares ? 'bg-[#006837] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>Un solo Titular</button>
            <button type="button" onClick={() => handleToggleMultiples(true)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${tieneMultiplesTitulares ? 'bg-[#006837] text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>Múltiples Titulares</button>
          </div>

          {/* Tabla de titulares */}
          <div className="space-y-2 overflow-visible">
            <div className="flex items-center justify-between">
              <label className="text-gray-900 font-bold block uppercase tracking-wider text-[10px] text-emerald-800">
                Titular(es) a Asignar
              </label>
              {tieneMultiplesTitulares && (
                <button type="button" onClick={agregarFilaTitular} className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-[#006837] border border-emerald-200 rounded-lg hover:bg-emerald-100">
                  <Plus className="w-3.5 h-3.5" /> Agregar Co-titular
                </button>
              )}
            </div>

            <div className="border border-gray-100 rounded-xl overflow-visible shadow-xs bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-gray-400 font-black uppercase border-b border-gray-100 text-[10px]">
                    <th className="p-3">Buscar Comunero (Nombre o Folio) *</th>
                    <th className="p-3 w-[140px]">Nº Certificado *</th>
                    <th className="p-3 w-[120px]">Hectáreas *</th>
                    <th className="p-3 w-[130px]">Calidad Agraria</th>
                    <th className="p-3 w-[150px]">Acto de Adquisición</th>
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
                              className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 font-bold outline-none focus:border-[#006837]"
                            />

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

                        <td className="p-2">
                          <div className="relative">
                            <input
                              type="number"
                              step="0.0001"
                              min="0"
                              required
                              disabled={!tieneMultiplesTitulares}
                              value={titular.hectareasPosesion}
                              onChange={(e) => handleActualizarTitular(index, 'hectareasPosesion', Number(e.target.value))}
                              className="w-full pr-7 pl-2 py-2 border border-gray-200 rounded-lg text-gray-800 disabled:bg-slate-50"
                            />
                            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] font-bold">ha</span>
                          </div>
                        </td>

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
                            <button type="button" disabled={titulares.length <= 1} onClick={() => eliminarFilaTitular(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"><Trash2 className="w-3.5 h-3.5" /></button>
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

          {/* Acciones */}
          <div className="flex gap-2 pt-2 shrink-0">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl shadow-xs font-bold transition-colors">
              Asignar Titular
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
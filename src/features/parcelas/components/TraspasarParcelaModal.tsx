"use client";

import React, { useState } from 'react';
import { ArrowRightLeft, X, Plus, Trash2 } from 'lucide-react';
import { Parcela } from '../types/typesParcela';
import { Comunero } from '../../comuneros/types/types';

interface NuevoPropietarioInput {
  comuneroId: string;
  nombre: string;
  certificado: string;
  porcentaje: number;
}

interface TraspasarParcelaModalProps {
  parcela: Parcela;
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onConfirmar: (datos: {
    nuevosPropietarios: NuevoPropietarioInput[];
    actoJuridico: string;
    motivo: string;
    fecha: string;
  }) => void;
}

export const TraspasarParcelaModal: React.FC<TraspasarParcelaModalProps> = ({
  parcela,
  comunerosRegistrados,
  onClose,
  onConfirmar,
}) => {
  const [actoJuridico, setActoJuridico] = useState<string>('Cesión de Derechos');
  const [motivo, setMotivo] = useState<string>('');
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0]);

  const [nuevosPropietarios, setNuevosPropietarios] = useState<NuevoPropietarioInput[]>([
    { comuneroId: '', nombre: '', certificado: '', porcentaje: 100 }
  ]);


  const obtenerNombreCompleto = (c: Comunero) => {
    return [c.nombre, c.apellidoPaterno, c.apellidoMaterno].filter(Boolean).join(' ');
  };


  const comunerosDisponibles = comunerosRegistrados.filter(
    c => obtenerNombreCompleto(c) !== parcela.propietarios[0]
  );

  const handleAgregarAdquirente = () => {
    setNuevosPropietarios(prev => [
      ...prev,
      { comuneroId: '', nombre: '', certificado: '', porcentaje: 0 }
    ]);
  };

  const handleEliminarAdquirente = (index: number) => {
    if (nuevosPropietarios.length === 1) return;
    setNuevosPropietarios(prev => prev.filter((_, i) => i !== index));
  };

  const handleComuneroChange = (index: number, comuneroId: string) => {
    const seleccionado = comunerosRegistrados.find(c => c.id === comuneroId);
    setNuevosPropietarios(prev => prev.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          comuneroId,
          nombre: seleccionado ? obtenerNombreCompleto(seleccionado) : '',
        };
      }
      return item;
    }));
  };

  const handlePropiedadChange = (index: number, campo: keyof NuevoPropietarioInput, valor: any) => {
    setNuevosPropietarios(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, [campo]: valor };
      }
      return item;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const adquirentesValidos = nuevosPropietarios.filter(p => p.nombre.trim() !== '');
    if (adquirentesValidos.length === 0) {
      alert('Debe seleccionar al menos un nuevo propietario válido.');
      return;
    }

    onConfirmar({
      nuevosPropietarios: adquirentesValidos,
      actoJuridico,
      motivo,
      fecha
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto z-10 p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-700 rounded-xl">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Traspasar Parcela {parcela.numero}</h3>
              <p className="text-xs text-gray-500 font-medium">Titular actual: {parcela.propietarios.join(', ') || 'Sin titular'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-gray-700">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-500">Acto Jurídico</label>
              <select
                value={actoJuridico}
                onChange={(e) => setActoJuridico(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-amber-500"
              >
                <option value="Cesión de Derechos">Cesión de Derechos</option>
                <option value="Sucesión / Herencia">Sucesión / Herencia</option>
                <option value="Venta Comunitaria">Venta Comunitaria</option>
                <option value="Permuta">Permuta</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-500">Fecha de Operación</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-500">Observaciones / Motivo</label>
            <input
              type="text"
              placeholder="Ej. Acuerdo de asamblea del 12 de Mayo..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-amber-500"
            />
          </div>

          {/* Adquirentes */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900">Nuevos Titulares / Adquirentes</label>
              <button
                type="button"
                onClick={handleAgregarAdquirente}
                className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar otro
              </button>
            </div>

            {nuevosPropietarios.map((prop, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-gray-100 rounded-xl space-y-3 relative">
                <div className="flex items-center gap-2">
                  <select
                    value={prop.comuneroId}
                    onChange={(e) => handleComuneroChange(idx, e.target.value)}
                    className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:border-amber-500"
                  >
                    <option value="">-- Seleccionar Comunero --</option>
                    {comunerosDisponibles.map(c => (
                      <option key={c.id} value={c.id}>
                        {obtenerNombreCompleto(c)} ({c.tipo})
                      </option>
                    ))}
                  </select>

                  {nuevosPropietarios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleEliminarAdquirente(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="No. Certificado"
                    value={prop.certificado}
                    onChange={(e) => handlePropiedadChange(idx, 'certificado', e.target.value)}
                    className="p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:border-amber-500"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="Porcentaje %"
                      value={prop.porcentaje || ''}
                      onChange={(e) => handlePropiedadChange(idx, 'porcentaje', Number(e.target.value))}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold outline-none focus:border-amber-500"
                    />
                    <span className="text-gray-400 font-bold">%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs font-bold transition-colors"
            >
              Confirmar Traspaso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TraspasarParcelaModal;
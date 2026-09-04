"use client";

import React, { useState } from 'react';
import { ArrowRightLeft, X, Plus, Trash2 } from 'lucide-react';
import { Parcela } from '../types/domain.types';
import { Comunero } from '../../comuneros/types/types';
import { ComuneroPicker } from './shared/ComuneroPicker';

interface AdquirenteFila {
  comuneroId: string;
  nombre: string;
  certificado: string;
}

interface TraspasarParcelaModalProps {
  parcela: Parcela;
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onConfirmar: (datos: {
    adquirentes: { comuneroId: string; nombre: string; certificado: string }[];
    actoJuridico: string;
    motivo: string;
    fecha: string;
  }) => void;
}

const nombreCompletoDe = (c: Comunero) => {
  const anyC = c as any;
  const apellidos = anyC.apellidos ?? [anyC.apellidoPaterno, anyC.apellidoMaterno].filter(Boolean).join(' ');
  return [c.nombre, apellidos].filter(Boolean).join(' ').trim();
};

export const TraspasarParcelaModal: React.FC<TraspasarParcelaModalProps> = ({
  parcela,
  comunerosRegistrados,
  onClose,
  onConfirmar,
}) => {
  const [actoJuridico, setActoJuridico] = useState('Cesión de Derechos');
  const [motivo, setMotivo] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [adquirentes, setAdquirentes] = useState<AdquirenteFila[]>([
    { comuneroId: '', nombre: '', certificado: `CERT-${Math.floor(1000 + Math.random() * 9000)}` },
  ]);

  // Corregido: excluye a TODOS los titulares actuales (antes solo excluía
  // al primero, permitiendo "traspasar" a un co-titular ya existente).
  const idsExcluidos = comunerosRegistrados
    .filter(c => parcela.propietarios.includes(nombreCompletoDe(c)))
    .map(c => c.id);

  const agregarFila = () => {
    setAdquirentes(prev => [...prev, { comuneroId: '', nombre: '', certificado: `CERT-${Math.floor(1000 + Math.random() * 9000)}` }]);
  };

  const eliminarFila = (index: number) => {
    if (adquirentes.length > 1) setAdquirentes(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarFila = (index: number, campo: keyof AdquirenteFila, valor: string) => {
    setAdquirentes(prev => prev.map((fila, i) => i === index ? { ...fila, [campo]: valor } : fila));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adquirentes.some(a => !a.comuneroId || !a.nombre)) {
      alert('Seleccione un comunero válido para cada adquirente.');
      return;
    }
    const [year, month, day] = fecha.split('-');
    onConfirmar({
      adquirentes: adquirentes.map(a => ({ comuneroId: a.comuneroId, nombre: a.nombre, certificado: a.certificado })),
      actoJuridico,
      motivo,
      fecha: `${day}/${month}/${year}`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10 flex flex-col">
        <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
              <ArrowRightLeft className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Traspasar Parcela {parcela.numero}</h3>
              <p className="text-[10px] text-gray-500">
                Titular(es) actual(es): <strong className="text-gray-700">{parcela.propietarios.join(', ') || 'Sin titular'}</strong>
                {' '}• Superficie: <strong className="text-emerald-800">{parcela.superficie}</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-gray-700 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <label className="block text-gray-500">Acto Jurídico</label>
              <select value={actoJuridico} onChange={(e) => setActoJuridico(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500">
                <option value="Cesión de Derechos">Cesión de Derechos</option>
                <option value="Sucesión Hereditaria">Sucesión Hereditaria</option>
                <option value="Compraventa">Compraventa Contractual</option>
                <option value="Donación Directa">Donación Directa</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-gray-500">Fecha de Operación</label>
              <input type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500" />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-500">Observaciones / Motivo</label>
            <input type="text" placeholder="Ej. Acuerdo de asamblea del 12 de mayo..." value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full p-2.5 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-amber-500" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-900">Nuevos Titulares / Adquirentes</label>
              <button type="button" onClick={agregarFila} className="text-xs text-amber-600 font-bold hover:underline flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Agregar otro
              </button>
            </div>

            {adquirentes.map((fila, index) => (
              <div key={index} className="p-3 bg-slate-50 border border-gray-100 rounded-xl space-y-2 relative">
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    <ComuneroPicker
                      items={comunerosRegistrados}
                      selectedId={fila.comuneroId}
                      excludeIds={idsExcluidos}
                      getId={(c) => c.id}
                      getLabel={nombreCompletoDe}
                      getSubtitle={(c) => c.tipo.toUpperCase()}
                      placeholder="Buscar comunero o avecindado..."
                      onSelect={(c) => {
                        actualizarFila(index, 'comuneroId', c.id);
                        actualizarFila(index, 'nombre', nombreCompletoDe(c));
                      }}
                      required
                    />
                  </div>
                  {adquirentes.length > 1 && (
                    <button type="button" onClick={() => eliminarFila(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Nº Certificado emitido"
                  value={fila.certificado}
                  onChange={(e) => actualizarFila(index, 'certificado', e.target.value)}
                  className="w-full p-2 bg-white border border-gray-200 rounded-lg font-mono outline-none focus:border-amber-500"
                />
              </div>
            ))}
          </div>

          <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-[10px] font-medium leading-tight">
            ⚠️ <strong>Nota Registral:</strong> El o los titulares actuales pasarán al historial registral de la parcela.
          </div>

          <div className="flex gap-2 pt-2">
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

export default TraspasarParcelaModal;
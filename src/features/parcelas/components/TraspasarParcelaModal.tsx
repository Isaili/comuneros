"use client";

import React, { useState } from 'react';
import { ArrowRightLeft, X } from 'lucide-react';
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
    targetOwnershipId: string;
    oldPersonId: string;
    adquirente: { comuneroId: string; nombre: string; certificado: string };
    actoJuridico: string;
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
  const [titularSeleccionadoId, setTitularSeleccionadoId] = useState(
    parcela.titularesDetalle?.[0]?.ownershipId ?? '',
  );
  const [adquirente, setAdquirente] = useState<AdquirenteFila>({
    comuneroId: '',
    nombre: '',
    certificado: `CERT-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  // Corregido: excluye a TODOS los titulares actuales (antes solo excluía
  // al primero, permitiendo "traspasar" a un co-titular ya existente).
  const idsExcluidos = comunerosRegistrados
    .filter(c => parcela.propietarios.includes(nombreCompletoDe(c)))
    .map(c => c.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titularActual = parcela.titularesDetalle?.find(
      (titular) => titular.ownershipId === titularSeleccionadoId,
    );
    if (!titularActual?.ownershipId) {
      alert('Seleccione un titular activo válido para realizar el traspaso.');
      return;
    }
    if (!adquirente.comuneroId || !adquirente.nombre || !adquirente.certificado.trim()) {
      alert('Seleccione un comunero y capture su certificado.');
      return;
    }
    onConfirmar({
      targetOwnershipId: titularActual.ownershipId,
      oldPersonId: titularActual.comuneroId,
      adquirente: { ...adquirente, certificado: adquirente.certificado.trim() },
      actoJuridico,
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
          <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
            <div className="space-y-1">
              <label className="block text-gray-500">Acto Jurídico</label>
              <select value={actoJuridico} onChange={(e) => setActoJuridico(e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500">
                <option value="Cesión de Derechos">Cesión de Derechos</option>
                <option value="Sucesión Hereditaria">Sucesión Hereditaria</option>
                <option value="Compraventa">Compraventa Contractual</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-gray-500">Titular actual a traspasar</label>
            <select
              value={titularSeleccionadoId}
              onChange={(e) => setTitularSeleccionadoId(e.target.value)}
              required
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-amber-500"
            >
              <option value="">Selecciona un titular</option>
              {parcela.titularesDetalle?.map((titular) => (
                <option key={titular.ownershipId ?? titular.comuneroId} value={titular.ownershipId ?? ''}>
                  {titular.nombreCompleto} · {titular.hectareasPosesion.toFixed(2)} ha
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-900">Nuevo titular</label>
            <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl space-y-2">
              <ComuneroPicker
                items={comunerosRegistrados}
                selectedId={adquirente.comuneroId}
                excludeIds={idsExcluidos}
                getId={(c) => c.id}
                getLabel={nombreCompletoDe}
                getSubtitle={(c) => c.tipo.toUpperCase()}
                placeholder="Buscar comunero o avecindado..."
                onSelect={(c) => setAdquirente((actual) => ({
                  ...actual,
                  comuneroId: c.id,
                  nombre: nombreCompletoDe(c),
                }))}
                required
              />
              <input
                type="text"
                required
                placeholder="Nº Certificado emitido"
                value={adquirente.certificado}
                onChange={(e) => setAdquirente((actual) => ({ ...actual, certificado: e.target.value }))}
                className="w-full p-2 bg-white border border-gray-200 rounded-lg font-mono outline-none focus:border-amber-500"
              />
            </div>
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
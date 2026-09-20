"use client";

import React, { useState } from 'react';
import { Trash2, UserPlus, X } from 'lucide-react';
import { Comunero } from '../../comuneros/types/types';
import { DerechoUsoFila, Parcela } from '../types/domain.types';
import { ComuneroPicker } from './shared/ComuneroPicker';
import LoadingOverlay from '@/components/LoadingOverlay';

interface DerechosUsoModalProps {
  parcela: Parcela;
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onAsignar: (personId: string) => Promise<void>;
  onRemover: (personId: string) => Promise<void>;
}

const nombreCompletoDe = (persona: Comunero) =>
  [persona.nombre, persona.apellidos ?? [persona.apellidoPaterno, persona.apellidoMaterno].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(' ');

export function DerechosUsoModal({ parcela, comunerosRegistrados, onClose, onAsignar, onRemover }: DerechosUsoModalProps) {
  const [derechosUso, setDerechosUso] = useState<DerechoUsoFila[]>(parcela.derechosUsoDetalle ?? []);
  const [personaId, setPersonaId] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const asignar = async () => {
    if (guardando) return;
    const persona = comunerosRegistrados.find((item) => item.id === personaId);
    if (!persona) return;
    setGuardando(true);
    setError('');
    try {
      await onAsignar(persona.id);
      setDerechosUso((actual) => [...actual, {
        comuneroId: persona.id,
        nombreCompleto: nombreCompletoDe(persona),
        foto: persona.fotografia,
        actoJuridico: '—',
      }]);
      setPersonaId('');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo asignar el derecho de uso.');
    } finally {
      setGuardando(false);
    }
  };

  const remover = async (personId: string) => {
    setGuardando(true);
    setError('');
    try {
      await onRemover(personId);
      setDerechosUso((actual) => actual.filter((derecho) => derecho.comuneroId !== personId));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo retirar el derecho de uso.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      {guardando && <LoadingOverlay message="Guardando derecho de uso..." />}
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl text-xs font-semibold text-gray-700">
        <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50 px-5 py-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
              <UserPlus className="h-4 w-4 text-sky-700" />
              Derechos de uso — Parcela {parcela.numero}
            </h3>
            <p className="mt-0.5 text-[11px] font-medium text-gray-400">Asigna o retira el derecho de uso para personas avecindadas.</p>
          </div>
          <button type="button" onClick={onClose} disabled={guardando} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1">
              <ComuneroPicker
                items={comunerosRegistrados}
                selectedId={personaId}
                excludeIds={derechosUso.map((derecho) => derecho.comuneroId)}
                getId={(persona) => persona.id}
                getLabel={nombreCompletoDe}
                getSubtitle={(persona) => persona.tipo.toUpperCase()}
                onSelect={(persona) => setPersonaId(persona.id)}
                placeholder="Buscar persona para derecho de uso..."
              />
            </div>
            <button type="button" onClick={() => void asignar()} disabled={!personaId || guardando} className="rounded-xl bg-sky-700 px-4 py-2.5 font-bold text-white disabled:opacity-60">
              Asignar
            </button>
          </div>

          {derechosUso.length > 0 ? (
            <div className="divide-y divide-sky-100 overflow-hidden rounded-xl border border-sky-100 bg-white">
              {derechosUso.map((derecho) => (
                <div key={derecho.comuneroId} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-800">{derecho.nombreCompleto}</p>
                    <p className="text-[10px] text-slate-400">{derecho.actoJuridico}</p>
                  </div>
                  <button type="button" onClick={() => void remover(derecho.comuneroId)} disabled={guardando} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-50 disabled:opacity-50">
                    <Trash2 className="h-3.5 w-3.5" /> Retirar
                  </button>
                </div>
              ))}
            </div>
          ) : <p className="text-[11px] font-medium text-slate-400">Sin derechos de uso asignados.</p>}

          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        </div>

        <div className="flex border-t border-gray-100 bg-slate-50 p-4">
          <button type="button" onClick={onClose} className="w-full rounded-xl bg-[#006837] py-2.5 font-bold text-white hover:bg-[#00522b]">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

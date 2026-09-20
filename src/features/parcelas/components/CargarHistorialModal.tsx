"use client";

import React, { useState } from 'react';
import { History, Save, X } from 'lucide-react';
import { Comunero } from '../../comuneros/types/types';
import { ComuneroPicker } from './shared/ComuneroPicker';
import LoadingOverlay from '@/components/LoadingOverlay';

interface CargarHistorialModalProps {
  comuneros: Comunero[];
  onClose: () => void;
  onGuardar: (registro: {
    personId: string;
    hectares: number;
    certificate: string;
    transferType: string;
    startDate: string;
    endDate: string;
    previousOwnerId?: string;
    finalizationReason: string;
  }) => Promise<void>;
}

const nombreCompletoDe = (persona: Comunero) =>
  [persona.nombre, persona.apellidos ?? [persona.apellidoPaterno, persona.apellidoMaterno].filter(Boolean).join(' ')]
    .filter(Boolean)
    .join(' ');

export function CargarHistorialModal({ comuneros, onClose, onGuardar }: CargarHistorialModalProps) {
  const [personId, setPersonId] = useState('');
  const [hectares, setHectares] = useState('');
  const [certificate, setCertificate] = useState('');
  const [transferType, setTransferType] = useState('SALE');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [previousOwnerId, setPreviousOwnerId] = useState('');
  const [finalizationReason, setFinalizationReason] = useState('SALE');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSaving) return;
    const hectaresNumber = Number(hectares);
    if (!personId || !Number.isFinite(hectaresNumber) || hectaresNumber <= 0) {
      setError('Selecciona a la persona e indica una superficie válida.');
      return;
    }

    setIsSaving(true);
    setError('');
    try {
      await onGuardar({
        personId,
        hectares: hectaresNumber,
        certificate: certificate.trim(),
        transferType,
        startDate: new Date(`${startDate}T00:00:00.000Z`).toISOString(),
        endDate: new Date(`${endDate}T00:00:00.000Z`).toISOString(),
        previousOwnerId: previousOwnerId || undefined,
        finalizationReason,
      });
      onClose();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cargar el historial.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      {isSaving && <LoadingOverlay message="Guardando registro histórico..." />}
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 bg-slate-50 px-5 py-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <History className="h-4 w-4 text-amber-700" />
            Cargar registro histórico
          </h3>
          <button type="button" onClick={onClose} disabled={isSaving} className="rounded-lg p-1 text-gray-500 hover:bg-gray-200">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 p-5 text-xs font-semibold text-gray-700">
          <p className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-[11px] text-amber-800">
            Registra un propietario anterior. Puedes repetir esta acción para cargar más registros históricos.
          </p>
          <div>
            <label className="mb-1 block text-gray-500">Propietario anterior</label>
            <ComuneroPicker items={comuneros} selectedId={personId} onSelect={(persona) => setPersonId(persona.id)} getId={(persona) => persona.id} getLabel={nombreCompletoDe} getSubtitle={(persona) => persona.tipo.toUpperCase()} placeholder="Buscar persona..." required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1"><span className="block text-gray-500">Hectáreas</span><input required min="0.0001" step="0.0001" type="number" value={hectares} onChange={(e) => setHectares(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5" /></label>
            <label className="space-y-1"><span className="block text-gray-500">Certificado</span><input required value={certificate} onChange={(e) => setCertificate(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5" /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1"><span className="block text-gray-500">Inicio</span><input required type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5" /></label>
            <label className="space-y-1"><span className="block text-gray-500">Fin</span><input required type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full rounded-xl border border-gray-200 px-3 py-2.5" /></label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1"><span className="block text-gray-500">Tipo de transmisión</span><select value={transferType} onChange={(e) => setTransferType(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5"><option value="SALE">Compraventa</option><option value="INHERITANCE">Herencia</option></select></label>
            <label className="space-y-1"><span className="block text-gray-500">Motivo de finalización</span><select value={finalizationReason} onChange={(e) => setFinalizationReason(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5"><option value="SALE">Compraventa</option><option value="INHERITANCE">Herencia</option></select></label>
          </div>
          <div>
            <label className="mb-1 block text-gray-500">Propietario previo (opcional)</label>
            <ComuneroPicker items={comuneros} selectedId={previousOwnerId} onSelect={(persona) => setPreviousOwnerId(persona.id)} getId={(persona) => persona.id} getLabel={nombreCompletoDe} getSubtitle={(persona) => persona.tipo.toUpperCase()} placeholder="Buscar propietario previo..." />
          </div>
          {error && <p className="text-xs font-bold text-red-600">{error}</p>}
        </div>
        <div className="flex gap-2 border-t border-gray-100 bg-slate-50 p-4">
          <button type="button" onClick={onClose} disabled={isSaving} className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 font-bold text-gray-600">Cancelar</button>
          <button type="submit" disabled={isSaving} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#006837] py-2.5 font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />{isSaving ? 'Guardando...' : 'Cargar historial'}</button>
        </div>
      </form>
    </div>
  );
}

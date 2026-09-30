"use client";

import React, { useEffect, useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { Comunero } from '../../comuneros/types/types';
import { ComuneroPicker } from './shared/ComuneroPicker';
import LoadingOverlay from '@/components/LoadingOverlay';
import { plotsService } from '../services/parcelas.service';

interface AsignarTitularModalProps {
  parcela: { id: string; superficieHa: number; titularesDetalle?: { hectareasPosesion: number }[] };
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onAsignar: (datos: {
    comuneroId: string;
    nombreCompleto: string;
    hectares: number;
    certificate: string;
    transferType: string;
  }) => Promise<void> | void;
}

// NOTA: el tipo Comunero ha tenido dos formas distintas en el código
// (una con `apellidos`, otra con `apellidoPaterno`/`apellidoMaterno`).
// Este helper soporta ambas mientras se unifica el tipo real en
// `features/comuneros/types/types.ts`.
const nombreCompletoDe = (c: Comunero) => {
  const anyC = c as any;
  const apellidos = anyC.apellidos ?? [anyC.apellidoPaterno, anyC.apellidoMaterno].filter(Boolean).join(' ');
  return [c.nombre, apellidos].filter(Boolean).join(' ').trim();
};

export const AsignarTitularModal: React.FC<AsignarTitularModalProps> = ({
  parcela,
  comunerosRegistrados,
  onClose,
  onAsignar,
}) => {
  const hectareasActivas = (parcela.titularesDetalle ?? []).reduce((suma, t) => suma + (t.hectareasPosesion || 0), 0);
  const [hectareasHistoricas, setHectareasHistoricas] = useState(0);
  const [cargandoCapacidad, setCargandoCapacidad] = useState(true);

  useEffect(() => {
    let cancelado = false;
    // El backend cuenta también la superficie histórica ya asignada (aunque ya no tenga titular activo)
    // para validar la capacidad física de la parcela, por eso hay que sumarla aquí también.
    plotsService.history(parcela.id, 1, 200)
      .then((respuesta) => {
        if (cancelado) return;
        const suma = respuesta.data.items.reduce((acc, item) => acc + (item.hectares || 0), 0);
        setHectareasHistoricas(suma);
      })
      .catch(() => { if (!cancelado) setHectareasHistoricas(0); })
      .finally(() => { if (!cancelado) setCargandoCapacidad(false); });
    return () => { cancelado = true; };
  }, [parcela.id]);

  const hectareasYaAsignadas = hectareasActivas + hectareasHistoricas;
  const hectareasDisponibles = Math.max(0, parcela.superficieHa - hectareasYaAsignadas);

  const [seleccionadoId, setSeleccionadoId] = useState<string>('');
  const [hectares, setHectares] = useState(String(parcela.superficieHa));
  const [certificate, setCertificate] = useState('');
  const [transferType, setTransferType] = useState('SALE');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!cargandoCapacidad) {
      setHectares(String(hectareasDisponibles || parcela.superficieHa));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargandoCapacidad]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (guardando) return;
    if (hectareasYaAsignadas > 0 && hectareasDisponibles <= 0) {
      alert('Esta parcela ya alcanzó su capacidad física máxima (toda la superficie ya está asignada, incluyendo historial). Usa "Traspaso" en vez de "Asignar Titular".');
      return;
    }
    const comunero = comunerosRegistrados.find(c => c.id === seleccionadoId);
    if (!comunero) {
      alert('Por favor seleccione un titular.');
      return;
    }
    const hectaresNumber = Number(hectares);
    if (!Number.isFinite(hectaresNumber) || hectaresNumber <= 0 || !certificate.trim()) {
      alert('Indique las hectáreas y el certificado del titular.');
      return;
    }
    if (hectareasDisponibles > 0 && hectaresNumber > hectareasDisponibles) {
      alert(`Solo quedan ${hectareasDisponibles.toFixed(4)} ha disponibles en esta parcela (considerando historial). Para superficie ya asignada usa Traspaso en vez de Asignar Titular.`);
      return;
    }
    setGuardando(true);
    try {
      await onAsignar({
        comuneroId: comunero.id,
        nombreCompleto: nombreCompletoDe(comunero),
        hectares: hectaresNumber,
        certificate: certificate.trim(),
        transferType,
      });
    } catch (cause) {
      alert(cause instanceof Error ? cause.message : 'No se pudo asignar el titular.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      {guardando && <LoadingOverlay message="Asignando titular..." />}
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-visible z-10 flex flex-col">
        <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-700 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-gray-900">Asignar Titular de Parcela</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-gray-700">
          <div className="space-y-1">
            <label className="text-gray-500 font-bold block">Buscar Comunero / Avecindado</label>
            <ComuneroPicker
              items={comunerosRegistrados}
              selectedId={seleccionadoId}
              onSelect={(c) => setSeleccionadoId(c.id)}
              getId={(c) => c.id}
              getLabel={nombreCompletoDe}
              getSubtitle={(c) => `${c.tipo.toUpperCase()}${(c as any).vecindario ? ` • ${(c as any).vecindario}` : ''}`}
              placeholder="Buscar por nombre o barrio..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-gray-500 font-bold block">
                Hectáreas {cargandoCapacidad ? (
                  <span className="font-normal text-gray-400">(calculando disponibilidad...)</span>
                ) : hectareasYaAsignadas > 0 && hectareasDisponibles <= 0 ? (
                  <span className="font-normal text-red-600">(sin superficie disponible, usa Traspaso)</span>
                ) : hectareasDisponibles > 0 ? (
                  <span className="font-normal text-emerald-700">({hectareasDisponibles.toFixed(4)} ha disponibles)</span>
                ) : null}
              </label>
              <input type="number" min="0.0001" step="0.0001" required value={hectares} onChange={(e) => setHectares(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" />
            </div>
            <div className="space-y-1">
              <label className="text-gray-500 font-bold block">Certificado</label>
              <input type="text" required value={certificate} onChange={(e) => setCertificate(e.target.value)} placeholder="CERT-2026-000123" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-500 font-bold block">Tipo de adquisición</label>
            <select value={transferType} onChange={(e) => setTransferType(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white">
              <option value="SALE">Compraventa</option>
              <option value="INHERITANCE">Herencia</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} disabled={guardando} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold disabled:opacity-50">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!seleccionadoId || guardando}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl shadow-xs font-bold transition-colors"
            >
              {guardando ? 'Guardando...' : 'Confirmar Asignación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignarTitularModal;
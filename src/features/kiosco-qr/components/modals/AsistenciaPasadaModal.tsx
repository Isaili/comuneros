"use client";

import React, { useEffect, useState } from 'react';
import { X, ClipboardCheck, ShieldCheck } from 'lucide-react';
import { assembliesApi, obtenerItemsPaginados, AttendanceDTO } from '../../services/assembliesApi';
import LoadingOverlay from '@/components/LoadingOverlay';

interface AsistenciaPasadaModalProps {
  reunionId: string;
  reunionNombre: string;
  onClose: () => void;
}

type FiltroEstado = 'ALL' | 'PRESENT' | 'ABSENT' | 'JUSTIFIED' | 'LEFT_EARLY';

const ETIQUETAS_ESTADO: Record<Exclude<FiltroEstado, 'ALL'>, string> = {
  PRESENT: 'Presente',
  ABSENT: 'Ausente',
  JUSTIFIED: 'Justificado',
  LEFT_EARLY: 'Salió antes',
};

const ESTILOS_ESTADO: Record<Exclude<FiltroEstado, 'ALL'>, string> = {
  PRESENT: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  ABSENT: 'bg-red-50 text-red-700 border-red-100',
  JUSTIFIED: 'bg-blue-50 text-blue-700 border-blue-100',
  LEFT_EARLY: 'bg-amber-50 text-amber-700 border-amber-100',
};

const formatoFechaHora = (valor?: string | null) =>
  valor ? new Date(valor).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

export const AsistenciaPasadaModal: React.FC<AsistenciaPasadaModalProps> = ({ reunionId, reunionNombre, onClose }) => {
  const [registros, setRegistros] = useState<AttendanceDTO[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FiltroEstado>('ALL');
  const [personaAJustificar, setPersonaAJustificar] = useState<string | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setCargando(true);
    setError(null);
    assembliesApi.asistencias(reunionId, { page: 1, limit: 100 })
      .then((response) => setRegistros(obtenerItemsPaginados(response.data.data)))
      .catch((err) => setError(err instanceof Error ? err.message : 'No se pudo cargar la asistencia.'))
      .finally(() => setCargando(false));
  }, [reunionId]);

  const conteos = registros.reduce<Record<string, number>>((acc, registro) => {
    const estado = registro.attendanceStatus ?? registro.status;
    acc[estado] = (acc[estado] ?? 0) + 1;
    return acc;
  }, {});

  const registrosFiltrados = filtro === 'ALL'
    ? registros
    : registros.filter((registro) => (registro.attendanceStatus ?? registro.status) === filtro);

  const abrirFormularioJustificar = (personId?: string) => {
    if (!personId) return;
    setPersonaAJustificar(personId);
    setObservaciones('');
  };

  const confirmarJustificacion = async () => {
    if (!personaAJustificar || guardando) return;
    if (!observaciones.trim()) {
      alert('Indica el motivo de la justificación.');
      return;
    }
    setGuardando(true);
    try {
      await assembliesApi.justificar(reunionId, personaAJustificar, observaciones.trim());
      setRegistros((prev) => prev.map((registro) => registro.personId === personaAJustificar
        ? { ...registro, attendanceStatus: 'JUSTIFIED', status: 'JUSTIFIED', observations: observaciones.trim() }
        : registro));
      setPersonaAJustificar(null);
      setObservaciones('');
    } catch (cause) {
      alert(cause instanceof Error ? cause.message : 'No se pudo justificar la inasistencia.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      {guardando && <LoadingOverlay message="Guardando justificación..." />}
      <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-gray-700 text-sm font-semibold">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2 min-w-0">
            <span className="p-1.5 bg-[#1E4D3A]/10 text-[#1E4D3A] rounded-lg shrink-0">
              <ClipboardCheck className="w-4 h-4" />
            </span>
            <span className="truncate">Asistencia · {reunionNombre}</span>
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-4 flex flex-wrap gap-2 shrink-0">
          {(['ALL', 'PRESENT', 'ABSENT', 'JUSTIFIED', 'LEFT_EARLY'] as FiltroEstado[]).map((estado) => (
            <button
              key={estado}
              type="button"
              onClick={() => setFiltro(estado)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                filtro === estado
                  ? 'bg-[#1E4D3A] text-white border-[#1E4D3A]'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {estado === 'ALL' ? `Todos (${registros.length})` : `${ETIQUETAS_ESTADO[estado]} (${conteos[estado] ?? 0})`}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-2 overflow-y-auto flex-1">
          {cargando ? (
            <p className="text-xs text-gray-400 text-center py-8">Cargando asistencia...</p>
          ) : error ? (
            <p className="text-xs text-red-600 text-center py-8">{error}</p>
          ) : registrosFiltrados.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">No hay registros para este filtro.</p>
          ) : (
            registrosFiltrados.map((registro) => {
              const estado = (registro.attendanceStatus ?? registro.status) as Exclude<FiltroEstado, 'ALL'>;
              const esAusente = estado === 'ABSENT';
              const enEdicion = personaAJustificar === registro.personId;
              return (
                <div key={registro.personId ?? registro.fullName} className="border border-gray-100 rounded-xl p-3 bg-gray-50/40">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate">{registro.fullName ?? 'Sin nombre'}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] font-semibold text-gray-500">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold ${ESTILOS_ESTADO[estado] ?? 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                          {ETIQUETAS_ESTADO[estado] ?? estado}
                        </span>
                        {registro.recordedAt && <span>Entrada: {formatoFechaHora(registro.recordedAt)}</span>}
                        {registro.exitTime && <span>Salida: {formatoFechaHora(registro.exitTime)}</span>}
                      </div>
                      {registro.observations && (
                        <p className="text-[11px] text-gray-500 mt-1 italic">&quot;{registro.observations}&quot;</p>
                      )}
                    </div>
                    {esAusente && !enEdicion && (
                      <button
                        type="button"
                        onClick={() => abrirFormularioJustificar(registro.personId)}
                        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" /> Justificar
                      </button>
                    )}
                  </div>

                  {enEdicion && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                      <label className="block text-[11px] text-gray-500 font-bold uppercase tracking-wide">Motivo de la justificación</label>
                      <textarea
                        value={observaciones}
                        onChange={(e) => setObservaciones(e.target.value)}
                        rows={2}
                        placeholder="Ej. Cita médica, permiso autorizado, etc."
                        className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-xs font-medium"
                      />
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setPersonaAJustificar(null)} disabled={guardando} className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                          Cancelar
                        </button>
                        <button type="button" onClick={confirmarJustificacion} disabled={guardando} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold disabled:opacity-60">
                          {guardando ? 'Guardando...' : 'Confirmar justificación'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AsistenciaPasadaModal;

"use client";

import React, { useMemo, useState } from 'react';
import { X, Ruler, UserPlus, PencilLine } from 'lucide-react';
import { Comunero } from '../../comuneros/types/types';
import { ComuneroPicker } from '../../parcelas/components/shared/ComuneroPicker';
import { Lote as LoteSimple } from './LotesList';

interface DividirLoteModalProps {
  lote: LoteSimple;
  comunerosRegistrados: Comunero[];
  onClose: () => void;
  onConfirmar?: (payload: {
    comuneroId: string;
    nombreCompleto: string;
    largo: number;
    ancho: number;
    superficieFraccion: number;
    motivo: string;
  }) => void;
}

const nombreCompletoDe = (c: Comunero) => {
  const anyC = c as any;
  const apellidos = anyC.apellidos ?? [anyC.apellidoPaterno, anyC.apellidoMaterno].filter(Boolean).join(' ');
  return [c.nombre, apellidos].filter(Boolean).join(' ').trim();
};

export const DividirLoteModal: React.FC<DividirLoteModalProps> = ({
  lote,
  comunerosRegistrados,
  onClose,
  onConfirmar,
}) => {
  const superficieOriginal = Number.parseFloat(lote.superficie) || 100;
  const [comuneroId, setComuneroId] = useState<string>('');
  const [largo, setLargo] = useState<number>(Math.min(Math.max(superficieOriginal / 4, 2), 20));
  const [ancho, setAncho] = useState<number>(Math.min(Math.max(superficieOriginal / 10, 2), 20));
  const [motivo, setMotivo] = useState<string>('Venta de fracción de terreno');

  const superficieFraccion = useMemo(() => Number((largo * ancho).toFixed(2)), [largo, ancho]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comuneroId) {
      alert('Seleccione un comunero titular para la fracción.');
      return;
    }

    const comunero = comunerosRegistrados.find((item) => item.id === comuneroId);
    if (!comunero) {
      alert('El comunero seleccionado no está disponible.');
      return;
    }

    onConfirmar?.({
      comuneroId,
      nombreCompleto: nombreCompletoDe(comunero),
      largo: Number(largo),
      ancho: Number(ancho),
      superficieFraccion,
      motivo,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-visible z-10 flex flex-col max-h-[92vh]">
        <div className="bg-slate-50 border-b border-gray-100 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-700 rounded-lg">
              <PencilLine className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-gray-900">Dividir / vender fracción de lote</h3>
              <p className="text-[10px] text-gray-500 font-medium">{lote.numero} • Superficie total: {lote.superficie}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-semibold text-gray-700 overflow-y-auto">
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3 text-[10px] leading-relaxed">
            La fracción segregada puede venderse y quedar como un nuevo lote. Selecciona el nuevo titular y define las medidas de la parte que se está vendiendo.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1 md:col-span-2">
              <label className="text-gray-500 font-bold block">Titular de la fracción</label>
              <ComuneroPicker
                items={comunerosRegistrados}
                selectedId={comuneroId}
                onSelect={(item) => setComuneroId(item.id)}
                getId={(item) => item.id}
                getLabel={nombreCompletoDe}
                getSubtitle={(item) => `${(item.tipo ?? 'Comunero').toUpperCase()}${item.folioComunero ? ` • ${item.folioComunero}` : ''}`}
                placeholder="Buscar comunero o avecindado..."
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-500 font-bold block">Largo a vender (m)</label>
              <div className="relative">
                <Ruler className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-600" />
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={largo}
                  onChange={(e) => setLargo(Number(e.target.value || 0))}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 font-bold outline-none focus:border-emerald-600 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-500 font-bold block">Ancho a vender (m)</label>
              <div className="relative">
                <Ruler className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-600" />
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={ancho}
                  onChange={(e) => setAncho(Number(e.target.value || 0))}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 font-bold outline-none focus:border-emerald-600 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="text-gray-500 font-bold block">Motivo / acto jurídico</label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 font-bold outline-none focus:border-emerald-600 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">Superficie fracción</p>
              <p className="text-lg font-black text-emerald-700 mt-1">{formatSuperficie(superficieFraccion)}</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
              <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">Resto del lote</p>
              <p className="text-lg font-black text-slate-700 mt-1">{formatSuperficie(Math.max(superficieOriginal - superficieFraccion, 0))}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs font-bold transition-colors">
              Guardar fracción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

function formatSuperficie(value: number) {
  return `${Number(value).toFixed(2)} m²`;
}

export default DividirLoteModal;

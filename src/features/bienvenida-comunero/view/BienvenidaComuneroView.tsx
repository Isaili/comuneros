"use client";

import React from 'react';
import { PantallaBienvenidaState } from '../viewmodel/usePantallaBienvenidaViewModel';
import { EstadoReunionBanner } from './components/EstadoReunionBanner';
import { BienvenidaSpotlight } from './components/BienvenidaSpotlight';
import { HistorialRecienteTira } from './components/HistorialRecienteTira';
import { Monitor } from 'lucide-react';

type BienvenidaComuneroViewProps = PantallaBienvenidaState;

export const BienvenidaComuneroView: React.FC<BienvenidaComuneroViewProps> = ({
  reunionActiva,
  totalAsistentes,
  eventoDestacado,
  historial,
  conectado,
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
        <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
          <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
            <Monitor className="w-5 h-5" />
          </span>
          Pantalla de bienvenida
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
          Se actualiza en tiempo real conforme se registran entradas y salidas en el Kiosco QR.
        </p>
      </div>

      {!conectado && (
        <div className="bg-amber-50 border border-amber-100 text-amber-800 text-xs font-semibold rounded-xl px-4 py-3">
          Este navegador no soporta actualizaciones en tiempo real entre pestañas. Abre esta pantalla en un navegador
          moderno (Chrome, Edge, Firefox) para verla sincronizada con el kiosco.
        </div>
      )}

      <EstadoReunionBanner reunion={reunionActiva} totalAsistentes={totalAsistentes} />

      <BienvenidaSpotlight evento={eventoDestacado} reunionActiva={!!reunionActiva} />

      <HistorialRecienteTira historial={historial} />
    </div>
  );
};
'use client';

import React, { useState } from 'react';
import { MapPin, Sparkles } from 'lucide-react';

interface AvisoItem {
  icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  subtitulo: string;
  badge?: string;
  fecha?: string;
}

interface PreviewAndAlertsProps {
  avisos: AvisoItem[];
}

// Vista satelital: se muestra primero (modo "Relieve")
const MAP_SRC_SATELITE =
  'https://www.google.com/maps?q=Copainal%C3%A1,+Chiapas,+29620&t=k&z=13&output=embed';
// Vista de calles: se muestra al cambiar a modo "Normal"
const MAP_SRC_NORMAL =
  'https://www.google.com/maps?q=Copainal%C3%A1,+Chiapas,+29620&t=m&z=13&output=embed';

export default function PreviewAndAlerts({ avisos }: PreviewAndAlertsProps) {
  // Vista inicial: "relieve" (estilizada). El usuario puede cambiar a "normal" (plana).
  const [mapStyleMode, setMapStyleMode] = useState<'relieve' | 'normal'>('relieve');
  const isRelieve = mapStyleMode === 'relieve';

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 w-full max-w-4xl mx-auto mt-2">

      {/* Mapa de Copainalá */}
      <div
        className={`relative flex flex-col h-[280px] w-full rounded-xl p-2.5 transition-all duration-300 ${
          isRelieve
            ? 'bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-white/10 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]'
            : 'bg-white/5 border border-white/10'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <h2 className="flex items-center gap-1 text-white font-serif text-[11px] tracking-wide">
            <MapPin className="w-3 h-3 text-[#E4C468]" />
            Ubicación &middot; Copainalá
          </h2>

          <div className="flex items-center gap-1.5">
            <span className="text-[9px] text-white/40 font-medium tabular-nums">C.P. 29620</span>

            {/* Switch de estilo */}
            <button
              type="button"
              onClick={() => setMapStyleMode(isRelieve ? 'normal' : 'relieve')}
              className={`flex items-center gap-0.5 text-[8px] font-medium px-1.5 py-0.5 rounded-full border transition-colors ${
                isRelieve
                  ? 'bg-[#E4C468]/15 border-[#E4C468]/30 text-[#E4C468] shadow-[0_1px_3px_rgba(0,0,0,0.3)]'
                  : 'bg-white/5 border-white/10 text-white/50 hover:text-white/70'
              }`}
              title="Cambiar estilo del mapa"
            >
              <Sparkles className="w-2 h-2" />
              {isRelieve ? 'Relieve' : 'Normal'}
            </button>
          </div>
        </div>

        {/* Marco del mapa */}
        <div
          className={`relative flex-1 min-h-0 rounded-lg overflow-hidden transition-all duration-300 ${
            isRelieve
              ? 'border border-white/15 shadow-[inset_0_2px_6px_rgba(0,0,0,0.55),inset_0_-1px_0_rgba(255,255,255,0.05)] ring-1 ring-black/40'
              : 'border border-white/10'
          }`}
        >
          <iframe
            title="Mapa de Copainalá C.P. 29620"
            src={isRelieve ? MAP_SRC_SATELITE : MAP_SRC_NORMAL}
            className={`w-full h-full border-0 transition-all duration-300 ${
              isRelieve ? 'grayscale-[15%] contrast-[1.05] saturate-[0.9]' : ''
            }`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {isRelieve && (
            <>
              {/* Vignette superior/inferior para profundidad, no bloquea interacción */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_18px_24px_-18px_rgba(0,0,0,0.65),inset_0_-14px_20px_-16px_rgba(0,0,0,0.5)]" />

              {/* Etiqueta flotante estilo "chip" con relieve */}
              <div
                className="pointer-events-none absolute bottom-1.5 left-1.5 flex items-center gap-1
                           bg-[#0E170F]/90 backdrop-blur-sm border border-white/10 rounded-full
                           px-2 py-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
              >
                <span className="w-1 h-1 rounded-full bg-[#E4C468] shadow-[0_0_5px_1px_rgba(228,196,104,0.7)]" />
                <span className="text-[7.5px] text-white/80 font-medium">Copainalá, Chiapas</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Avisos recientes */}
      <div
        className="flex flex-col h-[280px] w-full rounded-xl p-2.5
                   bg-gradient-to-b from-white/[0.07] to-white/[0.02]
                   border border-white/10
                   shadow-[0_8px_24px_-6px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <h2 className="text-white font-serif text-xs tracking-wide">Avisos recientes</h2>
          <a href="#" className="text-[10px] font-medium text-[#E4C468] hover:underline">Ver todos</a>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto pr-0.5 custom-scrollbar">
          {avisos.map(({ icon: Icon, titulo, subtitulo, badge }) => (
            <div
              key={titulo}
              className="flex items-start gap-1.5 shrink-0 border-b border-white/[0.04] pb-2 last:border-0"
            >
              <div
                className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0
                           border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.35)]"
              >
                <Icon className="w-2.5 h-2.5 text-[#E4C468]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white font-medium leading-snug truncate">{titulo}</p>
                <p className="text-[10px] text-white/50 mt-0.5 leading-snug truncate">{subtitulo}</p>
              </div>
              {badge && (
                <span
                  className="shrink-0 text-[8px] font-semibold bg-emerald-500/20 text-emerald-300
                             px-1.5 py-0.5 rounded-full border border-emerald-400/20
                             shadow-[0_1px_3px_rgba(0,0,0,0.3)]"
                >
                  {badge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
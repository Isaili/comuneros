'use client';

import React from 'react';
import {
  ShieldCheck,
  Search,
  UserCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarNavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface AvisoItem {
  icon: React.ComponentType<{ className?: string }>;
  titulo: string;
  subtitulo: string;
  badge?: string;
  fecha?: string;
}

interface PreviewAndAlertsProps {
  sidebarNav: SidebarNavItem[];
  avisos: AvisoItem[];
}

export default function PreviewAndAlerts({ sidebarNav, avisos }: PreviewAndAlertsProps) {
  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 w-full max-w-4xl mx-auto mt-2">
      
      {/* Vista previa del sistema */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-2 flex flex-col h-[280px] w-full">
        <h2 className="text-white font-serif text-[10px] mb-1 shrink-0">Vista previa del sistema</h2>
        <div className="flex rounded-md overflow-hidden border border-white/10 bg-[#0E170F] flex-1 min-h-0">
          <div className="hidden sm:flex flex-col w-20 bg-[#0B120C] border-r border-white/10 p-1 shrink-0">
            <div className="flex items-center gap-0.5 mb-1 pb-1 border-b border-white/10">
              <div className="w-3 h-3 rounded-full border border-[#E4C468]/50 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-1 h-1 text-[#E4C468]" />
              </div>
              <span className="text-[5.5px] text-white/70 font-semibold leading-tight truncate">Casa de Bienes</span>
            </div>
            <nav className="flex flex-col gap-0.5">
              {sidebarNav.map(({ icon: Icon, label }, i) => (
                <div
                  key={label}
                  className={`flex items-center gap-0.5 px-0.5 py-0 rounded text-[6px] ${
                    i === 0 ? 'bg-white/10 text-white' : 'text-white/50'
                  }`}
                >
                  <Icon className="w-1.5 h-1.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-1 min-w-0 flex flex-col h-full">
            <div className="flex items-center justify-between gap-1 p-1 border-b border-white/10 shrink-0">
              <span className="text-[7px] text-white/60 shrink-0">Mapa de parcelas</span>
              <div className="flex-1 flex items-center gap-0.5 bg-white/5 border border-white/10 rounded-full px-1 py-0 max-w-[80px]">
                <Search className="w-1 h-1 text-white/40 shrink-0" />
                <span className="text-[5.5px] text-white/40 truncate">Buscar...</span>
              </div>
              <UserCircle className="w-2 h-2 text-white/50 shrink-0" />
            </div>
            <div className="relative flex-1 bg-gradient-to-br from-[#2A3B1F] via-[#1C2A16] to-[#101B0E] overflow-hidden">
              <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
                <polyline points="20,20 60,10 120,40 100,90 40,100" fill="none" stroke="#E4C468" strokeWidth="1" />
              </svg>
              <div className="absolute top-[10%] left-[30%] w-[75px] bg-[#0E170F]/95 border border-white/10 rounded p-0.5 shadow-xl">
                <span className="text-[5.5px] font-semibold text-white block">Parcela 0234</span>
                <p className="text-[4.5px] text-white/60 leading-tight">María López H.<br />Sup: 2.45 ha</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 mt-1 shrink-0">
          <ChevronLeft className="w-2 h-2 text-white/40" />
          <div className="w-1 h-1 rounded-full bg-[#E4C468]" />
          <div className="w-0.5 h-0.5 rounded-full bg-white/30" />
          <ChevronRight className="w-2 h-2 text-white/40" />
        </div>
      </div>

      {/* Avisos recientes */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-2 flex flex-col h-[280px] w-full">
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <h2 className="text-white font-serif text-xs">Avisos recientes</h2>
          <a href="#" className="text-[10px] font-medium text-[#E4C468] hover:underline">Ver todos</a>
        </div>
        <div className="flex flex-col gap-3 overflow-y-auto pr-0.5 custom-scrollbar">
          {avisos.map(({ icon: Icon, titulo, subtitulo, badge }) => (
            <div key={titulo} className="flex items-start gap-1.5 shrink-0 border-b border-white/[0.03] pb-2 last:border-0">
              <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-2.5 h-2.5 text-[#E4C468]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white font-medium leading-snug truncate">{titulo}</p>
                <p className="text-[10px] text-white/50 mt-0.5 leading-snug truncate">{subtitulo}</p>
              </div>
              {badge && (
                <span className="shrink-0 text-[8px] font-semibold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">
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
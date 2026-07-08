'use client';

import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Users,
  Map,
  FileText,
  ShieldCheck,
  Home,
  BookOpen,
  BarChart3,
  Search,
  UserCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Settings,
  Calendar,
  Globe,
  MapPin,
} from 'lucide-react';

// --- Datos de ejemplo ---
const stats = [
  { icon: Users, label: 'COMUNEROS', value: '342', suffix: 'Registrados', trend: [4, 6, 3, 7, 5, 8, 6] },
  { icon: Map, label: 'PARCELAS ACTIVAS', value: '289', suffix: 'Registradas', trend: [3, 5, 4, 6, 8, 5, 7] },
  { icon: FileText, label: 'ACTAS Y ACUERDOS', value: '128', suffix: 'Registradas', trend: [5, 3, 6, 4, 7, 6, 8] },
  { icon: ShieldCheck, label: 'CERTIFICADOS', value: '96', suffix: 'Emitidos', trend: [2, 4, 3, 6, 5, 7, 6] },
];

const sidebarNav = [
  { icon: Home, label: 'Inicio' },
  { icon: Users, label: 'Comuneros' },
  { icon: Map, label: 'Parcelas' },
  { icon: FileText, label: 'Actas' },
  { icon: ShieldCheck, label: 'Certificados' },
  { icon: BookOpen, label: 'Historial jurídico' },
  { icon: BarChart3, label: 'Reportes' },
];

const avisos = [
  {
    icon: Users,
    titulo: 'Asamblea general extraordinaria',
    subtitulo: '15 de agosto de 2026',
    badge: 'Nuevo',
  },
  {
    icon: RefreshCcw,
    titulo: 'Actualización del padrón comunal',
    subtitulo: 'Nuevos registros y modificaciones',
    fecha: '12 Jul',
  },
  {
    icon: ShieldCheck,
    titulo: 'Nuevos certificados emitidos',
    subtitulo: 'Consulta los certificados disponibles',
    fecha: '10 Jul',
  },
  {
    icon: Settings,
    titulo: 'Mantenimiento del sistema',
    subtitulo: 'Domingo 20 de julio - 02:00 a.m.',
    fecha: '08 Jul',
  },
];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 100;
  const h = 20;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-4" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#6EE7B7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / (max - min || 1)) * h;
        const isPeak = v === max;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isPeak ? 2.5 : 1.5}
            fill={isPeak ? '#E4C468' : '#6EE7B7'}
          />
        );
      })}
    </svg>
  );
}

export default function DashboardHero() {
  const [tema, setTema] = useState<'claro' | 'oscuro'>('claro');

  return (
    // Se asegura el alto completo y una estructura flex vertical limpia
    <section className="relative min-h-screen w-full overflow-hidden font-sans flex flex-col justify-between">
      {/* --- FONDO --- */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/img1.webp')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A12]/90 via-[#12201580] to-[#0B140D]/95" />

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 flex-1 flex flex-col justify-between max-w-6xl w-full mx-auto px-4 sm:px-5 pt-6 pb-4">

        {/* CONTENEDOR SUPERIOR: Ahora todo se alinea hacia arriba (justify-start) */}
        <div className="flex flex-col justify-start w-full gap-4 mb-auto">

          {/* Botón de Modo Claro / Oscuro */}
          <div className="flex justify-end shrink-0">
            <div className="inline-flex items-center gap-1 bg-black/20 border border-white/10 rounded-full p-0.5 backdrop-blur-sm">
              <button
                onClick={() => setTema('claro')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  tema === 'claro' ? 'bg-white text-gray-900' : 'text-white/70 hover:text-white'
                }`}
              >
                <Sun className="w-3 h-3" />
                Claro
              </button>
              <button
                onClick={() => setTema('oscuro')}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  tema === 'oscuro' ? 'bg-white text-gray-900' : 'text-white/70 hover:text-white'
                }`}
              >
                <Moon className="w-3 h-3" />
                Oscuro
              </button>
            </div>
          </div>

          {/* TÍTULOS Y CABECERA */}
          <div className="flex justify-center w-full mt-2">
            <div className="w-fit max-w-xl relative pl-4 mx-auto">
              <div className="absolute left-0 top-1 bottom-1 w-px bg-gradient-to-b from-[#E4C468] via-white/20 to-transparent">
                <div className="absolute -left-[4px] top-0 w-[8px] h-[8px] rounded-full bg-[#E4C468]" />
                <div className="absolute -left-[2.5px] bottom-0 w-[5px] h-[5px] rounded-full bg-white/40" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif text-white leading-tight">
                Cada parcela, con su historia <br />
                <span className="italic text-[#E4C468]">completa.</span>
              </h1>
              <p className="mt-2 text-white/70 text-xs sm:text-sm leading-snug">
                Expediente digital por comunero, historial de parcelas y actos jurídicos en un solo lugar.
              </p>
            </div>
          </div>

          {/* TARJETAS DE ESTADÍSTICAS */}
          <div className="flex flex-wrap justify-center gap-3 w-full mt-2">
            {stats.map(({ icon: Icon, label, value, suffix, trend }) => (
              <div
                key={label}
                className="bg-white/5 backdrop-blur-md border border-white/5 rounded-lg px-2 py-3.5 w-[140px] h-[160px] flex flex-col items-center justify-between text-center hover:bg-white/[0.07] transition-colors"
              >
                <div className="w-6 h-6 rounded-full border border-[#E4C468]/40 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#E4C468]" />
                </div>
                <div className="flex flex-col items-center my-auto gap-0.5">
                  <span className="text-[9px] font-bold text-white/60 tracking-widest uppercase leading-tight">
                    {label}
                  </span>
                  <span className="text-2xl font-serif text-white leading-none font-semibold">
                    {value}
                  </span>
                  <span className="text-[10px] text-white/50 leading-none">{suffix}</span>
                </div>
                <div className="w-full shrink-0 mt-1">
                  <Sparkline data={trend} />
                </div>
              </div>
            ))}
          </div>

          {/* CONTENEDORES DE VISTA PREVIA Y AVISOS */}
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 w-full max-w-4xl mx-auto mt-2">

            {/* Vista previa */}
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
          {/* cierra el grid Vista previa / Avisos */}
        </div>
        {/* cierra el contenedor superior (toggle + título + stats + grid) */}

        {/* --- BARRA INFERIOR DE SESIÓN --- */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 justify-center sm:justify-between text-center sm:text-left shrink-0 w-full max-w-4xl mx-auto mt-6">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#E4C468] shrink-0" />
              <div className="text-left">
                <p className="text-[8px] text-white/50 leading-none">Último acceso</p>
                <p className="text-[10px] text-white font-medium mt-0.5">05 Jul 2026 - 09:34 AM</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-[#E4C468] shrink-0" />
              <div className="text-left">
                <p className="text-[8px] text-white/50 leading-none">Navegador</p>
                <p className="text-[10px] text-white font-medium mt-0.5">Chrome 126.0.0.3</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-5 bg-white/10" />
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#E4C468] shrink-0" />
              <div className="text-left">
                <p className="text-[8px] text-white/50 leading-none">IP</p>
                <p className="text-[10px] text-white font-medium mt-0.5">189.203.45.67</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/20 rounded-full px-3 py-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-medium text-emerald-300">Sistema en línea</span>
          </div>
        </div>

      </div>
    </section>
  );
}
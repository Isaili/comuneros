'use client';

import React, { useState } from 'react';
import { Sun, Moon, Users, Map, FileText, ShieldCheck, Home, BookOpen, BarChart3, RefreshCcw, Settings } from 'lucide-react';
import StatCard from './StatCard';
import PreviewAndAlerts from './PreviewAndAlerts';
import SessionFooter from './SessionFooter';

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

export default function DashboardHero() {
  const [tema, setTema] = useState<'claro' | 'oscuro'>('claro');

  return (
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

        {/* CONTENEDOR SUPERIOR */}
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
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                trend={stat.trend}
              />
            ))}
          </div>

          {/* VISTA PREVIA Y AVISOS */}
          <PreviewAndAlerts sidebarNav={sidebarNav} avisos={avisos} />

        </div>

        {/* BARRA INFERIOR DE SESIÓN */}
        <SessionFooter />

      </div>
    </section>
  );
}
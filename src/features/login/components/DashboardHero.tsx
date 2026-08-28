'use client';

import React, { useEffect, useState } from 'react';
import { Footprints, Users, Map, FileText, ShieldCheck, Home, BookOpen, BarChart3, RefreshCcw, Settings } from 'lucide-react';
import StatCard from './StatCard';
import PreviewAndAlerts from './PreviewAndAlerts';
import SessionFooter from './SessionFooter';
import { comunerosApi } from '../../comuneros/services/comunerosApi';
import { plotsService } from '../../parcelas/services/parcelas.service';

const defaultStats = [
  { icon: Users, label: 'COMUNEROS', value: '0', suffix: 'Registrados', trend: [4, 6, 3, 7, 5, 8, 6] },
  { icon: Map, label: 'PARCELAS ACTIVAS', value: '0', suffix: 'Registradas', trend: [3, 5, 4, 6, 8, 5, 7] },
  { icon: FileText, label: 'LOTES REGISTRADOS', value: '128', suffix: 'Registradas', trend: [5, 3, 6, 4, 7, 6, 8] },
  { icon: ShieldCheck, label: 'MULTAS', value: '96', suffix: 'Emitidas', trend: [2, 4, 3, 6, 5, 7, 6] },
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
    titulo: 'Nuevos certificados ',
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


const footstepPositions = [
  { top: '10%', left: '55%', flip: true, delay: 2.0 },
  { top: '70%', left: '55%', flip: false, delay: 0.0 },
  { top: '40%', left: '75%', flip: true, delay: 1.0 },
];

export default function DashboardHero() {
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    let isMounted = true;

    const cargarEstadisticas = async () => {
      try {
        const [comunerosResponse, parcelasResponse] = await Promise.all([
          comunerosApi.listar(1, 1),
          plotsService.list({ page: 1, limit: 1, active: true }),
        ]);

        if (!isMounted) return;

        setStats([
          {
            icon: Users,
            label: 'COMUNEROS',
            value: String(comunerosResponse.total || 0),
            suffix: 'Registrados',
            trend: [4, 6, 3, 7, 5, 8, 6],
          },
          {
            icon: Map,
            label: 'PARCELAS ACTIVAS',
            value: String(parcelasResponse.data.total || 0),
            suffix: 'Registradas',
            trend: [3, 5, 4, 6, 8, 5, 7],
          },
          { icon: FileText, label: 'LOTES REGISTRADOS', value: '128', suffix: 'Registradas', trend: [5, 3, 6, 4, 7, 6, 8] },
          { icon: ShieldCheck, label: 'MULTAS', value: '96', suffix: 'Emitidas', trend: [2, 4, 3, 6, 5, 7, 6] },
        ]);
      } catch {
        if (isMounted) {
          setStats(defaultStats);
        }
      }
    };

    cargarEstadisticas();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden font-sans flex flex-col justify-between">
      {/* --- FONDO --- */}
     <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage: "url('/mejora.webp')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
/>
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A12]/90 via-[#12201580] to-[#0B140D]/95" />

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 flex-1 flex flex-col justify-between max-w-6xl w-full mx-auto px-4 sm:px-5 pt-6 pb-4">

        {/* CONTENEDOR SUPERIOR */}
        <div className="flex flex-col justify-start w-full gap-4 mb-auto">

          
          <div className="flex justify-end shrink-0">
            <div className="relative w-24 h-9">
              {footstepPositions.map((pos, i) => (
                <Footprints
                  key={i}
                  className="w-3 h-3 text-[#E4C468] absolute animate-footstep"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    transform: pos.flip ? 'translate(-50%, -50%) scaleX(-1)' : 'translate(-50%, -50%)',
                    animationDelay: `${pos.delay}s`,
                  }}
                />
              ))}
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
          <PreviewAndAlerts avisos={avisos} />

        </div>

        {/* BARRA INFERIOR DE SESIÓN */}
        <SessionFooter />

      </div>
    </section>
  );
}
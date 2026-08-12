"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  // Router fallback for test/Storybook
  let router: { back: () => void };
  try {
    router = useRouter();
  } catch (e) {
    router = { back: () => (typeof window !== "undefined" ? window.history.back() : undefined) } as { back: () => void };
  }

  const [copied, setCopied] = useState(false);

  function handleReport() {
    const subject = encodeURIComponent("REPORTE SISTEMA EJIDAL: Recurso no localizado (Error 404)");
    const body = encodeURIComponent(
      `Estimada Mesa Directiva y Soporte Técnico,\n\nSe reporta un problema dentro del Portal Ejidal.\n\n` +
      `📌 Ubicación: ${typeof window !== "undefined" ? window.location.href : "(Desconocida)"}\n` +
      `📅 Fecha/Hora: ${new Date().toLocaleString()}\n` +
      `📝 Descripción del trámite o consulta intentada:\n- `
    );
    window.location.href = `mailto:mesadirectiva@comisariaejidal.gob.mx?subject=${subject}&body=${body}`;
  }

  async function handleCopyLink() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // silent fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <main
      role="main"
      aria-labelledby="notfound-title"
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans relative bg-gradient-to-b from-[#061914] via-[#07271b] to-[#0a2f22]"
    >
      <div className="max-w-6xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-stone-200/5 relative z-10">

        {/* LEFT PANEL: Map rendered as inline SVG */}
        <aside className="lg:w-5/12 bg-[#04221a] text-stone-100 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shrink-0">

          <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
            <button aria-pressed="true" className="bg-[#083329] text-emerald-300 px-3 py-1 rounded-md text-sm border border-emerald-800/40">3D</button>
            <button className="bg-transparent text-emerald-300 px-3 py-1 rounded-md text-sm border border-emerald-800/30">2D</button>
          </div>

          <div className="flex items-center gap-4 pb-4">
            <div className="w-12 h-12 rounded-xl bg-transparent border border-amber-500/50 flex items-center justify-center text-amber-400 font-serif font-black text-xl shadow-inner shrink-0">CE</div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">República Mexicana</p>
              <h2 className="text-lg font-bold text-white tracking-tight">Comisaría Ejidal</h2>
              <p className="text-xs text-emerald-400/80">Sistema de Gestión Agraria</p>
            </div>
          </div>

          <div className="mt-4 mb-4 w-full flex-1 flex items-center justify-center relative">
            <div className="w-full max-w-[420px] h-[480px] relative">

              <svg viewBox="0 0 600 700" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg rounded-lg overflow-hidden">
                <defs>
                  <linearGradient id="gTerrain" x1="0" x2="1">
                    <stop offset="0%" stopColor="#06281c" />
                    <stop offset="50%" stopColor="#0f3a27" />
                    <stop offset="100%" stopColor="#154e36" />
                  </linearGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#02190f" floodOpacity="0.35"/>
                  </filter>
                </defs>

                {/* Stylized silhouette of Chiapas (illustrative) */}
                <path d="M50,600 C80,520 120,480 160,470 C210,460 240,430 290,420 C330,412 360,394 400,370 C440,345 480,320 540,260 C560,240 580,200 560,150 C540,100 500,90 460,80 C420,70 380,74 340,90 C300,106 280,130 250,140 C220,150 180,160 160,140 C140,120 120,90 90,80 C60,70 40,90 30,120 C20,150 10,200 20,260 C30,320 40,380 60,440 C80,500 40,620 50,600 Z"
                  fill="url(#gTerrain)" stroke="#0b3b25" strokeWidth="4" filter="url(#softShadow)" />

                {/* Topographic ridges (simple curves) */}
                <g stroke="#072b1c" strokeWidth="2" opacity="0.7" fill="none">
                  <path d="M80,540 C120,480 160,460 200,450" />
                  <path d="M120,460 C160,420 210,400 260,390" />
                  <path d="M240,360 C290,340 340,320 380,300" />
                  <path d="M340,200 C370,190 410,180 450,170" />
                </g>

                {/* Coastline glow */}
                <path d="M60,440 C80,500 40,620 50,600" fill="none" stroke="#0efc9a" strokeWidth="2" opacity="0.5" />

                {/* Markers for main localities (illustrative coords) */}
                <g fontFamily="Inter, system-ui, sans-serif" fontWeight="700" fill="#e6fff0">
                  <g transform="translate(200,260)">
                    <circle r="10" fill="#ffb84d" stroke="#fff2d9" strokeWidth="2" />
                    <text x="16" y="6" fontSize="13" fill="#f8fff6">Tuxtla Gutiérrez</text>
                  </g>
                  <g transform="translate(320,220)">
                    <circle r="7" fill="#9fe6b6" stroke="#dfffe9" strokeWidth="1.5" />
                    <text x="12" y="5" fontSize="11">San Cristóbal</text>
                  </g>
                  <g transform="translate(420,110)">
                    <circle r="7" fill="#9fe6b6" stroke="#dfffe9" strokeWidth="1.5" />
                    <text x="12" y="5" fontSize="11">Palenque</text>
                  </g>
                  <g transform="translate(480,280)">
                    <circle r="7" fill="#9fe6b6" stroke="#dfffe9" strokeWidth="1.5" />
                    <text x="12" y="5" fontSize="11">Comitán</text>
                  </g>
                  <g transform="translate(140,520)">
                    <circle r="7" fill="#9fe6b6" stroke="#dfffe9" strokeWidth="1.5" />
                    <text x="12" y="5" fontSize="11">Tapachula</text>
                  </g>
                </g>

                {/* Selected parcel glow and X marker */}
                <g>
                  <ellipse cx="205" cy="270" rx="28" ry="12" fill="#ffd67a" opacity="0.12" />
                  <circle cx="200" cy="260" r="5" fill="#ffb84d" />
                  <text x="210" y="260" fontSize="10" fill="#fff8ea" fontWeight="700">Predio no localizado</text>
                </g>

              </svg>

              {/* Zoom controls (visual only) */}
              <div className="absolute left-3 bottom-6 flex flex-col bg-[#05231c]/60 rounded-lg p-2 gap-2 border border-emerald-800/40">
                <button aria-label="zoom in" className="text-white w-8 h-8 flex items-center justify-center rounded-md border border-emerald-700/30">+</button>
                <button aria-label="zoom out" className="text-white w-8 h-8 flex items-center justify-center rounded-md border border-emerald-700/30">-</button>
              </div>

              {/* Legend */}
              <div className="absolute left-3 top-6 bg-[#031811]/60 text-emerald-200 p-3 rounded-md border border-emerald-800/30 text-xs">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Predio localizado</div>
                <div className="flex items-center gap-2 mt-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Predio no localizado</div>
                <div className="flex items-center gap-2 mt-1"><span className="w-2 h-2 rounded-full border border-emerald-400"></span> Zona ejidal</div>
              </div>

            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-emerald-900/40 text-xs text-emerald-400/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border border-amber-500/40 flex items-center justify-center text-[10px] text-amber-400 font-serif">🦅</div>
              <span>Órgano de Representación Ejidal</span>
            </div>
            <span className="font-mono text-amber-500">v2.4</span>
          </div>

        </aside>

        {/* RIGHT PANEL */}
        <section className="lg:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-stone-50 relative">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold mb-6">
              <span className="text-amber-600 font-bold">⚠️</span>
              Aviso de navegación
            </div>

            <h1 className="text-7xl sm:text-8xl font-black text-[#05231c] tracking-tight leading-none mb-3">404</h1>
            <h2 id="notfound-title" className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-3">No encontramos la página solicitada</h2>
            <p className="text-stone-600 text-sm leading-relaxed max-w-xl mb-8">Es posible que el enlace haya expirado, la clave catastral o expediente haya cambiado de formato, o la página haya sido removida del portal oficial.</p>

            <div className="pt-4">
              <div className="relative flex items-center justify-center mb-6">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-stone-50 px-4 text-[11px] font-bold uppercase tracking-widest text-stone-500 whitespace-nowrap">Accesos Rápidos</span>
                <div className="border-t border-stone-200 w-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"> 
                <Link href="/padron" className="p-4 bg-white border border-stone-200/80 rounded-2xl hover:border-emerald-700 hover:shadow-md transition flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-bold text-stone-800 leading-tight">Padrón de Ejidatarios</p></div>
                  <span className="text-emerald-800 font-bold group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <Link href="/parcelas" className="p-4 bg-white border border-stone-200/80 rounded-2xl hover:border-emerald-700 hover:shadow-md transition flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-bold text-stone-800 leading-tight">Parcelas y Lotes</p></div>
                  <span className="text-emerald-800 font-bold group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <Link href="/asambleas" className="p-4 bg-white border border-stone-200/80 rounded-2xl hover:border-emerald-700 hover:shadow-md transition flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-bold text-stone-800 leading-tight">Actas y Convocatorias</p></div>
                  <span className="text-emerald-800 font-bold group-hover:translate-x-1 transition-transform">→</span>
                </Link>

                <Link href="/tramites" className="p-4 bg-white border border-stone-200/80 rounded-2xl hover:border-emerald-700 hover:shadow-md transition flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-bold text-stone-800 leading-tight">Trámites y Servicios</p></div>
                  <span className="text-emerald-800 font-bold group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </div>
            </div>

            <div className="mt-8 pt-6">
              <div className="text-center mb-6 flex items-center justify-center gap-2 text-stone-700 text-xs sm:text-sm font-medium">
                <span className="text-emerald-800 font-bold">📍</span>
                <span>La tierra nos une, la <strong className="font-bold text-stone-900">gestión</strong> nos fortalece.</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => router.back()} className="inline-flex items-center justify-center gap-2 bg-[#05231c] hover:bg-[#083329] text-white font-semibold px-5 py-3 rounded-xl transition text-sm shadow-sm"><span>←</span><span>Volver al portal</span></button>
                <Link href="/" className="inline-flex items-center justify-center gap-2 border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-semibold px-5 py-3 rounded-xl transition text-sm shadow-sm"><span>🏠</span><span>Inicio</span></Link>
                <button onClick={handleReport} className="inline-flex items-center justify-center gap-2 text-stone-600 hover:text-stone-900 font-semibold px-4 py-3 transition text-sm"><span>🚩</span><span>Reportar problema</span></button>
              </div>
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}

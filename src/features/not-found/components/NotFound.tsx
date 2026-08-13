"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type GeoJSONFeatureCollection = {
  type: string;
  features: any[];
};

export default function NotFound() {
  // Router fallback for test/Storybook
  let router: { back: () => void };
  try {
    router = useRouter();
  } catch (e) {
    router = { back: () => (typeof window !== "undefined" ? window.history.back() : undefined) } as { back: () => void };
  }

  // Interactive map state: pan/zoom and tilt (3D-like)
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState(12); // degrees for 3D tilt
  const [isTilted, setIsTilted] = useState(true);

  // GeoJSON dynamic layers (optional)
  const [layers, setLayers] = useState<GeoJSONFeatureCollection[]>([]);

  useEffect(() => {
    // Try to fetch optional GeoJSON layers from public/data
    async function loadLayers() {
      const urls = [
        "/data/parcelas.geojson",
        "/data/municipios.geojson",
        "/data/limites.geojson",
      ];
      const loaded: GeoJSONFeatureCollection[] = [];
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) continue;
          const json = await res.json();
          if (json?.type === "FeatureCollection") loaded.push(json);
        } catch (e) {
          // ignore missing files
        }
      }
      setLayers(loaded);
    }
    loadLayers();
  }, []);

  // Basic bounding box for Chiapas (approximate) to project lat/lon into SVG coords
  // These bounds can be refined later or replaced by GeoJSON extents
  const minLat = 14.9; // south (Tapachula approx)
  const maxLat = 17.6; // north (Palenque approx)
  const minLon = -94.8; // west
  const maxLon = -91.5; // east

  // SVG viewBox used for the map silhouette
  const viewWidth = 600;
  const viewHeight = 700;

  function project([lon, lat]: [number, number]) {
    // simple equirectangular projection mapped into our SVG viewbox area used for the silhouette
    const x = ((lon - minLon) / (maxLon - minLon)) * (viewWidth * 0.85) + viewWidth * 0.07;
    // invert lat because SVG y grows downward
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * (viewHeight * 0.85) + viewHeight * 0.07;
    return [x, y];
  }

  // Markers with real-ish coordinates (approximate lat/lon)
  const markers = [
    { id: 'copainala', name: 'Copainalá', lat: 16.58, lon: -93.06, primary: true }, // approximate
    { id: 'tuxtla', name: 'Tuxtla Gutiérrez', lat: 16.753, lon: -93.116, primary: false },
    { id: 'sancristobal', name: 'San Cristóbal', lat: 16.737, lon: -92.637, primary: false },
    { id: 'palenque', name: 'Palenque', lat: 17.481, lon: -91.974, primary: false },
    { id: 'comitan', name: 'Comitán', lat: 16.254, lon: -92.127, primary: false },
    { id: 'tapachula', name: 'Tapachula', lat: 14.900, lon: -92.258, primary: false },
  ];

  // Pan handlers
  function handlePointerDown(e: React.PointerEvent) {
    setIsPanning(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as Element).setPointerCapture(e.pointerId);
  }
  function handlePointerMove(e: React.PointerEvent) {
    if (!isPanning || !lastPos.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  }
  function handlePointerUp(e: React.PointerEvent) {
    setIsPanning(false);
    lastPos.current = null;
  }

  // Wheel to zoom
  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    const delta = -e.deltaY;
    const zoomFactor = delta > 0 ? 1.08 : 0.92;
    setScale(s => Math.min(3, Math.max(0.6, +(s * zoomFactor).toFixed(3))));
  }

  // Convert GeoJSON coordinates to SVG path (supports Polygon and MultiPolygon)
  function geojsonToPath(feature: any) {
    if (!feature || !feature.geometry) return '';
    const { type, coordinates } = feature.geometry;
    if (type === 'Polygon') {
      return coordinates.map((ring: [number, number][]) => {
        return 'M ' + ring.map((pt: [number, number]) => {
          const [x, y] = project(pt);
          return `${x.toFixed(2)} ${y.toFixed(2)}`;
        }).join(' L ') + ' Z';
      }).join(' ');
    }
    if (type === 'MultiPolygon') {
      return coordinates.map((poly: any) => poly.map((ring: any) => 'M ' + ring.map((pt: [number, number]) => {
        const [x, y] = project(pt);
        return `${x.toFixed(2)} ${y.toFixed(2)}`;
      }).join(' L ') + ' Z').join(' ')).join(' ');
    }
    return '';
  }

  // Tilt transform for 3D-like effect
  const tiltTransform = isTilted ? `rotateX(${tilt}deg)` : 'rotateX(0deg)';

  // Click handler for reporting a problem (used by the Reportar problema button)
  function handleReport(e?: React.MouseEvent<HTMLButtonElement>) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const subject = 'Reporte: página no encontrada (404)';
    const body = `Encontré una página 404 en: ${url}\n\nDescribe el problema aquí:\n`;
    const mailto = `mailto:soporte@comisaria.example?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Prefer Web Share API when available (better UX on mobile), otherwise fallback to mailto
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        (navigator as any).share({ title: subject, text: body, url });
        return;
      } catch (err) {
        // ignore and fallback to mail client
      }
    }

    if (typeof window !== 'undefined') {
      window.location.href = mailto;
    }
  }

  return (
    <main
      role="main"
      aria-labelledby="notfound-title"
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 font-sans relative bg-gradient-to-b from-[#061914] via-[#07271b] to-[#0a2f22]"
    >
      <div className="max-w-6xl w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-stone-200/5 relative z-10 bg-opacity-80">

        {/* LEFT PANEL: Map as inline SVG with interactivity */}
        <aside className="lg:w-5/12 bg-[#04221a] text-stone-100 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden shrink-0">

          <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
            <button
              onClick={() => { setIsTilted(true); setTilt(16); }}
              aria-pressed={isTilted}
              className={`px-3 py-1 rounded-md text-sm border ${isTilted ? 'bg-[#083329] text-emerald-300 border-emerald-800/40' : 'bg-transparent text-emerald-300 border-emerald-800/30'}`}>
              3D
            </button>
            <button
              onClick={() => { setIsTilted(false); setTilt(0); }}
              aria-pressed={!isTilted}
              className={`px-3 py-1 rounded-md text-sm border ${!isTilted ? 'bg-[#083329] text-emerald-300 border-emerald-800/40' : 'bg-transparent text-emerald-300 border-emerald-800/30'}`}>
              2D
            </button>
          </div>

          <div className="flex items-center gap-4 pb-4 z-20">
            <div className="w-12 h-12 rounded-xl bg-transparent border border-amber-500/50 flex items-center justify-center text-amber-400 font-serif font-black text-xl shadow-inner shrink-0">CE</div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">República Mexicana</p>
              <h2 className="text-lg font-bold text-white tracking-tight">Comisaría Ejidal</h2>
              <p className="text-xs text-emerald-400/80">Sistema de Gestión Agraria</p>
            </div>
          </div>

          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onWheel={handleWheel}
            className="mt-4 mb-4 w-full flex-1 flex items-center justify-center relative z-10 touch-none"
          >
            <div className="w-full max-w-[420px] h-[480px] relative" style={{ perspective: 1200 }}>

              <div style={{ transformStyle: 'preserve-3d', transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transition: isPanning ? 'none' : 'transform 220ms ease' }} className="map-viewport origin-center">
                <svg ref={svgRef} viewBox={`0 0 ${viewWidth} ${viewHeight}`} xmlns="http://www.w3.org/2000/svg" className="w-full h-full rounded-lg overflow-hidden" style={{ transform: tiltTransform, transformOrigin: 'center center' }}>
                  <defs>
                    <linearGradient id="gTerrain2" x1="0" x2="1">
                      <stop offset="0%" stopColor="#063023" />
                      <stop offset="50%" stopColor="#0e3f2b" />
                      <stop offset="100%" stopColor="#1a5b3c" />
                    </linearGradient>
                    <filter id="softShadow2" x="-30%" y="-30%" width="160%" height="160%">
                      <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor="#00140b" floodOpacity="0.45" />
                    </filter>
                  </defs>

                  {/* Silhouette */}
                  <path d="M50,600 C80,520 120,480 160,470 C210,460 240,430 290,420 C330,412 360,394 400,370 C440,345 480,320 540,260 C560,240 580,200 560,150 C540,100 500,90 460,80 C420,70 380,74 340,90 C300,106 280,130 250,140 C220,150 180,160 160,140 C140,120 120,90 90,80 C60,70 40,90 30,120 C20,150 10,200 20,260 C30,320 40,380 60,440 C80,500 40,620 50,600 Z"
                    fill="url(#gTerrain2)" stroke="#083b2a" strokeWidth="3" filter={isTilted ? 'url(#softShadow2)' : undefined} />

                  {/* Topo lines */}
                  <g stroke="#07311f" strokeWidth="1.2" opacity="0.7">
                    <path d="M80,540 C120,480 160,460 200,450" />
                    <path d="M120,460 C160,420 210,400 260,390" />
                    <path d="M240,360 C290,340 340,320 380,300" />
                    <path d="M340,200 C370,190 410,180 450,170" />
                  </g>

                  {/* Optional layers from GeoJSON */}
                  {layers.map((col, idx) => (
                    <g key={idx} fill="none" stroke="#2b6a4a" strokeWidth={0.8} opacity={0.7}>
                      {col.features.map((f, i) => (
                        <path key={i} d={geojsonToPath(f)} />
                      ))}
                    </g>
                  ))}

                  {/* Markers rendered from lat/lon */}
                  <g>
                    {markers.map(m => {
                      const [x, y] = project([m.lon, m.lat]);
                      return (
                        <g key={m.id} transform={`translate(${x}, ${y})`} className="cursor-pointer">
                          <circle r={m.primary ? 9 : 6} fill={m.primary ? '#ffd28a' : '#9fe6b6'} stroke="#fff2d9" strokeWidth={m.primary ? 2.5 : 1.2} />
                          <text x={m.primary ? 14 : 12} y={m.primary ? 6 : 5} fontSize={m.primary ? 13 : 11} fill="#f8fff6" fontWeight={700}>{m.name}</text>
                        </g>
                      );
                    })}
                  </g>

                </svg>
              </div>

              {/* Zoom controls visual */}
              <div className="absolute left-3 bottom-6 flex flex-col bg-[#05231c]/60 rounded-lg p-2 gap-2 border border-emerald-800/40">
                <button aria-label="zoom in" onClick={() => setScale(s => Math.min(3, +(s * 1.12).toFixed(3)))} className="text-white w-8 h-8 flex items-center justify-center rounded-md border border-emerald-700/30">+</button>
                <button aria-label="zoom out" onClick={() => setScale(s => Math.max(0.6, +(s / 1.12).toFixed(3)))} className="text-white w-8 h-8 flex items-center justify-center rounded-md border border-emerald-700/30">-</button>
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

        {/* RIGHT PANEL: 404 content */}
        <section className="lg:w-7/12 p-8 sm:p-12 flex flex-col justify-between bg-stone-50 relative">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold mb-6">
              <span className="text-amber-600 font-bold">⚠️</span>
              Aviso de navegación
            </div>

            <h1 className="text-7xl sm:text-8xl font-black text-[#05231c] tracking-tight leading-none mb-3">404</h1>
            <h2 id="notfound-title" className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-3">Predio o página no localizada</h2>
            <p className="text-stone-600 text-sm leading-relaxed max-w-xl mb-6">Es posible que el enlace haya expirado, la clave catastral o expediente haya cambiado de formato, o la página haya sido removida del portal oficial.</p>

            {/* Search box */}
            <div className="flex items-center gap-3 max-w-xl mb-6">
              <input aria-label="buscar" placeholder="Buscar expediente, parcela, reglamento, actas..." className="flex-1 px-4 py-3 rounded-md border border-stone-200" />
              <button className="px-4 py-3 bg-emerald-800 text-white rounded-md">Buscar</button>
            </div>

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

'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Globe, MapPin } from 'lucide-react';

const LAST_ACCESS_KEY = 'comisaria_last_access';

// Detecta navegador y versión a partir del user agent
function detectBrowser(userAgent: string): string {
  const ua = userAgent;

  const patterns: [RegExp, string][] = [
    [/Edg\/([\d.]+)/, 'Edge'],
    [/OPR\/([\d.]+)/, 'Opera'],
    [/Chrome\/([\d.]+)/, 'Chrome'],
    [/Firefox\/([\d.]+)/, 'Firefox'],
    [/Version\/([\d.]+).*Safari/, 'Safari'],
  ];

  for (const [regex, name] of patterns) {
    const match = ua.match(regex);
    if (match) return `${name} ${match[1]}`;
  }

  return 'Navegador desconocido';
}

function formatFecha(date: Date): string {
  const dia = date.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
  const hora = date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
  return `${dia} - ${hora}`;
}

export default function SessionFooter() {
  const [ultimoAcceso, setUltimoAcceso] = useState<string>('—');
  const [navegador, setNavegador] = useState<string>('—');
  const [ip, setIp] = useState<string>('—');

  useEffect(() => {
    setNavegador(detectBrowser(navigator.userAgent));

    const previo = localStorage.getItem(LAST_ACCESS_KEY);
    setUltimoAcceso(previo ? formatFecha(new Date(previo)) : 'Primer acceso');

    const ahora = new Date();
    localStorage.setItem(LAST_ACCESS_KEY, ahora.toISOString());

    fetch('/api/session-info')
      .then((res) => res.json())
      .then((data) => setIp(data.ip ?? 'No disponible'))
      .catch(() => setIp('No disponible'));
  }, []);

  const items = [
    { icon: Calendar, label: 'Último acceso', value: ultimoAcceso },
    { icon: Globe, label: 'Navegador', value: navegador },
    { icon: MapPin, label: 'IP', value: ip },
  ];

  return (
    <div
      className="relative flex flex-col sm:flex-row items-center gap-3 sm:gap-4
                 justify-center sm:justify-between text-center sm:text-left
                 shrink-0 w-full max-w-4xl mx-auto mt-6
                 rounded-xl px-3.5 py-2.5
                 bg-gradient-to-b from-white/[0.08] to-white/[0.02]
                 border border-white/10
                 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {items.map(({ icon: Icon, label, value }, i) => (
          <React.Fragment key={label}>
            {i > 0 && (
              <div className="hidden sm:block w-px h-6 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
            )}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-md shrink-0
                           bg-white/10 border border-white/10
                           shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_2px_4px_rgba(0,0,0,0.35)]"
              >
                <Icon className="w-3 h-3 text-[#E4C468]" />
              </div>
              <div className="text-left">
                <p className="text-[8px] text-white/50 leading-none tracking-wide uppercase">{label}</p>
                <p className="text-[10px] text-white font-medium mt-0.5 tabular-nums">{value}</p>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div
        className="flex items-center gap-1.5 rounded-full px-3 py-1 shrink-0
                   bg-emerald-500/15 border border-emerald-400/25
                   shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_6px_rgba(0,0,0,0.35)]"
      >
        <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />
        </span>
        <span className="text-[10px] font-medium text-emerald-300">Sistema en línea</span>
      </div>
    </div>
  );
}
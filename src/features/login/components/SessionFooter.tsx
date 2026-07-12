'use client';

import React from 'react';
import { Calendar, Globe, MapPin } from 'lucide-react';

export default function SessionFooter() {
  return (
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
  );
}
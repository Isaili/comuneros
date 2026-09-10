"use client";

import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = "Cargando..." }: LoadingOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/20 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-xl ring-1 ring-slate-200/80">
        <Loader2 className="h-5 w-5 animate-spin text-[#006837]" aria-hidden="true" />
        {message}
      </div>
    </div>
  );
}

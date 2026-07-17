import React from "react";
import { Calendar } from "lucide-react";

export default function NextAssembly() {
  return (
    <div className="group bg-white hover:bg-gray-100/70 p-4 rounded-xl border border-gray-100 hover:border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-150 flex flex-col justify-between min-w-0 cursor-pointer">
      
      {/* Encabezado: Ícono y Etiqueta superior */}
      <div className="flex items-center gap-2 mb-2 min-w-0">
        <div className="p-1.5 rounded-full bg-[#E6F2E9] text-[#1F4D3C] shrink-0 transition-transform duration-200">
          <Calendar className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-bold text-gray-400 tracking-wide truncate uppercase">
          Próxima asamblea
        </span>
      </div>

      {/* Contenido Principal y Estatus */}
      <div className="mt-1">
        <h3 className="text-lg font-bold text-gray-800 tracking-tight break-words group-hover:text-gray-900">
          Domingo 30 de agosto
        </h3>
        
        <div className="flex items-center justify-between gap-2 mt-2">
          <p className="text-[10px] font-medium text-gray-400 truncate group-hover:text-gray-500">
            Último domingo · Cada 2 meses
          </p>
          
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#E2F7E9] text-[#166534] border border-emerald-100/50 group-hover:bg-emerald-100/60 transition-colors shrink-0">
            QR Activo
          </span>
        </div>
      </div>

    </div>
  );
}
import React from "react";
import { ArrowRight } from "lucide-react";

interface SessionItem {
  date: string;
  attendanceRate: number;
  attended: number;
  absent: number;
  total: number;
  fine: string;
}

const historyData: SessionItem[] = [
  { date: "Sesión 24 mayo 2026", attendanceRate: 82, attended: 351, absent: 77, total: 428, fine: "1 salario mínimo" },
  { date: "Sesión 22 marzo 2026", attendanceRate: 82, attended: 344, absent: 76, total: 420, fine: "1 salario mínimo" }
];

export default function AssemblyHistory() {
  return (
    <div className="group bg-white border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-150 p-4 rounded-xl flex flex-col justify-between h-full min-w-0 cursor-pointer">
      <div>
        {/* Encabezado Principal */}
        <h3 className="text-[15px] font-bold text-gray-800 tracking-tight">
          Historial de asambleas
        </h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5 mb-3.5">
          Asistencia registrada por sesión
        </p>

        {/* Lista de Sesiones */}
        <div className="space-y-2.5">
          {historyData.map((session, index) => (
              <div
              key={index}
              className="p-3 bg-white hover:bg-gray-100/70 border border-gray-100/70 hover:border-gray-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.01)] transition-colors"
            >
              <div className="flex items-center justify-between text-xs font-bold text-gray-700 mb-1.5 gap-2">
                <span className="truncate">{session.date}</span>
                <span className="text-[#1F4D3C] shrink-0 bg-[#E2F7E9] px-1.5 py-0.5 rounded-lg text-[11px]">
                  {session.attendanceRate}%
                </span>
              </div>
              
              {/* Barra de Progreso más delgada */}
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div style={{ width: `${session.attendanceRate}%` }} className="h-full bg-[#1E4D3A] rounded-full" />
              </div>

              {/* Badges de Asistencia */}
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-semibold text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E4D3A] shrink-0" /> 
                  <span className="text-gray-500">{session.attended}</span> asistieron
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" /> 
                  <span className="text-gray-500">{session.absent}</span> faltas
                </span>
              </div>
              
              {/* Info inferior ultra compacta */}
              <div className="text-[10px] text-gray-400 mt-2 border-t border-gray-100 pt-1.5 flex flex-wrap justify-between gap-1">
                <span>Convocados: <strong className="text-gray-500 font-bold">{session.total}</strong></span>
                <span className="truncate">Multa: <strong className="text-gray-500 font-bold">{session.fine}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de Acción Inferior */}
      <button className="flex items-center justify-center gap-1.5 mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors pt-2 border-t border-gray-100 group-hover:border-gray-200 w-full xs:w-auto self-start">
        <span>Ver historial completo</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
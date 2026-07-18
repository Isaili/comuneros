import React from 'react';
import { CalendarX } from 'lucide-react';
import { HistorialAsistencia } from '../types/types';

interface AsistenciaHistorialProps {
  historial: HistorialAsistencia;
}

export const AsistenciaHistorial: React.FC<AsistenciaHistorialProps> = ({ historial }) => {
  const porcentaje = Math.round(
    ((historial.totalConvocatorias - historial.totalFaltas) / historial.totalConvocatorias) * 100
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wide">Historial de asistencia</h4>
        <span className="text-xs font-extrabold text-gray-500">{porcentaje}%</span>
      </div>

      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div style={{ width: `${porcentaje}%` }} className="h-full bg-[#1E4D3A] rounded-full" />
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-left text-sm border-collapse min-w-[300px]">
          <thead>
            <tr className="text-gray-400 font-semibold border-b border-gray-100">
              <th className="pb-1.5">Asamblea</th>
              <th className="pb-1.5 text-right">Fecha</th>
            </tr>
          </thead>
          <tbody className="font-semibold text-gray-700 divide-y divide-gray-50">
            {historial.asambleasFaltadas.length > 0 ? (
              historial.asambleasFaltadas.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50/40">
                  <td className="py-2 flex items-center gap-1.5">
                    <CalendarX className="w-3 h-3 text-red-400 shrink-0" />
                    {a.nombre}
                  </td>
                  <td className="py-2 text-gray-500 font-normal text-right whitespace-nowrap">
                    {new Date(a.fecha).toLocaleDateString('es-MX')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-3 text-center text-gray-400 font-normal">
                  Sin inasistencias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
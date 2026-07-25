"use client";

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Ingreso } from '../types/types';

interface IngresosDiariosChartProps {
  ingresos: Ingreso[];
  dias?: number;
}

export const IngresosDiariosChart: React.FC<IngresosDiariosChartProps> = ({ ingresos, dias = 8 }) => {
  const data = useMemo(() => {
    const hoy = new Date();
    const buckets: { key: string; label: string; predial: number; multa: number }[] = [];

    for (let i = dias - 1; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      buckets.push({
        key: fecha.toISOString().slice(0, 10),
        label: fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
        predial: 0,
        multa: 0,
      });
    }

    ingresos.forEach((ing) => {
      const key = ing.fecha.slice(0, 10);
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket[ing.tipo] += ing.monto;
    });

    return buckets;
  }, [ingresos, dias]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm">Ingresos diarios</h3>
        <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#1E4D3A]" /> Predial
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Multas
          </span>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(value) => Number(value).toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 })}
              contentStyle={{ borderRadius: 12, borderColor: '#E5E7EB', fontSize: 12 }}
            />
            <Legend wrapperStyle={{ display: 'none' }} />
            <Bar dataKey="predial" stackId="ingresos" fill="#1E4D3A" radius={[0, 0, 0, 0]} name="Predial" />
            <Bar dataKey="multa" stackId="ingresos" fill="#FBBF24" radius={[4, 4, 0, 0]} name="Multas" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
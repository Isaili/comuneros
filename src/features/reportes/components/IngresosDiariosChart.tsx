"use client";

import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Calendar, ChevronDown, Wallet } from 'lucide-react';
import { Ingreso, TipoIngreso } from '../types/types';

interface IngresosDiariosChartProps {
  ingresos: Ingreso[];
}

type FiltroTipo = TipoIngreso | 'todos';
type RangoFecha = 'semana' | 'quincena' | 'mes';

const RANGOS: Record<RangoFecha, number> = {
  semana: 7,
  quincena: 15,
  mes: 30,
};

const TITULOS: Record<FiltroTipo, string> = {
  todos: 'Ingresos diarios (unificados)',
  predial: 'Ingresos diarios por predial',
  multa: 'Ingresos diarios por multas',
};

const formatoMoneda = (valor: number) => {
  if (valor >= 1_000_000) return `$${(valor / 1_000_000).toFixed(1)}M`;
  if (valor >= 1_000) return `$${Math.round(valor / 1_000)}k`;
  return `$${valor}`;
};

const formatoMonedaLabel = (valor: unknown) => formatoMoneda(Number(valor ?? 0));

function TooltipPersonalizado({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[#153629] text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg">
      <p className="text-white/60 text-[10px] uppercase tracking-wide mb-0.5">{label}</p>
      <p className="flex items-center gap-1.5">
        <Wallet className="w-3 h-3 text-amber-400" />
        {formatoMoneda(payload[0].value)}
      </p>
    </div>
  );
}

export const IngresosDiariosChart: React.FC<IngresosDiariosChartProps> = ({ ingresos }) => {
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todos');
  const [filtroRango, setFiltroRango] = useState<RangoFecha>('semana');

  const data = useMemo(() => {
    const dias = RANGOS[filtroRango];
    const hoy = new Date();
    const buckets: { key: string; label: string; value: number }[] = [];

    for (let i = dias - 1; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      buckets.push({
        key: fecha.toISOString().slice(0, 10),
        label: fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
        value: 0,
      });
    }

    ingresos.forEach((ing) => {
      if (filtroTipo !== 'todos' && ing.tipo !== filtroTipo) return;
      const key = ing.fecha.slice(0, 10);
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket.value += ing.monto;
    });

    return buckets;
  }, [ingresos, filtroTipo, filtroRango]);

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex-1 min-w-0">

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E4D3A]" />
            {TITULOS[filtroTipo]}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Filtrado por tiempo y tipo de ingreso</p>
        </div>


        <div className="flex flex-col xs:flex-row items-center gap-2 w-full lg:w-auto">
          <div className="relative w-full xs:w-auto flex-1 xs:flex-initial">
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value as FiltroTipo)}
              className="w-full appearance-none bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-gray-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1E4D3A]/5 focus:border-[#1E4D3A] cursor-pointer"
            >
              <option value="todos">Todos los ingresos</option>
              <option value="predial">Por predial</option>
              <option value="multa">Por multas</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative w-full xs:w-auto flex-1 xs:flex-initial">
            <select
              value={filtroRango}
              onChange={(e) => setFiltroRango(e.target.value as RangoFecha)}
              className="w-full appearance-none bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-xl px-3 py-1.5 pl-8 pr-8 text-xs font-medium text-gray-600 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1E4D3A]/5 focus:border-[#1E4D3A] cursor-pointer"
            >
              <option value="semana">Últimos 7 días</option>
              <option value="quincena">Últimos 15 días</option>
              <option value="mes">Últimos 30 días</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>


      <div className="w-full h-72 [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-wrapper_*]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 24, right: 8, left: 0, bottom: 0 }} barCategoryGap="32%">
            <CartesianGrid vertical={false} stroke="#EDEDED" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: '#D1D5DB' }}
              tick={{ fontSize: 11, fontWeight: 500, fill: '#6B7280' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatoMoneda}
              tick={{ fontSize: 10, fontWeight: 500, fill: '#9CA3AF' }}
              width={48}
            />
            <Tooltip cursor={{ fill: 'rgba(30,77,58,0.04)' }} content={<TooltipPersonalizado />} />
            <Bar dataKey="value" fill="#1E4D3A" radius={[3, 3, 0, 0]} maxBarSize={40} stroke="#153629" strokeWidth={1}>
              <LabelList dataKey="value" position="top" formatter={formatoMonedaLabel} style={{ fontSize: 10, fontWeight: 600, fill: '#374151' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
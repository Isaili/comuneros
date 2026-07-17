"use client";

import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import {
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Wallet,
  BarChart3,
} from "lucide-react";

// Estructura de datos expandida para soportar filtros por tipo de ingreso y rango de fechas
const matrizDatos = {
  bimestres: {
    todos: [
      { label: "Ene-Feb", value: 300000 },
      { label: "Mar-Abr", value: 460000 },
      { label: "May-Jun", value: 720000 },
      { label: "Jul-Ago", value: 540000 },
      { label: "Sep-Oct", value: 380000 },
      { label: "Nov-Dic", value: 640500 },
    ],
    predial: [
      { label: "Ene-Feb", value: 200000 },
      { label: "Mar-Abr", value: 160000 },
      { label: "May-Jun", value: 120000 },
      { label: "Jul-Ago", value: 80000 },
      { label: "Sep-Oct", value: 100000 },
      { label: "Nov-Dic", value: 240000 },
    ],
    multas: [
      { label: "Ene-Feb", value: 180000 },
      { label: "Mar-Abr", value: 260000 },
      { label: "May-Jun", value: 340000 },
      { label: "Jul-Ago", value: 300000 },
      { label: "Sep-Oct", value: 220000 },
      { label: "Nov-Dic", value: 360000 },
    ],
    otros: [
      { label: "Ene-Feb", value: 120000 },
      { label: "Mar-Abr", value: 200000 },
      { label: "May-Jun", value: 380000 },
      { label: "Jul-Ago", value: 240000 },
      { label: "Sep-Oct", value: 160000 },
      { label: "Nov-Dic", value: 280000 },
    ],
  },
  anioActual: {
    todos: [
      { label: "Trim 1", value: 520000 },
      { label: "Trim 2", value: 890000 },
      { label: "Trim 3", value: 610000 },
      { label: "Trim 4", value: 780000 },
    ],
    predial: [
      { label: "Trim 1", value: 350000 },
      { label: "Trim 2", value: 180000 },
      { label: "Trim 3", value: 120000 },
      { label: "Trim 4", value: 210000 },
    ],
    multas: [
      { label: "Trim 1", value: 110000 },
      { label: "Trim 2", value: 310000 },
      { label: "Trim 3", value: 260000 },
      { label: "Trim 4", value: 340000 },
    ],
    otros: [
      { label: "Trim 1", value: 60000 },
      { label: "Trim 2", value: 400000 },
      { label: "Trim 3", value: 230000 },
      { label: "Trim 4", value: 230000 },
    ],
  },
  historico: {
    todos: [
      { label: "2023", value: 2100000 },
      { label: "2024", value: 2900000 },
      { label: "2025", value: 3400000 },
      { label: "2026", value: 4100000 },
    ],
    predial: [
      { label: "2023", value: 900000 },
      { label: "2024", value: 1100000 },
      { label: "2025", value: 1300000 },
      { label: "2026", value: 1500000 },
    ],
    multas: [
      { label: "2023", value: 500000 },
      { label: "2024", value: 800000 },
      { label: "2025", value: 1200000 },
      { label: "2026", value: 1600000 },
    ],
    otros: [
      { label: "2023", value: 700000 },
      { label: "2024", value: 1000000 },
      { label: "2025", value: 900000 },
      { label: "2026", value: 1000000 },
    ],
  },
};

type TipoIngreso = "todos" | "predial" | "multas" | "otros";
type RangoFecha = "bimestres" | "anioActual" | "historico";

const formatoMoneda = (valor: number) => {
  if (valor >= 1000000) return `$${(valor / 1000000).toFixed(1)}M`;
  if (valor >= 1000) return `$${Math.round(valor / 1000)}k`;
  return `$${valor}`;
};

const formatoMonedaLabel = (valor: unknown) => formatoMoneda(Number(valor ?? 0));


function TooltipPersonalizado({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-[#153629] text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg">
      <p className="text-white/60 text-[10px] uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="flex items-center gap-1.5">
        <Wallet className="w-3 h-3 text-amber-400" />
        {formatoMoneda(payload[0].value)}
      </p>
    </div>
  );
}

export default function IncomeChart() {
  const [filtroIngreso, setFiltroIngreso] = useState<TipoIngreso>("todos");
  const [filtroFecha, setFiltroFecha] = useState<RangoFecha>("bimestres");

  const titulos = {
    todos: "Ingresos del periodo (unificados)",
    predial: "Ingresos por predial",
    multas: "Ingresos por multas",
    otros: "Otros tipos de ingresos",
  };

  const dataActual = matrizDatos[filtroFecha][filtroIngreso];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex-1 min-w-0">
      {/* Encabezado y Controles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E4D3A]" />
            {titulos[filtroIngreso]}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Filtrado por tiempo y conceptos de caja
          </p>
        </div>


        {/* Panel de Filtros */}
        <div className="flex flex-col xs:flex-row items-center gap-2 w-full lg:w-auto">
          <div className="relative w-full xs:w-auto flex-1 xs:flex-initial">
            <select
              value={filtroIngreso}
              onChange={(e) => setFiltroIngreso(e.target.value as TipoIngreso)}
              className="w-full appearance-none bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-gray-700 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1E4D3A]/5 focus:border-[#1E4D3A] cursor-pointer"
            >
              <option value="todos">Todos los ingresos</option>
              <option value="predial">Por predial</option>
              <option value="multas">Por multas</option>
              <option value="otros">Otros ingresos</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative w-full xs:w-auto flex-1 xs:flex-initial">
            <select
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value as RangoFecha)}
              className="w-full appearance-none bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-xl px-3 py-1.5 pl-8 pr-8 text-xs font-medium text-gray-600 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1E4D3A]/5 focus:border-[#1E4D3A] cursor-pointer"
            >
              <option value="bimestres">Últimos 6 bimestres</option>
              <option value="anioActual">Año actual (2026)</option>
              <option value="historico">Histórico anual</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>


      {/* Gráfica con Recharts */}
      <div className="w-full h-72 [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-wrapper_*]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dataActual} margin={{ top: 24, right: 8, left: 0, bottom: 0 }} barCategoryGap="32%">
            <CartesianGrid vertical={false} stroke="#EDEDED" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={{ stroke: "#D1D5DB" }}
              tick={{ fontSize: 11, fontWeight: 500, fill: "#6B7280" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatoMoneda}
              tick={{ fontSize: 10, fontWeight: 500, fill: "#9CA3AF" }}
              width={48}
            />
            <Tooltip cursor={{ fill: "rgba(30,77,58,0.04)" }} content={<TooltipPersonalizado />} />
            <Bar
              dataKey="value"
              fill="#1E4D3A"
              radius={[3, 3, 0, 0]}
              maxBarSize={40}
              stroke="#153629"
              strokeWidth={1}
            >
              <LabelList
                dataKey="value"
                position="top"
                formatter={formatoMonedaLabel}
                style={{ fontSize: 10, fontWeight: 600, fill: "#374151" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
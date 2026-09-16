"use client";

import React, { useMemo, useState } from "react";
import {
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Calendar } from "lucide-react";


const matrizDatos = {
  bimestres: {
    todos: [
      { label: "Q1", cobrado: 3200, meta: 1800, acumulado: 5800 },
      { label: "Q2", cobrado: 2600, meta: 5600, acumulado: 8200 },
      { label: "Q3", cobrado: 3200, meta: 5200, acumulado: 9900 },
      { label: "Q4", cobrado: 8400, meta: 3800, acumulado: 12200 },
    ],
    predial: [
      { label: "Q1", valor: 3200 },
      { label: "Q2", valor: 2600 },
      { label: "Q3", valor: 3200 },
      { label: "Q4", valor: 8400 },
    ],
    multas: [
      { label: "Q1", valor: 1800 },
      { label: "Q2", valor: 5600 },
      { label: "Q3", valor: 5200 },
      { label: "Q4", valor: 3800 },
    ],
    otros: [
      { label: "Q1", valor: 1200 },
      { label: "Q2", valor: 2400 },
      { label: "Q3", valor: 3100 },
      { label: "Q4", valor: 4500 },
    ],
  },
  anioActual: {
    todos: [
      { label: "Ene-Feb", cobrado: 3000, meta: 2100, acumulado: 5100 },
      { label: "Mar-Abr", cobrado: 4600, meta: 3400, acumulado: 7500 },
      { label: "May-Jun", cobrado: 7200, meta: 4800, acumulado: 10200 },
      { label: "Jul-Ago", cobrado: 5400, meta: 3900, acumulado: 11500 },
      { label: "Sep-Oct", cobrado: 3800, meta: 3100, acumulado: 12100 },
      { label: "Nov-Dic", cobrado: 6400, meta: 4200, acumulado: 13000 },
    ],
    predial: [
      { label: "Ene-Feb", valor: 3000 },
      { label: "Mar-Abr", valor: 4600 },
      { label: "May-Jun", valor: 7200 },
      { label: "Jul-Ago", valor: 5400 },
      { label: "Sep-Oct", valor: 3800 },
      { label: "Nov-Dic", valor: 6400 },
    ],
    multas: [
      { label: "Ene-Feb", valor: 2100 },
      { label: "Mar-Abr", valor: 3400 },
      { label: "May-Jun", valor: 4800 },
      { label: "Jul-Ago", valor: 3900 },
      { label: "Sep-Oct", valor: 3100 },
      { label: "Nov-Dic", valor: 4200 },
    ],
    otros: [
      { label: "Ene-Feb", valor: 1500 },
      { label: "Mar-Abr", valor: 2000 },
      { label: "May-Jun", valor: 3100 },
      { label: "Jul-Ago", valor: 2800 },
      { label: "Sep-Oct", valor: 1900 },
      { label: "Nov-Dic", valor: 3500 },
    ],
  },
  historico: {
    todos: [
      { label: "2023", cobrado: 2100, meta: 1800, acumulado: 6500 },
      { label: "2024", cobrado: 2900, meta: 2400, acumulado: 8800 },
      { label: "2025", cobrado: 3400, meta: 3100, acumulado: 10500 },
      { label: "2026", cobrado: 4100, meta: 3600, acumulado: 12800 },
    ],
    predial: [
      { label: "2023", valor: 2100 },
      { label: "2024", valor: 2900 },
      { label: "2025", valor: 3400 },
      { label: "2026", valor: 4100 },
    ],
    multas: [
      { label: "2023", valor: 1800 },
      { label: "2024", valor: 2400 },
      { label: "2025", valor: 3100 },
      { label: "2026", valor: 3600 },
    ],
    otros: [
      { label: "2023", valor: 1100 },
      { label: "2024", valor: 1500 },
      { label: "2025", valor: 2200 },
      { label: "2026", valor: 2800 },
    ],
  },
};

type TipoIngreso = "todos" | "predial" | "multas" | "otros";
type RangoFecha = "bimestres" | "anioActual" | "historico";

type FilaTodos = { label: string; cobrado: number; meta: number; acumulado: number };
type FilaIndividual = { label: string; valor: number };


const PALETA = {
  verdeOscuro: "#1E4D3A",
  verdeMedio: "#2F6B52",
  celeste: "#2563A6", // Predial
  oro: "#059669", // Multas / Meta
  lineaAcumulado: "#0F766E", // Acumulado / Ingresos
  grid: "#EEF1EE",
  textoPrimario: "#111827",
  textoSecundario: "#6B7280",
};

const coloresIndividuales: Record<Exclude<TipoIngreso, "todos">, string> = {
  predial: PALETA.celeste,
  multas: PALETA.oro,
  otros: PALETA.verdeMedio,
};

const formatoMoneda = (valor: number) =>
  `$${valor.toLocaleString("es-MX")}`;

const formatoEjeCompacto = (valor: number) => {
  if (Math.abs(valor) >= 1000) return `$${(valor / 1000).toFixed(valor % 1000 === 0 ? 0 : 1)}k`;
  return `$${valor}`;
};


function TooltipPersonalizado({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;

  const filas = [
    payload[0] && {
      color: payload[0].color || payload[0].fill,
      nombre:
        payload[0].dataKey === "cobrado"
          ? "Predial"
          : payload[0].dataKey === "valor"
          ? "Total"
          : payload[0].name,
      valor: payload[0].value,
    },
    payload[1] && {
      color: PALETA.oro,
      nombre: "Multas",
      valor: payload[1].value,
    },
    payload[2] && {
      color: PALETA.lineaAcumulado,
      nombre: "Acumulado",
      valor: payload[2].value,
      destacado: true,
    },
  ].filter(Boolean) as { color: string; nombre: string; valor: number; destacado?: boolean }[];

  return (
    <div className="min-w-[168px] rounded-xl border border-white/10 bg-[#132A20] px-3.5 py-3 shadow-xl shadow-black/20">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-white/50">
        {label}
      </p>
      <div className="space-y-1.5">
        {filas.map((fila, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-4 text-xs ${
              fila.destacado ? "border-t border-white/10 pt-1.5 mt-0.5" : ""
            }`}
          >
            <span className="flex items-center gap-1.5 text-white/70">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: fila.color }}
              />
              {fila.nombre}
            </span>
            <span className="font-semibold tabular-nums text-white">
              {formatoMoneda(fila.valor)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


function SegmentedControl<T extends string>({
  opciones,
  valor,
  onChange,
}: {
  opciones: { value: T; label: string }[];
  valor: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5">
      {opciones.map((op) => {
        const activo = op.value === valor;
        return (
          <button
            key={op.value}
            type="button"
            onClick={() => onChange(op.value)}
            className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D3A]/40 ${
              activo
                ? "bg-white text-[#1E4D3A] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {op.label}
          </button>
        );
      })}
    </div>
  );
}


export default function IncomeChart() {
  const [filtroIngreso, setFiltroIngreso] = useState<TipoIngreso>("todos");
  const [filtroFecha, setFiltroFecha] = useState<RangoFecha>("bimestres");

  const titulos: Record<TipoIngreso, string> = {
    todos: "Ingresos del periodo",
    predial: "Ingresos por predial",
    multas: "Ingresos por multas",
    otros: "Otros ingresos",
  };

  const dataActual = matrizDatos[filtroFecha][filtroIngreso] as
    | FilaTodos[]
    | FilaIndividual[];

  // Vistas ya tipadas para cada rama del render (evita pasar la unión a recharts)
  const dataTodos = dataActual as FilaTodos[];
  const dataIndividual = dataActual as FilaIndividual[];

  // KPI: total del periodo y variación contra el punto anterior
  const kpi = useMemo(() => {
    const key = filtroIngreso === "todos" ? "cobrado" : "valor";
    const valores = (dataActual as Record<string, number | string>[]).map(
      (d) => d[key] as number
    );
    const total = valores.reduce((a, b) => a + b, 0);
    const ultimo = valores[valores.length - 1] ?? 0;
    const previo = valores[valores.length - 2] ?? ultimo;
    const variacion = previo === 0 ? 0 : ((ultimo - previo) / previo) * 100;
    return { total, variacion };
  }, [dataActual, filtroIngreso]);

  const rangoLabel: Record<RangoFecha, string> = {
    bimestres: "Últimos 6 bimestres",
    anioActual: "Año actual · 2026",
    historico: "Histórico anual",
  };

  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-gray-100 bg-white p-5 font-sans shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.03)] sm:p-6">
      {/* Encabezado */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: PALETA.verdeOscuro }}
            />
            <h3 className="text-sm font-bold text-gray-900 sm:text-base">
              {titulos[filtroIngreso]}
            </h3>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            {rangoLabel[filtroFecha]}
          </p>
        </div>

        {/* KPI resumen */}
        <div className="flex items-center gap-4 rounded-xl bg-gray-50/70 px-4 py-2.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Total del periodo
            </p>
            <p className="text-lg font-bold tabular-nums text-gray-900">
              {formatoMoneda(kpi.total)}
            </p>
          </div>
          <div
            className={`flex items-center gap-0.5 rounded-md px-1.5 py-1 text-xs font-semibold ${
              kpi.variacion >= 0
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {kpi.variacion >= 0 ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {Math.abs(kpi.variacion).toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <SegmentedControl
          valor={filtroIngreso}
          onChange={setFiltroIngreso}
          opciones={[
            { value: "todos", label: "Todos" },
            { value: "predial", label: "Predial" },
            { value: "multas", label: "Multas" },
            { value: "otros", label: "Otros" },
          ]}
        />
        <span className="h-4 w-px bg-gray-200" />
        <SegmentedControl
          valor={filtroFecha}
          onChange={setFiltroFecha}
          opciones={[
            { value: "bimestres", label: "Bimestres" },
            { value: "anioActual", label: "2026" },
            { value: "historico", label: "Histórico" },
          ]}
        />
      </div>

      {/* Gráfica */}
      <div className="h-72 w-full [&_.recharts-surface]:outline-none [&_.recharts-wrapper]:outline-none sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {filtroIngreso === "todos" ? (
            <ComposedChart
              data={dataTodos}
              margin={{ top: 8, right: 12, left: 4, bottom: 4 }}
              barGap={4}
            >
              <defs>
                <linearGradient id="fillAcumulado" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PALETA.lineaAcumulado} stopOpacity={0.16} />
                  <stop offset="100%" stopColor={PALETA.lineaAcumulado} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke={PALETA.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
                tick={{ fill: PALETA.textoSecundario, fontSize: 12, fontWeight: 600 }}
                dy={8}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatoEjeCompacto}
                tick={{ fill: PALETA.textoSecundario, fontSize: 11 }}
                width={48}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[5000, 13000]}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatoEjeCompacto}
                tick={{ fill: PALETA.textoSecundario, fontSize: 11 }}
                width={48}
              />
              <Tooltip cursor={{ fill: "rgba(30,77,58,0.04)" }} content={<TooltipPersonalizado />} />

              <Bar
                yAxisId="left"
                dataKey="cobrado"
                name="Predial"
                fill={PALETA.celeste}
                barSize={22}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="meta"
                name="Multas"
                fill={PALETA.oro}
                barSize={22}
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="acumulado"
                name="Acumulado"
                stroke={PALETA.lineaAcumulado}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: PALETA.lineaAcumulado, stroke: "#fff", strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : (
            <BarChart data={dataIndividual} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
              <CartesianGrid vertical={false} stroke={PALETA.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "#E5E7EB" }}
                tick={{ fill: PALETA.textoSecundario, fontSize: 12, fontWeight: 600 }}
                dy={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatoEjeCompacto}
                tick={{ fill: PALETA.textoSecundario, fontSize: 11 }}
                width={48}
              />
              <Tooltip cursor={{ fill: "rgba(30,77,58,0.04)" }} content={<TooltipPersonalizado />} />
              <Bar
                dataKey="valor"
                name={titulos[filtroIngreso]}
                fill={coloresIndividuales[filtroIngreso]}
                barSize={36}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Leyenda fija (solo vista "todos") */}
      {filtroIngreso === "todos" && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-3">
          {[
            { color: PALETA.celeste, label: "Predial" },
            { color: PALETA.oro, label: "Multas" },
            { color: PALETA.lineaAcumulado, label: "Acumulado", linea: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-500">
              {item.linea ? (
                <span className="h-0.5 w-3.5 rounded-full" style={{ backgroundColor: item.color }} />
              ) : (
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              )}
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
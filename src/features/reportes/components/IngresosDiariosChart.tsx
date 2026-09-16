"use client";

import React, { useMemo, useState } from 'react';
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
  LabelList,
} from 'recharts';
import { ArrowDownRight, ArrowUpRight, Calendar } from 'lucide-react';
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
  todos: 'Ingresos diarios',
  predial: 'Ingresos diarios por predial',
  multa: 'Ingresos diarios por multas',
};

const RANGO_LABEL: Record<RangoFecha, string> = {
  semana: 'Últimos 7 días',
  quincena: 'Últimos 15 días',
  mes: 'Últimos 30 días',
};

// Misma paleta institucional que IncomeChart — así ambas gráficas combinan
const PALETA = {
  verdeOscuro: '#1E4D3A',
  celeste: '#2563A6', // Predial
  multa: '#059669', // Multas
  lineaAcumulado: '#f6a477', // Acumulado
  grid: '#EEF1EE',
  textoSecundario: '#6B7280',
};

const COLOR_INDIVIDUAL: Record<Exclude<FiltroTipo, 'todos'>, string> = {
  predial: PALETA.celeste,
  multa: PALETA.multa,
};

type Bucket = { key: string; label: string; predial: number; multa: number; acumulado: number };

const formatoMoneda = (valor: number) => {
  if (valor >= 1_000_000) return `$${(valor / 1_000_000).toFixed(1)}M`;
  if (valor >= 1_000) return `$${Math.round(valor / 1_000)}k`;
  return `$${valor}`;
};

const formatoMonedaCompleta = (valor: number) => `$${valor.toLocaleString('es-MX')}`;
const formatoMonedaLabel = (valor: unknown) => formatoMoneda(Number(valor ?? 0));

function TooltipPersonalizado({ active, payload, label, filtroTipo }: any) {
  if (!active || !payload || !payload.length) return null;

  if (filtroTipo !== 'todos') {
    return (
      <div className="min-w-[140px] rounded-xl border border-white/10 bg-[#132A20] px-3.5 py-3 shadow-xl shadow-black/20">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
          {label}
        </p>
        <div className="flex items-center justify-between gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-white/70">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: payload[0].fill || payload[0].color }}
            />
            Ingreso
          </span>
          <span className="font-semibold tabular-nums text-white">
            {formatoMonedaCompleta(payload[0].value)}
          </span>
        </div>
      </div>
    );
  }

  const filas = [
    { color: PALETA.celeste, nombre: 'Predial', valor: payload.find((p: any) => p.dataKey === 'predial')?.value ?? 0 },
    { color: PALETA.multa, nombre: 'Multas', valor: payload.find((p: any) => p.dataKey === 'multa')?.value ?? 0 },
    {
      color: PALETA.lineaAcumulado,
      nombre: 'Acumulado',
      valor: payload.find((p: any) => p.dataKey === 'acumulado')?.value ?? 0,
      destacado: true,
    },
  ];

  return (
    <div className="min-w-[168px] rounded-xl border border-white/10 bg-[#132A20] px-3.5 py-3 shadow-xl shadow-black/20">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-white/50">{label}</p>
      <div className="space-y-1.5">
        {filas.map((fila, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-4 text-xs ${
              fila.destacado ? 'mt-0.5 border-t border-white/10 pt-1.5' : ''
            }`}
          >
            <span className="flex items-center gap-1.5 text-white/70">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: fila.color }} />
              {fila.nombre}
            </span>
            <span className="font-semibold tabular-nums text-white">{formatoMonedaCompleta(fila.valor)}</span>
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
              activo ? 'bg-white text-[#1E4D3A] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {op.label}
          </button>
        );
      })}
    </div>
  );
}

export const IngresosDiariosChart: React.FC<IngresosDiariosChartProps> = ({ ingresos }) => {
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('todos');
  const [filtroRango, setFiltroRango] = useState<RangoFecha>('semana');

  // Buckets con predial/multa separados y el acumulado corrido (suma de ambos)
  const data = useMemo<Bucket[]>(() => {
    const dias = RANGOS[filtroRango];
    const hoy = new Date();
    const buckets: Bucket[] = [];

    for (let i = dias - 1; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() - i);
      buckets.push({
        key: fecha.toISOString().slice(0, 10),
        label: fecha.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
        predial: 0,
        multa: 0,
        acumulado: 0,
      });
    }

    ingresos.forEach((ing) => {
      const key = ing.fecha.slice(0, 10);
      const bucket = buckets.find((b) => b.key === key);
      if (!bucket) return;
      if (ing.tipo === 'predial') bucket.predial += ing.monto;
      if (ing.tipo === 'multa') bucket.multa += ing.monto;
    });

    let corrido = 0;
    buckets.forEach((b) => {
      corrido += b.predial + b.multa;
      b.acumulado = corrido;
    });

    return buckets;
  }, [ingresos, filtroRango]);

  // Vista individual: un solo valor por día para el tipo elegido
  const dataIndividual = useMemo(
    () => data.map((b) => ({ label: b.label, value: filtroTipo === 'predial' ? b.predial : filtroTipo === 'multa' ? b.multa : 0 })),
    [data, filtroTipo]
  );

  // KPI: total del rango y variación del último día vs. el anterior
  const kpi = useMemo(() => {
    const valores =
      filtroTipo === 'todos'
        ? data.map((d) => d.predial + d.multa)
        : dataIndividual.map((d) => d.value);
    const total = valores.reduce((a, b) => a + b, 0);
    const ultimo = valores[valores.length - 1] ?? 0;
    const previo = valores[valores.length - 2] ?? ultimo;
    const variacion = previo === 0 ? 0 : ((ultimo - previo) / previo) * 100;
    return { total, variacion };
  }, [data, dataIndividual, filtroTipo]);

  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.03)] sm:p-6">
      {/* Encabezado */}
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PALETA.verdeOscuro }} />
            <h3 className="text-sm font-bold text-gray-900 sm:text-base">{TITULOS[filtroTipo]}</h3>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400">
            <Calendar className="h-3 w-3" />
            {RANGO_LABEL[filtroRango]}
          </p>
        </div>

        {/* KPI resumen */}
        <div className="flex items-center gap-4 rounded-xl bg-gray-50/70 px-4 py-2.5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
              Total del rango
            </p>
            <p className="text-lg font-bold tabular-nums text-gray-900">
              {formatoMonedaCompleta(kpi.total)}
            </p>
          </div>
          <div
            className={`flex items-center gap-0.5 rounded-md px-1.5 py-1 text-xs font-semibold ${
              kpi.variacion >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'
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
          valor={filtroTipo}
          onChange={setFiltroTipo}
          opciones={[
            { value: 'todos', label: 'Todos' },
            { value: 'predial', label: 'Predial' },
            { value: 'multa', label: 'Multas' },
          ]}
        />
        <span className="h-4 w-px bg-gray-200" />
        <SegmentedControl
          valor={filtroRango}
          onChange={setFiltroRango}
          opciones={[
            { value: 'semana', label: '7 días' },
            { value: 'quincena', label: '15 días' },
            { value: 'mes', label: '30 días' },
          ]}
        />
      </div>

      {/* Gráfica */}
      <div className="h-72 w-full [&_.recharts-wrapper]:outline-none [&_.recharts-surface]:outline-none [&_.recharts-wrapper_*]:outline-none">
        <ResponsiveContainer width="100%" height="100%">
          {filtroTipo === 'todos' ? (
            <ComposedChart data={data} margin={{ top: 24, right: 8, left: 0, bottom: 0 }} barGap={4} barCategoryGap="28%">
              <CartesianGrid vertical={false} stroke={PALETA.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tick={{ fontSize: 11, fontWeight: 600, fill: PALETA.textoSecundario }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatoMoneda}
                tick={{ fontSize: 11, fill: PALETA.textoSecundario }}
                width={48}
              />
              <Tooltip
                cursor={{ fill: 'rgba(30,77,58,0.04)' }}
                content={<TooltipPersonalizado filtroTipo={filtroTipo} />}
              />
              <Bar dataKey="predial" name="Predial" fill={PALETA.celeste} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="multa" name="Multas" fill={PALETA.multa} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Line
                type="monotone"
                dataKey="acumulado"
                name="Acumulado"
                stroke={PALETA.lineaAcumulado}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: PALETA.lineaAcumulado, stroke: '#fff', strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : (
            <BarChart data={dataIndividual} margin={{ top: 24, right: 8, left: 0, bottom: 0 }} barCategoryGap="32%">
              <CartesianGrid vertical={false} stroke={PALETA.grid} strokeDasharray="3 3" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: '#E5E7EB' }}
                tick={{ fontSize: 11, fontWeight: 600, fill: PALETA.textoSecundario }}
                interval="preserveStartEnd"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatoMoneda}
                tick={{ fontSize: 11, fill: PALETA.textoSecundario }}
                width={48}
              />
              <Tooltip
                cursor={{ fill: 'rgba(30,77,58,0.04)' }}
                content={<TooltipPersonalizado filtroTipo={filtroTipo} />}
              />
              <Bar dataKey="value" fill={COLOR_INDIVIDUAL[filtroTipo]} radius={[4, 4, 0, 0]} maxBarSize={36}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={formatoMonedaLabel}
                  style={{ fontSize: 10, fontWeight: 600, fill: '#374151' }}
                />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Leyenda fija (solo vista "todos") */}
      {filtroTipo === 'todos' && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-3">
          {[
            { color: PALETA.celeste, label: 'Predial' },
            { color: PALETA.multa, label: 'Multas' },
            { color: PALETA.lineaAcumulado, label: 'Acumulado', linea: true },
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
};
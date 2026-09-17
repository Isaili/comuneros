"use client";

import React, { useEffect, useState } from "react";
import { Users, FileText, Landmark, CircleDollarSign, Calendar } from "lucide-react";
import StatCard from "./StatCard";
import IncomeChart from "./IncomeChart";
import NextAssembly from "./NextAssembly";
import { comunerosApi } from '../../comuneros/services/comunerosApi';
import { plotsService } from '../../parcelas/services/parcelas.service';
import {
  leerCacheDashboard,
  guardarCacheDashboard,
  invalidarCacheDashboard,
  DASHBOARD_INVALIDATE_EVENT,
} from '@/features/menu/services/dashboardCache'; 

let cargaDashboardEnCurso: Promise<{
  totales: { comuneros: number; parcelas: number };
}> | null = null;

const cargarTotalesDesdeApi = () => {
  cargaDashboardEnCurso ??= Promise.all([
    comunerosApi.listar(1, 1),
    plotsService.list({ page: 1, limit: 1 }),
  ]).then(([comunerosResponse, parcelasResponse]) => {
    const resultado = {
      totales: {
        comuneros: comunerosResponse.total || 0,
        parcelas: parcelasResponse.data.total || 0,
      },
    };
    guardarCacheDashboard(resultado);
    return resultado;
  }).finally(() => {
    cargaDashboardEnCurso = null;
  });

  return cargaDashboardEnCurso;
};

export default function DashboardView({ activo = true }: { activo?: boolean }) {
  const [fechaActual, setFechaActual] = useState<string>('');
  const [totales, setTotales] = useState({ comuneros: 0, parcelas: 0 });

  useEffect(() => {
    if (!activo) return;
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const fecha = new Date().toLocaleDateString('es-MX', opciones);
    setFechaActual(fecha.charAt(0).toUpperCase() + fecha.slice(1));
  }, [activo]);

  useEffect(() => {
    if (!activo) return;

    let montado = true;

    const cargarTotales = (forzar = false) => {
      if (!forzar) {
        const cache = leerCacheDashboard();
        if (cache?.totales) {
          setTotales(cache.totales);
          return;
        }
      }

      cargarTotalesDesdeApi()
        .then((resultado) => {
          if (!montado) return;
          setTotales(resultado.totales);
        })
        .catch((error) => {
          console.error('Error al cargar resumen del dashboard:', error);
        });
    };

    cargarTotales();

    const onInvalidate = () => cargarTotales(true);
    window.addEventListener(DASHBOARD_INVALIDATE_EVENT, onInvalidate);

    return () => {
      montado = false;
      window.removeEventListener(DASHBOARD_INVALIDATE_EVENT, onInvalidate);
    };
  }, [activo]);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-[100px] sm:h-[110px] overflow-hidden pointer-events-none z-0 rounded-b-xl">
        <img
          src="/header.png"
          alt="Header background"
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f8fafc] via-[#f8fafc]/85 to-transparent"></div>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
            ¡Bienvenido, <span className="text-[#006837]">Mario</span>!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
            Resumen actualizado del estado de Bienes Comunales.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-xs font-semibold text-gray-700 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>FECHA ACTUAL:</span>
          <span className="text-gray-900 font-bold">
            {fechaActual || "Cargando..."}
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-10 sm:mt-15 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 sm:rounded-2xl min-w-0">
        <StatCard
          title="Comuneros registrados"
          value={String(totales.comuneros)}
          subtext="Total actual del padrón"
          icon={Users}
          iconBg="bg-[#E6F2E9]"
          iconColor="text-[#1F4D3C]"
        />
        <StatCard
          title="Parcelas registradas"
          value={String(totales.parcelas)}
          subtext="Total actual de parcelas activas"
          icon={FileText}
          iconBg="bg-[#E6F2E9]"
          iconColor="text-[#1F4D3C]"
        />
        <StatCard
          title="Lotes Registrados"
          value="37"
          subtext="$ 148,500 en adeudo"
          icon={Landmark}
          iconBg="bg-[#E6F2E9]"
          iconColor="text-[#1F4D3C]"
        />
        <StatCard
          title="Ingresos del periodo"
          value="$286,400"
          subtext="↑ $18,650 vs. mes pasado"
          icon={CircleDollarSign}
          iconBg="bg-[#E6F2E9]"
          iconColor="text-[#1F4D3C]"
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
          <IncomeChart />
        </div>
        <div className="flex flex-col gap-6 h-full min-w-0">
          <NextAssembly />
        </div>
      </div>

    </div>
  );
}
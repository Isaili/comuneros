"use client";

import React, { useEffect, useState } from "react";
import { Users, FileText, Landmark, CircleDollarSign, Calendar } from "lucide-react";
import StatCard from "./StatCard";
import IncomeChart from "./IncomeChart";
import NextAssembly from "./NextAssembly";
import AssemblyHistory from "./AssemblyHistory";

export default function DashboardView() {
  const [fechaActual, setFechaActual] = useState<string>('');

  useEffect(() => {
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const fecha = new Date().toLocaleDateString('es-MX', opciones);
    setFechaActual(fecha.charAt(0).toUpperCase() + fecha.slice(1));
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
            ¡Bienvenido, <span className="text-[#006837]">Mario</span>!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
            Resumen actualizado del estado de la Comisaría Comunal.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm text-xs font-semibold text-gray-700 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>FECHA ACTUAL:</span>
          <span className="text-gray-900 font-bold">
            {fechaActual || "Cargando..."}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 sm:rounded-2xl min-w-0">
        <StatCard 
          title="Comuneros registrados" 
          value="428" 
          subtext="↗ 12 más que el mes pasado" 
          icon={Users}
          iconBg="bg-[#E6F2E9]"
          iconColor="text-[#1F4D3C]"
        />
        <StatCard 
          title="Parcelas registradas" 
          value="512" 
          subtext="↗ 8 nuevas este mes" 
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
          <IncomeChart />
        </div>
        <div className="flex flex-col gap-6 h-full min-w-0">
          <NextAssembly />
          <AssemblyHistory />
        </div>
      </div>

    </div>
  );
}
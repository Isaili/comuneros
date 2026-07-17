"use client";

import React from "react";
import { Users, FileText, Landmark, CircleDollarSign, CalendarDays } from "lucide-react";
import StatCard from "./StatCard";
import IncomeChart from "./IncomeChart";
import NextAssembly from "./NextAssembly";
import AssemblyHistory from "./AssemblyHistory";

export default function DashboardView() {
  // Obtener la fecha actual para mostrarla de forma dinámica y elegante
  const fechaActual = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 text-gray-800">
      
      {/* Encabezado Rediseñado (Premium) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200/60 min-w-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-serif">
              ¡Bienvenido, <span className="text-[#1E4D3A]">Mario</span>!
            </h1>

          </div>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide">
            Resumen actualizado del estado de la Comisaría Ejidal.
          </p>
        </div>

        {/* Widget de Fecha a la derecha */}
        <div className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] self-start sm:self-auto shrink-0 transition-all hover:border-gray-250">
          <div className="p-1.5 bg-gray-50 rounded-lg text-gray-500">
            <CalendarDays className="w-4 h-4 text-[#1E4D3A]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fecha actual</span>
            <span className="text-xs font-semibold text-gray-700 capitalize">{fechaActual}</span>
          </div>
        </div>
      </div>

      {/* Grid de Tarjetas */}
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
"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown, DollarSign } from "lucide-react";

// Estructura de datos expandida para soportar filtros por tipo de ingreso y rango de fechas
const matrizDatos = {
  bimestres: {
    todos: [
      { label: "Ene-Feb", value: 75, amount: "$300,000" },
      { label: "Mar-Abr", value: 85, amount: "$460,000" },
      { label: "May-Jun", value: 100, amount: "$720,000" },
      { label: "Jul-Ago", value: 90, amount: "$540,000" },
      { label: "Sep-Oct", value: 65, amount: "$380,000" },
      { label: "Nov-Dic", value: 95, amount: "$640,500" },
    ],
    predial: [
      { label: "Ene-Feb", value: 50, amount: "$200,000" },
      { label: "Mar-Abr", value: 40, amount: "$160,000" },
      { label: "May-Jun", value: 30, amount: "$120,000" },
      { label: "Jul-Ago", value: 20, amount: "$80,000" },
      { label: "Sep-Oct", value: 25, amount: "$100,000" },
      { label: "Nov-Dic", value: 60, amount: "$240,000" },
    ],
    multas: [
      { label: "Ene-Feb", value: 45, amount: "$180,000" },
      { label: "Mar-Abr", value: 65, amount: "$260,000" },
      { label: "May-Jun", value: 85, amount: "$340,000" },
      { label: "Jul-Ago", value: 75, amount: "$300,000" },
      { label: "Sep-Oct", value: 55, amount: "$220,000" },
      { label: "Nov-Dic", value: 90, amount: "$360,000" },
    ],
    otros: [
      { label: "Ene-Feb", value: 30, amount: "$120,000" },
      { label: "Mar-Abr", value: 50, amount: "$200,000" },
      { label: "May-Jun", value: 95, amount: "$380,000" },
      { label: "Jul-Ago", value: 60, amount: "$240,000" },
      { label: "Sep-Oct", value: 40, amount: "$160,000" },
      { label: "Nov-Dic", value: 70, amount: "$280,000" },
    ],
  },
  anioActual: {
    todos: [
      { label: "Trim 1", value: 65, amount: "$520,000" },
      { label: "Trim 2", value: 95, amount: "$890,000" },
      { label: "Trim 3", value: 70, amount: "$610,000" },
      { label: "Trim 4", value: 85, amount: "$780,000" },
    ],
    predial: [
      { label: "Trim 1", value: 80, amount: "$350,000" },
      { label: "Trim 2", value: 40, amount: "$180,000" },
      { label: "Trim 3", value: 30, amount: "$120,000" },
      { label: "Trim 4", value: 55, amount: "$210,000" },
    ],
    multas: [
      { label: "Trim 1", value: 40, amount: "$110,000" },
      { label: "Trim 2", value: 85, amount: "$310,000" },
      { label: "Trim 3", value: 75, amount: "$260,000" },
      { label: "Trim 4", value: 90, amount: "$340,000" },
    ],
    otros: [
      { label: "Trim 1", value: 30, amount: "$60,000" },
      { label: "Trim 2", value: 90, amount: "$400,000" },
      { label: "Trim 3", value: 70, amount: "$230,000" },
      { label: "Trim 4", value: 50, amount: "$230,000" },
    ],
  },
  historico: {
    todos: [
      { label: "2023", value: 60, amount: "$2.1M" },
      { label: "2024", value: 78, amount: "$2.9M" },
      { label: "2025", value: 90, amount: "$3.4M" },
      { label: "2026", value: 100, amount: "$4.1M" },
    ],
    predial: [{ label: "2023", value: 70, amount: "$900k" }, { label: "2024", value: 75, amount: "$1.1M" }, { label: "2025", value: 80, amount: "$1.3M" }, { label: "2026", value: 85, amount: "$1.5M" }],
    multas: [{ label: "2023", value: 40, amount: "$500k" }, { label: "2024", value: 60, amount: "$800k" }, { label: "2025", value: 85, amount: "$1.2M" }, { label: "2026", value: 95, amount: "$1.6M" }],
    otros: [{ label: "2023", value: 50, amount: "$700k" }, { label: "2024", value: 70, amount: "$1.0M" }, { label: "2025", value: 65, amount: "$900k" }, { label: "2026", value: 75, amount: "$1.0M" }],
  }
};

type TipoIngreso = "todos" | "predial" | "multas" | "otros";
type RangoFecha = "bimestres" | "anioActual" | "historico";

export default function IncomeChart() {
  const [filtroIngreso, setFiltroIngreso] = useState<TipoIngreso>("todos");
  const [filtroFecha, setFiltroFecha] = useState<RangoFecha>("bimestres");

  const titulos = {
    todos: "Ingresos del Periodo (Unificados)",
    predial: "Ingresos por Predial",
    multas: "Ingresos por Multas",
    otros: "Otros Tipos de Ingresos",
  };

  const dataActual = matrizDatos[filtroFecha][filtroIngreso];

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 min-w-0">
      
      {/* Encabezado y Controles Flexibles */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E4D3A]" />
            {titulos[filtroIngreso]}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Filtrado por tiempo y conceptos de caja
          </p>
        </div>

        {/* Panel de Control de Filtros */}
        <div className="flex flex-col xs:flex-row items-center gap-2 w-full lg:w-auto">
          
          {/* Selector 1: Concepto de Ingreso */}
          <div className="relative w-full xs:w-auto flex-1 xs:flex-initial">
            <select
              value={filtroIngreso}
              onChange={(e) => setFiltroIngreso(e.target.value as TipoIngreso)}
              className="w-full appearance-none bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E4D3A]/10 focus:border-[#1E4D3A] cursor-pointer"
            >
              <option value="todos font-sans">💰 Todos los ingresos</option>
              <option value="predial">🏡 Por Predial</option>
              <option value="multas">⚖️ Por Multas</option>
              <option value="otros">📦 Otros Ingresos</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Selector 2: Rango de Fechas */}
          <div className="relative w-full xs:w-auto flex-1 xs:flex-initial">
            <select
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value as RangoFecha)}
              className="w-full appearance-none bg-white hover:bg-gray-50 transition-colors border border-gray-200 rounded-xl px-3 py-1.5 pl-8 pr-8 text-xs font-medium text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1E4D3A]/10 focus:border-[#1E4D3A] cursor-pointer"
            >
              <option value="bimestres">Últimos 6 bimestres</option>
              <option value="anioActual">Año Actual (2026)</option>
              <option value="historico">Histórico Anual</option>
            </select>
            <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Canvas/Contenedor de la Gráfica Mejorada */}
      <div className="overflow-x-auto pb-2 custom-scrollbar">
        {/* Cambia el grid interno adaptando dinámicamente las columnas según la cantidad de datos */}
        <div className="flex items-end gap-2 h-64 pt-6 min-w-[460px] sm:min-w-0">
          
          {/* Eje Y Rediseñado */}
          <div className="flex flex-col justify-between h-full text-[10px] font-bold text-gray-400/80 pr-3 pb-7 select-none sticky left-0 bg-white z-10 border-r border-gray-100/50">
            <span>$400k</span>
            <span>$300k</span>
            <span>$200k</span>
            <span>$100k</span>
            <span>$0k</span>
          </div>

          {/* Área Dinámica de Barras Estilizadas */}
          <div 
            className="flex-1 grid gap-4 sm:gap-6 h-full items-end px-2"
            style={{ gridTemplateColumns: `repeat(${dataActual.length}, minmax(0, 1fr))` }}
          >
            {dataActual.map((item, index) => (
              <div key={index} className="flex flex-col items-center h-full justify-end group relative">
                
                {/* Tooltip flotante Premium con ícono */}
                <div className="absolute -top-8 bg-gray-900 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 shadow-lg pointer-events-none whitespace-nowrap z-20 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-amber-400 shrink-0" />
                  {item.amount}
                </div>
                
                {/* Barra Estilizada con Degradado Soft-Glow */}
                <div className="w-full bg-gray-50 rounded-t-lg h-full flex items-end overflow-hidden">
                  <div 
                    style={{ height: `${item.value}%` }}
                    className="w-full bg-gradient-to-t from-[#143528] to-[#256149] rounded-t-lg transition-all duration-700 ease-out group-hover:to-[#2e7559] group-hover:shadow-[0_0_12px_rgba(30,77,58,0.2)] cursor-pointer"
                  />
                </div>
                
                {/* Eje X */}
                <span className="text-[11px] font-semibold text-gray-400 group-hover:text-gray-700 mt-2.5 text-center truncate w-full transition-colors">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
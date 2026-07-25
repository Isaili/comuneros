"use client";

import React from 'react';
import { CircleDollarSign, Landmark, Gavel, TrendingUp } from 'lucide-react';

interface ResumenIngresosCardsProps {
  ingresosHoy: number;
  ingresosPredial: number;
  ingresosMultas: number;
  totalPeriodo: number;
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

const Card: React.FC<{ title: string; value: string; subtext: string; icon: React.ElementType }> = ({
  title,
  value,
  subtext,
  icon: Icon,
}) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{title}</p>
      <span className="p-2 bg-[#1E4D3A]/10 text-[#1E4D3A] rounded-xl shrink-0">
        <Icon className="w-4 h-4" />
      </span>
    </div>
    <p className="text-xl sm:text-2xl font-black text-gray-900">{value}</p>
    <p className="text-xs text-gray-400 font-semibold">{subtext}</p>
  </div>
);

export const ResumenIngresosCards: React.FC<ResumenIngresosCardsProps> = ({
  ingresosHoy,
  ingresosPredial,
  ingresosMultas,
  totalPeriodo,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <Card title="Ingresos de hoy" value={formatoMoneda(ingresosHoy)} subtext="Corte del día actual" icon={CircleDollarSign} />
      <Card title="Por predial" value={formatoMoneda(ingresosPredial)} subtext="Últimos 8 días" icon={Landmark} />
      <Card title="Por multas" value={formatoMoneda(ingresosMultas)} subtext="Últimos 8 días" icon={Gavel} />
      <Card title="Total del periodo" value={formatoMoneda(totalPeriodo)} subtext="Predial + multas" icon={TrendingUp} />
    </div>
  );
};
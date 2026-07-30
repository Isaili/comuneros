"use client";

import React from 'react';
import { CircleDollarSign, Landmark, Gavel } from 'lucide-react';
import StatCard from '../../menu/components/StatCard';

interface ResumenIngresosCardsProps {
  ingresosHoy: number;
  ingresosPredial: number;
  ingresosMultas: number;
}

const formatoMoneda = (valor: number) =>
  valor.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

export const ResumenIngresosCards: React.FC<ResumenIngresosCardsProps> = ({
  ingresosHoy,
  ingresosPredial,
  ingresosMultas,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-w-0">
      <StatCard
        title="Ingresos de hoy"
        value={formatoMoneda(ingresosHoy)}
        subtext="Corte del día actual"
        icon={CircleDollarSign}
        iconBg="bg-[#E6F2E9]"
        iconColor="text-[#1F4D3C]"
      />
      <StatCard
        title="Por predial"
        value={formatoMoneda(ingresosPredial)}
        subtext="Acumulado últimos 8 días"
        icon={Landmark}
        iconBg="bg-[#E6F2E9]"
        iconColor="text-[#1F4D3C]"
      />
      <StatCard
        title="Por multas"
        value={formatoMoneda(ingresosMultas)}
        subtext="Acumulado últimos 8 días"
        icon={Gavel}
        iconBg="bg-[#E6F2E9]"
        iconColor="text-[#1F4D3C]"
      />
    </div>
  );
};
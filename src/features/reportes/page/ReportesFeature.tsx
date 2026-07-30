"use client";

import React, { useMemo, useState } from 'react';
import { ReportesHeader } from '../components/ReportesHeader';
import { ResumenIngresosCards } from '../components/ResumenIngresosCards';
import { IngresosDiariosChart } from '../components/IngresosDiariosChart';
import { ListadoIngresosTable } from '../components/ListadoIngresosTable';
import { ReunionHistorial } from '../types/types';
import { ingresosMock } from '../mocks/ingresosMock';
import { reunionesHistorialMock } from '../mocks/reunionesHistorialMock';

export default function ReportesFeature() {
  const [reunionSeleccionada, setReunionSeleccionada] = useState<ReunionHistorial | null>(null);

  const hoyISO = new Date().toISOString().slice(0, 10);

  const ingresosHoy = useMemo(
    () => ingresosMock.filter((i) => i.fecha.slice(0, 10) === hoyISO).reduce((acc, i) => acc + i.monto, 0),
    [hoyISO]
  );

  const ingresosPredial = useMemo(
    () => ingresosMock.filter((i) => i.tipo === 'predial').reduce((acc, i) => acc + i.monto, 0),
    []
  );

  const ingresosMultas = useMemo(
    () => ingresosMock.filter((i) => i.tipo === 'multa').reduce((acc, i) => acc + i.monto, 0),
    []
  );

  const totalPeriodo = ingresosPredial + ingresosMultas;

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      <ReportesHeader />

      <ResumenIngresosCards
        ingresosHoy={ingresosHoy}
        ingresosPredial={ingresosPredial}
        ingresosMultas={ingresosMultas}
        totalPeriodo={totalPeriodo}
      />

      <IngresosDiariosChart ingresos={ingresosMock} />

      <div className="gap-6 items-start">
        <div className="lg:col-span-2 min-w-0">
          <ListadoIngresosTable ingresos={ingresosMock} />
        </div>
      </div>
    </div>
  );
}
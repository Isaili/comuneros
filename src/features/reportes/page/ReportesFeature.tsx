"use client";

import React, { useMemo, useState } from 'react';
import { ReportesHeader } from '../components/ReportesHeader';
import { ResumenIngresosCards } from '../components/ResumenIngresosCards';
import { IngresosDiariosChart } from '../components/IngresosDiariosChart';
import { ListadoIngresosTable } from '../components/ListadoIngresosTable';
import { HistorialReunionesList } from '../components/HistorialReunionesList';
import { AsistentesReunionModal } from '../components/modals/AsistentesReunionModal';
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
    <div className="flex-1 min-w-0 p-4 sm:p-8 pt-20 lg:pt-8 space-y-6 overflow-y-auto h-screen bg-[#FAFAFA]">
      <ReportesHeader />

      <ResumenIngresosCards
        ingresosHoy={ingresosHoy}
        ingresosPredial={ingresosPredial}
        ingresosMultas={ingresosMultas}
        totalPeriodo={totalPeriodo}
      />

      <IngresosDiariosChart ingresos={ingresosMock} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 min-w-0">
          <ListadoIngresosTable ingresos={ingresosMock} />
        </div>
        <div className="min-w-0">
          <HistorialReunionesList reuniones={reunionesHistorialMock} onSeleccionar={setReunionSeleccionada} />
        </div>
      </div>

      {reunionSeleccionada && (
        <AsistentesReunionModal reunion={reunionSeleccionada} onClose={() => setReunionSeleccionada(null)} />
      )}
    </div>
  );
}
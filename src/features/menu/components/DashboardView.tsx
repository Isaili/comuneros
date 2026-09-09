"use client";

import React, { useEffect, useState } from "react";
import { Users, FileText, Landmark, CircleDollarSign, Calendar } from "lucide-react";
import StatCard from "./StatCard";
import IncomeChart from "./IncomeChart";
import NextAssembly from "./NextAssembly";
import { HistorialReunionesList } from "../../menu/components/HistorialReunionesList";
import { AsistentesReunionModal } from "../../menu/components/modals/AsistentesReunionModal";
import { ReunionHistorial } from "../../reportes/types/types";
import { comunerosApi } from '../../comuneros/services/comunerosApi';
import { plotsService } from '../../parcelas/services/parcelas.service';
import { assembliesApi, attendanceToRegistro, obtenerItemsPaginados } from '../../kiosco-qr/services/assembliesApi';

export default function DashboardView({ activo = true }: { activo?: boolean }) {
  const [fechaActual, setFechaActual] = useState<string>('');
  const [reunionSeleccionada, setReunionSeleccionada] = useState<ReunionHistorial | null>(null);
  const [totales, setTotales] = useState({ comuneros: 0, parcelas: 0 });
  const [reunionesHistorial, setReunionesHistorial] = useState<ReunionHistorial[]>([]);
  const [cargandoReuniones, setCargandoReuniones] = useState(true);

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

    let isMounted = true;

    const cargarTotales = async () => {
      try {
        const [comunerosResponse, parcelasResponse] = await Promise.all([
          comunerosApi.listar(1, 1),
          plotsService.list({ page: 1, limit: 1 }),
        ]);

        if (!isMounted) return;

        setTotales({
          comuneros: comunerosResponse.total || 0,
          parcelas: parcelasResponse.data.total || 0,
        });
      } catch {
        if (isMounted) {
          setTotales({ comuneros: 0, parcelas: 0 });
        }
      }
    };

    cargarTotales();

    return () => {
      isMounted = false;
    };
  }, [activo]);

  useEffect(() => {
    if (!activo) return;
    let montado = true;
    assembliesApi.listar({ page: 1, limit: 100 })
      .then(async (response) => {
        const reuniones = await Promise.all(response.data.data.items
          .filter((assembly) => assembly.status === 'COMPLETED')
          .map(async (assembly) => {
          const asistencias = await assembliesApi.asistencias(assembly.id, {
            status: 'PRESENT',
            page: 1,
            limit: 100,
          });
          const items = obtenerItemsPaginados(asistencias.data.data)
            .filter((attendance) => (attendance.status ?? attendance.attendanceStatus) === 'PRESENT')
            .filter((attendance, index, records) => {
              const identity = attendance.personId ?? attendance.fullName ?? `index-${index}`;
              return records.findIndex((candidate) =>
                (candidate.personId ?? candidate.fullName) === identity
              ) === index;
            });
          return {
            id: assembly.id,
            nombre: assembly.title,
            fecha: assembly.scheduledDate,
            horaInicio: new Date(assembly.scheduledDate).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
            lugar: 'Asamblea comunitaria',
            asistentes: items.map((attendance, index) => {
              const registro = attendanceToRegistro(attendance, index);
              return {
                id: registro.id,
                nombre: registro.nombre,
                fotografia: registro.fotografia,
                folio: registro.folio,
                horaEntrada: registro.horaEntrada,
                horaSalida: registro.horaSalida,
              };
            }),
          };
        }));
        if (montado) setReunionesHistorial(reuniones);
      })
      .catch((error) => {
        console.error('Error al cargar historial de asambleas:', error);
        if (montado) setReunionesHistorial([]);
      })
      .finally(() => {
        if (montado) setCargandoReuniones(false);
      });
    return () => {
      montado = false;
    };
  }, [activo]);

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
            ¡Bienvenido, <span className="text-[#006837]">Mario</span>!
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
            Resumen actualizado del estado de Bienes Comunales.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0">
          <IncomeChart />
        </div>
        <div className="flex flex-col gap-6 h-full min-w-0">
          <NextAssembly />
          <HistorialReunionesList reuniones={reunionesHistorial} onSeleccionar={setReunionSeleccionada} cargando={cargandoReuniones} />
        </div>
      </div>

      {reunionSeleccionada && (
        <AsistentesReunionModal reunion={reunionSeleccionada} onClose={() => setReunionSeleccionada(null)} />
      )}

    </div>
  );
}
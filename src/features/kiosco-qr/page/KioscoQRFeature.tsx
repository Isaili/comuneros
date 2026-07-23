"use client";

import React, { useMemo, useState } from 'react';
import { KioscoHeader } from '../components/KioscoHeader';
import { ReunionEstadoCard } from '../components/ReunionEstadoCard';
import { ProximasReunionesList } from '../components/ProximasReunionesList';
import { CodigoQRPanel } from '../components/CodigoQRPanel';
import { AsistentesEnVivoGrid } from '../components/AsistentesEnVivoGrid';
import { ComuneroPanel } from '../components/ComuneroPanel';
import { NotificacionCierre } from '../components/NotificacionCierre';
import { ConfirmarCierreReunionModal } from '../components/modals/ConfirmarCierreReunionModal';
import { AvisoProximoCierre } from '../components/Avisoproximocierre';
import { Reunion, AsistenteRegistro } from '../types/types';
import { reunionesMock } from '../mocks/reunionesMock';
import { comunerosMock } from '../mocks/comunerosMock';

export default function KioscoQRFeature() {
  const [reuniones, setReuniones] = useState<Reunion[]>(reunionesMock);
  const [reunionActivaId, setReunionActivaId] = useState<string | null>(null);
  const [asistentes, setAsistentes] = useState<AsistenteRegistro[]>([]);
  const [comuneroSeleccionado, setComuneroSeleccionado] = useState<AsistenteRegistro | null>(null);
  const [modalCerrar, setModalCerrar] = useState(false);
  const [avisoProximoCierre, setAvisoProximoCierre] = useState<string | null>(null);
  const [notificacionCierre, setNotificacionCierre] = useState<string | null>(null);

  const reunionActiva = useMemo(
    () => reuniones.find((r) => r.id === reunionActivaId) ?? null,
    [reuniones, reunionActivaId]
  );

  const reunionProxima = useMemo(
    () => reuniones.find((r) => r.estado === 'programada') ?? null,
    [reuniones]
  );

  const proximasFuturas = useMemo(
    () => reuniones.filter((r) => r.estado === 'programada' && r.id !== reunionProxima?.id),
    [reuniones, reunionProxima]
  );

  const abrirReunion = () => {
    if (!reunionProxima) return;
    setReuniones((prev) => prev.map((r) => (r.id === reunionProxima.id ? { ...r, estado: 'en_curso' } : r)));
    setReunionActivaId(reunionProxima.id);
    setAsistentes([]);
    setComuneroSeleccionado(null);
  };

  const confirmarCierre = () => {
    if (!reunionActiva) return;
    setReuniones((prev) => prev.map((r) => (r.id === reunionActiva.id ? { ...r, estado: 'finalizada' } : r)));
    setNotificacionCierre(reunionActiva.nombre);
    setModalCerrar(false);
    setReunionActivaId(null);
    setComuneroSeleccionado(null);
  };

  const simularEscaneo = () => {
    if (!reunionActiva) return;

    // Escoge un comunero que aún no haya salido; si ya está dentro, registra su salida.
    const yaDentro = asistentes.find((a) => !a.horaSalida);
    const disponibles = comunerosMock.filter((c) => !asistentes.some((a) => a.comuneroId === c.id && !a.horaSalida));

    if (yaDentro && Math.random() < 0.3) {
      // Simula que el siguiente escaneo desde celular es de alguien que ya estaba dentro (registra salida)
      const actualizado: AsistenteRegistro = { ...yaDentro, horaSalida: new Date().toISOString() };
      setAsistentes((prev) => prev.map((a) => (a.id === actualizado.id ? actualizado : a)));
      setComuneroSeleccionado(actualizado);
      return;
    }

    const comunero = disponibles[Math.floor(Math.random() * disponibles.length)] ?? comunerosMock[0];
    const nuevoRegistro: AsistenteRegistro = {
      id: `${comunero.id}-${Date.now()}`,
      comuneroId: comunero.id,
      nombre: comunero.nombre,
      folio: comunero.folio,
      fotografia: comunero.fotografia,
      horaEntrada: new Date().toISOString(),
    };
    setAsistentes((prev) => [...prev, nuevoRegistro]);
    setComuneroSeleccionado(nuevoRegistro);
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      <KioscoHeader />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 w-full space-y-6">
          <ReunionEstadoCard
            reunionProxima={reunionProxima}
            reunionActiva={reunionActiva}
            totalAsistentes={asistentes.length}
            onAbrirClick={abrirReunion}
            onCerrarClick={() => setModalCerrar(true)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CodigoQRPanel activo={!!reunionActiva} reunionId={reunionActiva?.id} onSimularEscaneo={simularEscaneo} />
            <AsistentesEnVivoGrid asistentes={asistentes} onSeleccionar={setComuneroSeleccionado} />
          </div>

          <ProximasReunionesList reuniones={proximasFuturas} />
        </div>

        <ComuneroPanel asistente={comuneroSeleccionado} onCerrar={() => setComuneroSeleccionado(null)} />
      </div>

      {modalCerrar && reunionActiva && (
        <ConfirmarCierreReunionModal
          reunion={reunionActiva}
          totalAsistentes={asistentes.length}
          onClose={() => setModalCerrar(false)}
          onConfirmar={confirmarCierre}
        />
      )}

      {notificacionCierre && (
        <NotificacionCierre nombreReunion={notificacionCierre} onCerrar={() => setNotificacionCierre(null)} />
      )}
      {avisoProximoCierre && (
        <AvisoProximoCierre nombreReunion={avisoProximoCierre} onCerrar={() => setAvisoProximoCierre(null)} />
      )}
    </div>
  );
}
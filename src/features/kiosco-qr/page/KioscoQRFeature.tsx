"use client";

import React, { useMemo, useState } from 'react';
import { KioscoHeader } from '../components/KioscoHeader';
import { ReunionEstadoCard } from '../components/ReunionEstadoCard';
import { ProximasReunionesList } from '../components/ProximasReunionesList';
import { EscanerQrPanel } from '../components/EscanerQRPanel';
import { AsistentesEnVivoGrid } from '../components/AsistentesEnVivoGrid';
import { ComuneroPanel } from '../components/ComuneroPanel';
import { NotificacionCierre } from '../components/NotificacionCierre';
import { ConfirmarCierreReunionModal } from '../components/modals/ConfirmarCierreReunionModal';
import { CrearReunionModal } from '../components/modals/CrearReunionModal';
import { AvisoProximoCierre } from '../components/Avisoproximocierre';
import { Reunion, AsistenteRegistro } from '../types/types';
import { reunionesMock } from '../mocks/reunionesMock';
import { comunerosMock } from '../mocks/comunerosMock';

const fechaHoraTimestamp = (r: Reunion) => new Date(`${r.fecha}T${r.horaInicio}`).getTime();

export default function KioscoQRFeature() {
  const [reuniones, setReuniones] = useState<Reunion[]>(reunionesMock);
  const [reunionActivaId, setReunionActivaId] = useState<string | null>(null);
  const [reunionSeleccionadaId, setReunionSeleccionadaId] = useState<string | null>(null);
  const [asistentes, setAsistentes] = useState<AsistenteRegistro[]>([]);
  const [comuneroSeleccionado, setComuneroSeleccionado] = useState<AsistenteRegistro | null>(null);
  const [modalCerrar, setModalCerrar] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [avisoProximoCierre, setAvisoProximoCierre] = useState<string | null>(null);
  const [notificacionCierre, setNotificacionCierre] = useState<string | null>(null);
  const [salidasHabilitadas, setSalidasHabilitadas] = useState(false);

  const reunionActiva = useMemo(
    () => reuniones.find((r) => r.id === reunionActivaId) ?? null,
    [reuniones, reunionActivaId]
  );

  const reunionesProgramadas = useMemo(
    () =>
      reuniones
        .filter((r) => r.estado === 'programada')
        .sort((a, b) => fechaHoraTimestamp(a) - fechaHoraTimestamp(b)),
    [reuniones]
  );

  const reunionMasCercana = reunionesProgramadas[0] ?? null;

  const reunionProxima = useMemo(() => {
    if (reunionSeleccionadaId) {
      const encontrada = reunionesProgramadas.find((r) => r.id === reunionSeleccionadaId);
      if (encontrada) return encontrada;
    }
    return reunionMasCercana;
  }, [reunionesProgramadas, reunionSeleccionadaId, reunionMasCercana]);

  const esLaMasCercana = reunionProxima?.id === reunionMasCercana?.id;

  const abrirReunion = () => {
    if (!reunionProxima) return;
    setReuniones((prev) => prev.map((r) => (r.id === reunionProxima.id ? { ...r, estado: 'en_curso' } : r)));
    setReunionActivaId(reunionProxima.id);
    setAsistentes([]);
    setComuneroSeleccionado(null);
    setSalidasHabilitadas(false); 
  };

  const confirmarCierre = () => {
    if (!reunionActiva) return;
    setReuniones((prev) => prev.map((r) => (r.id === reunionActiva.id ? { ...r, estado: 'finalizada' } : r)));
    setNotificacionCierre(reunionActiva.nombre);
    setModalCerrar(false);
    setReunionActivaId(null);
    setReunionSeleccionadaId(null);
    setComuneroSeleccionado(null);
    setSalidasHabilitadas(false);
  };

  const seleccionarReunionDestacada = (reunionId: string) => {
    setReunionSeleccionadaId(reunionId);
  };

  const crearReunion = (datos: Omit<Reunion, 'id' | 'estado'>) => {
    const nuevaReunion: Reunion = {
      ...datos,
      id: `reu-${Date.now()}`,
      estado: 'programada',
    };
    setReuniones((prev) => [...prev, nuevaReunion]);
    setModalCrear(false);
  };

  const habilitarSalidas = () => {
    setSalidasHabilitadas(true);
  };

  const simularEscaneo = () => {
    if (!reunionActiva) return;

    if (salidasHabilitadas) {
      const dentro = asistentes.filter((a) => !a.horaSalida);
      if (dentro.length === 0) return; 

      const elegido = dentro[Math.floor(Math.random() * dentro.length)];
      const actualizado: AsistenteRegistro = { ...elegido, horaSalida: new Date().toISOString() };
      setAsistentes((prev) => prev.map((a) => (a.id === actualizado.id ? actualizado : a)));
      setComuneroSeleccionado(actualizado);
      return;
    }

    
    const disponibles = comunerosMock.filter((c) => !asistentes.some((a) => a.comuneroId === c.id && !a.horaSalida));
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
            esLaMasCercana={esLaMasCercana}
            totalAsistentes={asistentes.length}
            salidasHabilitadas={salidasHabilitadas}
            onAbrirClick={abrirReunion}
            onCerrarClick={() => setModalCerrar(true)}
            onHabilitarSalidasClick={habilitarSalidas}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EscanerQrPanel
              activo={!!reunionActiva}
              reunionId={reunionActiva?.id}
              salidasHabilitadas={salidasHabilitadas}
              onSimularEscaneo={simularEscaneo}
            />
            <AsistentesEnVivoGrid asistentes={asistentes} onSeleccionar={setComuneroSeleccionado} />
          </div>

          <ProximasReunionesList
            reuniones={reunionesProgramadas}
            reunionDestacadaId={reunionProxima?.id ?? null}
            reunionMasCercanaId={reunionMasCercana?.id ?? null}
            onSeleccionar={seleccionarReunionDestacada}
            onNuevaReunion={() => setModalCrear(true)}
          />
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

      {modalCrear && (
        <CrearReunionModal onClose={() => setModalCrear(false)} onCrear={crearReunion} />
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
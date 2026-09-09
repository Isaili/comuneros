"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { assembliesApi, assemblyToReunion, attendanceToRegistro } from '../services/assembliesApi';
import { crearCanalAsistencia, publicarEvento, guardarSnapshot } from '../../bienvenida-comunero/model/asistenciaChannel';

const fechaHoraTimestamp = (r: Reunion) => new Date(`${r.fecha}T${r.horaInicio}`).getTime();

const INTERVALO_REVISION_MS = 15_000;

export default function KioscoQRFeature() {
  const [reuniones, setReuniones] = useState<Reunion[]>([]);
  const [reunionActivaId, setReunionActivaId] = useState<string | null>(null);
  const [reunionSeleccionadaId, setReunionSeleccionadaId] = useState<string | null>(null);
  const [asistentes, setAsistentes] = useState<AsistenteRegistro[]>([]);
  const [comuneroSeleccionado, setComuneroSeleccionado] = useState<AsistenteRegistro | null>(null);
  const [modalCerrar, setModalCerrar] = useState(false);
  const [modalCrear, setModalCrear] = useState(false);
  const [avisoProximoCierre, setAvisoProximoCierre] = useState<string | null>(null);
  const [notificacionCierre, setNotificacionCierre] = useState<string | null>(null);
  const [salidasHabilitadas, setSalidasHabilitadas] = useState(false);
  const [estadoEscaneo, setEstadoEscaneo] = useState<'idle' | 'valid' | 'warning' | 'invalid' | 'entrada' | 'salida'>('idle');
  const [ultimoCodigo, setUltimoCodigo] = useState('');
  const [mensajeEscaneo, setMensajeEscaneo] = useState('Esperando QR');

  const canalRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    canalRef.current = crearCanalAsistencia();
    return () => canalRef.current?.close();
  }, []);

  useEffect(() => {
    assembliesApi.listar({ page: 1, limit: 100 })
      .then((response) => setReuniones(response.data.data.items.map(assemblyToReunion)))
      .catch((error) => console.error('Error al cargar asambleas:', error));
  }, []);

  const reunionActiva = useMemo(
    () => reuniones.find((r) => r.id === reunionActivaId) ?? null,
    [reuniones, reunionActivaId]
  );

  useEffect(() => {
    if (!reunionActivaId) return;
    assembliesApi.asistencias(reunionActivaId, { page: 1, limit: 100 })
      .then((response) => setAsistentes(response.data.data.items.map(attendanceToRegistro)))
      .catch((error) => console.error('Error al cargar asistencias:', error));
  }, [reunionActivaId]);

  useEffect(() => {
    guardarSnapshot({ reunionActiva, asistentes });
  }, [reunionActiva, asistentes]);

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

  const abrirReunionEspecifica = async (reunion: Reunion) => {
    await assembliesApi.abrirRegistro(reunion.id);
    const response = await assembliesApi.obtener(reunion.id);
    const actualizada = assemblyToReunion(response.data.data);
    setReuniones((prev) => prev.map((r) => (r.id === reunion.id ? actualizada : r)));
    setReunionActivaId(reunion.id);
    setReunionSeleccionadaId(null);
    setAsistentes([]);
    setComuneroSeleccionado(null);
    setSalidasHabilitadas(false);

    publicarEvento(canalRef.current, {
      tipo: 'reunion_abierta',
      timestamp: new Date().toISOString(),
      reunion: actualizada,
    });
  };

  const abrirReunion = () => {
    if (!reunionProxima) return;
    void abrirReunionEspecifica(reunionProxima).catch((error) => console.error('Error al abrir asamblea:', error));
  };

  useEffect(() => {
    const revisarHorario = () => {
      if (reunionActivaId) return;
      if (!reunionMasCercana) return;
      if (Date.now() >= fechaHoraTimestamp(reunionMasCercana)) {
        void abrirReunionEspecifica(reunionMasCercana).catch((error) => console.error('Error al abrir asamblea:', error));
      }
    };

    revisarHorario();
    const interval = setInterval(revisarHorario, INTERVALO_REVISION_MS);
    return () => clearInterval(interval);
  }, [reunionActivaId, reunionMasCercana?.id]);

  const confirmarCierre = async () => {
    if (!reunionActiva) return;
    await assembliesApi.cerrar(reunionActiva.id);

    publicarEvento(canalRef.current, {
      tipo: 'reunion_cerrada',
      timestamp: new Date().toISOString(),
      reunion: reunionActiva,
    });

    setNotificacionCierre(reunionActiva.nombre);
    setModalCerrar(false);
    setSalidasHabilitadas(true);
  };

  const seleccionarReunionDestacada = (reunionId: string) => {
    setReunionSeleccionadaId(reunionId);
  };

  const crearReunion = async (datos: { title: string; scheduledDate: string; type: 'ORDINARY' | 'EXTRAORDINARY'; agreements: string[] }) => {
    const response = await assembliesApi.crear(datos);
    setReuniones((prev) => [...prev, assemblyToReunion(response.data.data)]);
    setModalCrear(false);
  };

  const habilitarSalidas = async () => {
    if (!reunionActiva) return;
    await assembliesApi.bloquearRegistro(reunionActiva.id);
  };

  const simularEscaneo = async (codigoEscaneado?: string) => {
    if (!reunionActiva) return;

    const codigoIngresado = (codigoEscaneado ?? '').trim();
    setUltimoCodigo(codigoIngresado);
    try {
      const response = salidasHabilitadas
        ? await assembliesApi.salidaQr(reunionActiva.id, codigoIngresado)
        : await assembliesApi.entradaQr(reunionActiva.id, codigoIngresado);
      const registro = attendanceToRegistro(response.data.data, Date.now());
      setAsistentes((prev) => salidasHabilitadas
        ? prev.map((a) => a.comuneroId === registro.comuneroId ? { ...a, ...registro } : a)
        : [...prev, registro]);
      setComuneroSeleccionado(registro);
      setEstadoEscaneo(salidasHabilitadas ? 'salida' : 'entrada');
      setMensajeEscaneo(`${salidasHabilitadas ? 'Salida' : 'Entrada'} válida: ${registro.nombre}`);
      publicarEvento(canalRef.current, {
        tipo: salidasHabilitadas ? 'salida' : 'entrada',
        timestamp: new Date().toISOString(),
        reunion: reunionActiva,
        asistente: registro,
      });
      return;
    } catch (error) {
      setEstadoEscaneo('invalid');
      setMensajeEscaneo(error instanceof Error ? error.message : 'No se pudo registrar el QR');
      return;
    }
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
              estadoEscaneo={estadoEscaneo}
              ultimoCodigo={ultimoCodigo}
              mensajeEscaneo={mensajeEscaneo}
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
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

const obtenerMensajeApi = (error: unknown, fallback: string) => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const response = (error as {
      response?: { data?: { message?: string | string[]; error?: string } };
    }).response;
    const message = response?.data?.message ?? response?.data?.error;
    if (Array.isArray(message)) return message.join(', ');
    if (message) return message;
  }
  return error instanceof Error ? error.message : fallback;
};

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
  const [entradasCerradas, setEntradasCerradas] = useState(false);
  const [estadoEscaneo, setEstadoEscaneo] = useState<'idle' | 'valid' | 'warning' | 'invalid' | 'entrada' | 'salida'>('idle');
  const [ultimoCodigo, setUltimoCodigo] = useState('');
  const [mensajeEscaneo, setMensajeEscaneo] = useState('Esperando QR');

  const canalRef = useRef<BroadcastChannel | null>(null);
  const codigosEntradaRegistradosRef = useRef<Set<string>>(new Set());

  const reproducirSonido = (tipo: 'entrada' | 'salida' | 'duplicado') => {
    const AudioContextClass = window.AudioContext
      ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const configuracion = {
      entrada: { frecuencia: 880, duracion: 0.16 },
      salida: { frecuencia: 660, duracion: 0.2 },
      duplicado: { frecuencia: 220, duracion: 0.28 },
    }[tipo];

    oscillator.type = tipo === 'duplicado' ? 'sawtooth' : 'sine';
    oscillator.frequency.value = configuracion.frecuencia;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + configuracion.duracion);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + configuracion.duracion);
    oscillator.addEventListener('ended', () => void context.close());
  };

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
    setEntradasCerradas(false);
    codigosEntradaRegistradosRef.current.clear();

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
    publicarEvento(canalRef.current, {
      tipo: 'salidas_habilitadas',
      timestamp: new Date().toISOString(),
      reunion: reunionActiva,
    });

    setModalCerrar(false);
    setSalidasHabilitadas(true);
  };

  const seleccionarReunionDestacada = (reunionId: string) => {
    setReunionSeleccionadaId(reunionId);
  };

  const crearReunion = async (datos: { title: string; scheduledDate: string; type: 'ORDINARY' | 'EXTRAORDINARY'; agreements: string[] }) => {
    try {
      const response = await assembliesApi.crear(datos);
      setReuniones((prev) => [...prev, assemblyToReunion(response.data.data)]);
      setModalCrear(false);
    } catch (error) {
      const responseData = typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data
        : undefined;
      const message = responseData?.message ?? (error instanceof Error ? error.message : 'No se pudo crear la asamblea.');
      console.error('Error al crear asamblea:', error);
      window.alert(message);
    }
  };

  const habilitarSalidas = async () => {
    if (!reunionActiva) return;
    try {
      await assembliesApi.bloquearRegistro(reunionActiva.id);
      const response = await assembliesApi.obtener(reunionActiva.id);
      const actualizada = assemblyToReunion(response.data.data);
      if (response.data.data.status !== 'IN_PROGRESS') {
        window.alert(`El backend dejó la asamblea en estado ${response.data.data.status}. No se pueden habilitar las salidas.`);
        return;
      }
      setReuniones((prev) => prev.map((item) => item.id === actualizada.id ? actualizada : item));
      setEntradasCerradas(true);
    } catch (error) {
      const responseData = typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data
        : undefined;
      window.alert(responseData?.message ?? (error instanceof Error ? error.message : 'No se pudieron cerrar las entradas.'));
    }
  };

  const cancelarReunion = async () => {
    const reunion = reunionActiva ?? reunionProxima;
    if (!reunion || !window.confirm(`¿Cancelar la reunión "${reunion.nombre}"?`)) return;
    try {
      await assembliesApi.cancelar(reunion.id);
      setReuniones((prev) => prev.map((item) => item.id === reunion.id ? { ...item, estado: 'cancelada' } : item));
      if (reunionActiva?.id === reunion.id) {
        setReunionActivaId(null);
        setAsistentes([]);
        setComuneroSeleccionado(null);
      }
      setReunionSeleccionadaId(null);
    } catch (error) {
      const responseData = typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data
        : undefined;
      window.alert(responseData?.message ?? (error instanceof Error ? error.message : 'No se pudo cancelar la reunión.'));
    }
  };

  const cerrarReunion = async () => {
    if (!reunionActiva) return;
    try {
      await assembliesApi.cerrar(reunionActiva.id);
    } catch (error) {
      const responseData = typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data
        : undefined;
      window.alert(responseData?.message ?? (error instanceof Error ? error.message : 'No se pudo cerrar la reunión.'));
      return;
    }

    publicarEvento(canalRef.current, {
      tipo: 'reunion_cerrada',
      timestamp: new Date().toISOString(),
      reunion: reunionActiva,
    });
    setNotificacionCierre(reunionActiva.nombre);
    setReuniones((prev) => prev.map((item) => item.id === reunionActiva.id ? { ...item, estado: 'finalizada' } : item));
    setReunionActivaId(null);
    setReunionSeleccionadaId(null);
    setComuneroSeleccionado(null);
    setSalidasHabilitadas(false);
    setEntradasCerradas(false);
  };

  const simularEscaneo = async (codigoEscaneado?: string) => {
    if (!reunionActiva) return;

    const codigoIngresado = (codigoEscaneado ?? '').trim();
    setUltimoCodigo(codigoIngresado);

    if (!salidasHabilitadas && codigosEntradaRegistradosRef.current.has(codigoIngresado.toUpperCase())) {
      reproducirSonido('duplicado');
      setEstadoEscaneo('warning');
      setMensajeEscaneo('Este código ya registró su entrada en esta reunión.');
      return;
    }
    const codigoEntrada = codigoIngresado.toUpperCase();
    if (!salidasHabilitadas) {
      codigosEntradaRegistradosRef.current.add(codigoEntrada);
    }

    try {
      const response = salidasHabilitadas
        ? await assembliesApi.salidaQr(reunionActiva.id, codigoIngresado)
        : await assembliesApi.entradaQr(reunionActiva.id, codigoIngresado);
      const registro = attendanceToRegistro(response.data.data, Date.now());
      reproducirSonido(salidasHabilitadas ? 'salida' : 'entrada');
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
      reproducirSonido('duplicado');
      if (!salidasHabilitadas) {
        codigosEntradaRegistradosRef.current.delete(codigoEntrada);
      }
      setEstadoEscaneo('invalid');
      setMensajeEscaneo(obtenerMensajeApi(
        error,
        salidasHabilitadas ? 'No se pudo registrar la salida.' : 'No se pudo registrar la entrada.'
      ));
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
            entradasCerradas={entradasCerradas}
            salidasHabilitadas={salidasHabilitadas}
            onAbrirClick={abrirReunion}
            onCerrarEntradasClick={habilitarSalidas}
            onHabilitarSalidasClick={() => setModalCerrar(true)}
            onCerrarReunionClick={cerrarReunion}
            onCancelarClick={cancelarReunion}
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
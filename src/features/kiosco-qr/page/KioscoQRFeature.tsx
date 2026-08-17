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
import { reunionesMock } from '../mocks/reunionesMock';
import { comunerosMock } from '../mocks/comunerosMock';
import { Comunero } from '../../comuneros/types/types';
import { comunerosApi, resolverQrCode } from '../../comuneros/services/comunerosApi';
import { crearCanalAsistencia, publicarEvento, guardarSnapshot } from '../../bienvenida-comunero/model/asistenciaChannel';

const fechaHoraTimestamp = (r: Reunion) => new Date(`${r.fecha}T${r.horaInicio}`).getTime();

const INTERVALO_REVISION_MS = 15_000;

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
  const [comunerosRegistrados, setComunerosRegistrados] = useState<Comunero[]>([]);
  const [estadoEscaneo, setEstadoEscaneo] = useState<'idle' | 'valid' | 'warning' | 'invalid' | 'entrada' | 'salida'>('idle');
  const [ultimoCodigo, setUltimoCodigo] = useState('');
  const [mensajeEscaneo, setMensajeEscaneo] = useState('Esperando QR');

  const canalRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    canalRef.current = crearCanalAsistencia();
    return () => canalRef.current?.close();
  }, []);

  useEffect(() => {
    let activo = true;

    const cargarComuneros = async () => {
      try {
        const { comuneros } = await comunerosApi.listar(1, 500);
        if (activo) setComunerosRegistrados(comuneros);
      } catch (error) {
        console.error('Error al cargar comuneros para el kiosco QR:', error);
        if (activo) setComunerosRegistrados([]);
      }
    };

    cargarComuneros();
    return () => {
      activo = false;
    };
  }, []);

  const reunionActiva = useMemo(
    () => reuniones.find((r) => r.id === reunionActivaId) ?? null,
    [reuniones, reunionActivaId]
  );

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

  const abrirReunionEspecifica = (reunion: Reunion) => {
    setReuniones((prev) => prev.map((r) => (r.id === reunion.id ? { ...r, estado: 'en_curso' } : r)));
    setReunionActivaId(reunion.id);
    setReunionSeleccionadaId(null);
    setAsistentes([]);
    setComuneroSeleccionado(null);
    setSalidasHabilitadas(false);

    publicarEvento(canalRef.current, {
      tipo: 'reunion_abierta',
      timestamp: new Date().toISOString(),
      reunion: { ...reunion, estado: 'en_curso' },
    });
  };

  const abrirReunion = () => {
    if (!reunionProxima) return;
    abrirReunionEspecifica(reunionProxima);
  };

  useEffect(() => {
    const revisarHorario = () => {
      if (reunionActivaId) return;
      if (!reunionMasCercana) return;
      if (Date.now() >= fechaHoraTimestamp(reunionMasCercana)) {
        abrirReunionEspecifica(reunionMasCercana);
      }
    };

    revisarHorario();
    const interval = setInterval(revisarHorario, INTERVALO_REVISION_MS);
    return () => clearInterval(interval);
  }, [reunionActivaId, reunionMasCercana?.id]);

  const confirmarCierre = () => {
    if (!reunionActiva) return;

    publicarEvento(canalRef.current, {
      tipo: 'reunion_cerrada',
      timestamp: new Date().toISOString(),
      reunion: reunionActiva,
    });

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

  const simularEscaneo = (codigoEscaneado?: string) => {
    if (!reunionActiva) return;

    const codigoIngresado = (codigoEscaneado ?? '').trim();
    setUltimoCodigo(codigoIngresado);

    type ComuneroQrCandidate = Partial<Comunero> & {
      id: string;
      nombre?: string;
      apellidoPaterno?: string;
      fotografia?: string;
      folioComunero?: string;
      qrCode?: string;
    };

    const listaBase: ComuneroQrCandidate[] = (comunerosRegistrados.length > 0 ? comunerosRegistrados : (comunerosMock as unknown as ComuneroQrCandidate[]));
    const codigoNormalizado = codigoIngresado.toUpperCase();

    let comunero: ComuneroQrCandidate | null = null;

    if (codigoNormalizado) {
      comunero = listaBase.find((c) => {
        const qrEsperado = resolverQrCode(c.qrCode ?? undefined, `${c.id ?? ''}-${c.folioComunero ?? ''}`);
        return qrEsperado.toUpperCase() === codigoNormalizado;
      }) ?? null;
    }

    if (!comunero && !codigoEscaneado) {
      comunero = listaBase.find((c) => (c.qrCode ?? '').trim()) ?? null;
    }

    if (!comunero) {
      setEstadoEscaneo('invalid');
      setMensajeEscaneo(`QR no registrado: ${codigoIngresado || 'sin código'}`);
      return;
    }

    const historial = asistentes.filter((a) => a.comuneroId === comunero.id);
    const registroActivo = historial.find((a) => !a.horaSalida);
    const ultimoRegistro = historial[historial.length - 1];
    const nombreComunero = `${comunero.nombre ?? ''} ${comunero.apellidoPaterno ?? ''}`.trim();
    setEstadoEscaneo('valid');

    if (salidasHabilitadas) {
      if (registroActivo) {
        const actualizado: AsistenteRegistro = { ...registroActivo, horaSalida: new Date().toISOString() };
        setAsistentes((prev) => prev.map((a) => (a.id === actualizado.id ? actualizado : a)));
        setComuneroSeleccionado(actualizado);
        setEstadoEscaneo('salida');
        setMensajeEscaneo(`Salida válida: ${nombreComunero}`);

        publicarEvento(canalRef.current, {
          tipo: 'salida',
          timestamp: actualizado.horaSalida!,
          reunion: reunionActiva,
          asistente: actualizado,
        });
        return;
      }

      if (ultimoRegistro && ultimoRegistro.horaSalida) {
        setComuneroSeleccionado(ultimoRegistro);
        setEstadoEscaneo('invalid');
        setMensajeEscaneo(`Código ya registrado: ${nombreComunero} ya registró su entrada y salida.`);
        return;
      }

      const nuevoRegistro: AsistenteRegistro = {
        id: `${comunero.id}-${Date.now()}`,
        comuneroId: comunero.id,
        nombre: nombreComunero,
        folio: comunero.folioComunero ?? comunero.id,
        fotografia: comunero.fotografia ?? '',
        horaEntrada: new Date().toISOString(),
      };
      setAsistentes((prev) => [...prev, nuevoRegistro]);
      setComuneroSeleccionado(nuevoRegistro);
      setEstadoEscaneo('entrada');
      setMensajeEscaneo(`Entrada válida: ${nombreComunero}`);

      publicarEvento(canalRef.current, {
        tipo: 'entrada',
        timestamp: nuevoRegistro.horaEntrada,
        reunion: reunionActiva,
        asistente: nuevoRegistro,
      });
      return;
    }

    if (registroActivo) {
      setComuneroSeleccionado(registroActivo);
      setEstadoEscaneo('warning');
      setMensajeEscaneo(`Código ya ingresado: ${nombreComunero} ya está registrado.`);
      return;
    }

    if (ultimoRegistro && ultimoRegistro.horaSalida) {
      setComuneroSeleccionado(ultimoRegistro);
      setEstadoEscaneo('invalid');
      setMensajeEscaneo(`Código ya registrado: ${nombreComunero} ya ingresó y salió.`);
      return;
    }

    const nuevoRegistro: AsistenteRegistro = {
      id: `${comunero.id}-${Date.now()}`,
      comuneroId: comunero.id,
      nombre: nombreComunero,
      folio: comunero.folioComunero ?? comunero.id,
      fotografia: comunero.fotografia ?? '',
      horaEntrada: new Date().toISOString(),
    };
    setAsistentes((prev) => [...prev, nuevoRegistro]);
    setComuneroSeleccionado(nuevoRegistro);
    setEstadoEscaneo('entrada');
    setMensajeEscaneo(`Entrada válida: ${nombreComunero}`);

    publicarEvento(canalRef.current, {
      tipo: 'entrada',
      timestamp: nuevoRegistro.horaEntrada,
      reunion: reunionActiva,
      asistente: nuevoRegistro,
    });
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
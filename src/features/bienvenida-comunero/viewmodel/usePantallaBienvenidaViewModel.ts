"use client";

import { useEffect, useState } from 'react';
import { Reunion, AsistenteRegistro } from '../../kiosco-qr/types/types';
import { EventoAsistencia } from '../model/types';
import { assembliesApi, assemblyToReunion, attendanceToRegistro } from '../../kiosco-qr/services/assembliesApi';
import { CANAL_ASISTENCIA } from '../model/asistenciaChannel';

const MAX_HISTORIAL = 8;

export interface PantallaBienvenidaState {
  reunionActiva: Reunion | null;
  totalAsistentes: number;
  eventoDestacado: EventoAsistencia | null;
  historial: EventoAsistencia[];
  conectado: boolean;
}

export function usePantallaBienvenidaViewModel(): PantallaBienvenidaState {
  const [reunionActiva, setReunionActiva] = useState<Reunion | null>(null);
  const [asistentes, setAsistentes] = useState<AsistenteRegistro[]>([]);
  const [eventoDestacado, setEventoDestacado] = useState<EventoAsistencia | null>(null);
  const [historial, setHistorial] = useState<EventoAsistencia[]>([]);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    let cancelado = false;
    window.localStorage.removeItem('kiosco-asistencia:snapshot');
    const canal = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CANAL_ASISTENCIA);
    setConectado(!!canal);

    if (canal) {
      canal.onmessage = (mensaje: MessageEvent<EventoAsistencia>) => {
        const data = mensaje.data;

        if (data.tipo === 'reunion_abierta') {
          setReunionActiva(data.reunion);
          setAsistentes([]);
          setHistorial([]);
          setEventoDestacado(null);
          return;
        }

        if (data.tipo === 'reunion_cerrada') {
          setReunionActiva(null);
          setAsistentes([]);
          setEventoDestacado(null);
          return;
        }

        if (data.tipo === 'entrada' && data.asistente) {
          setAsistentes((prev) => [...prev, data.asistente as AsistenteRegistro]);
        }

        if (data.tipo === 'salida' && data.asistente) {
          const asistenteActualizado = data.asistente;
          setAsistentes((prev) => prev.map((a) => (a.id === asistenteActualizado.id ? asistenteActualizado : a)));
        }

        setEventoDestacado(data);
        setHistorial((prev) => [data, ...prev].slice(0, MAX_HISTORIAL));
      };
    }

    void assembliesApi.listar({ page: 1, limit: 100 })
      .then(async (response) => {
        const activa = response.data.data.items.find((assembly) =>
          ['REGISTRATION_OPEN', 'IN_PROGRESS', 'EXITS_OPEN'].includes(assembly.status)
        );
        if (!activa || cancelado) return;
        setReunionActiva(assemblyToReunion(activa));
        const asistencias = await assembliesApi.asistencias(activa.id, { page: 1, limit: 100 });
        if (cancelado) return;
        setAsistentes(asistencias.data.data.items.map((attendance, index) => attendanceToRegistro(attendance, index)));
      })
      .catch((error) => console.error('Error al cargar la reunión activa de bienvenida:', error));

    return () => {
      cancelado = true;
      canal?.close();
    };
  }, []);

  return {
    reunionActiva,
    totalAsistentes: asistentes.length,
    eventoDestacado,
    historial,
    conectado,
  };
}
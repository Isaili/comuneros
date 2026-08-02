"use client";

import { useEffect, useRef, useState } from 'react';
import { Reunion, AsistenteRegistro } from '../../kiosco-qr/types/types';
import { EventoAsistencia } from '../model/types';
import { CANAL_ASISTENCIA, leerSnapshot } from '../model/asistenciaChannel';

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
    const snapshot = leerSnapshot();
    if (snapshot) {
      setReunionActiva(snapshot.reunionActiva);
      setAsistentes(snapshot.asistentes);
    }

    if (typeof BroadcastChannel === 'undefined') {
      setConectado(false);
      return;
    }

    const canal = new BroadcastChannel(CANAL_ASISTENCIA);
    setConectado(true);

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

    return () => {
      canal.close();
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
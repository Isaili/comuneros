"use client";

import React, { useState } from 'react';
import { ConfiguracionHeader } from '../components/ConfiguracionHeader';
import { ConfiguracionCards } from '../components/ConfiguracionCards';
import { HistorialCambiosList } from '../components/HistorialCambiosList';
import { MOCK_CONFIGURACION, MOCK_HISTORIAL } from '../mocks/configuracion.mock';
import { ConfiguracionSistema, RegistroHistorial } from '../types/configuracion';

const STORAGE_KEY = 'configuracionSistema';
const HISTORIAL_KEY = 'configuracionHistorial';

const formatearValor = (campo: keyof ConfiguracionSistema, valor: number) => {
  if (campo === 'tiempoToleranciaDias') {
    return `${valor} días`;
  }

  return `$${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const normalizarHistorial = (historial: RegistroHistorial[]): RegistroHistorial[] => {
  const idsVistos = new Set<string>();

  return historial.map((registro, index) => {
    let id = registro.id?.trim();

    if (!id || idsVistos.has(id)) {
      id = `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`;
    }

    idsVistos.add(id);

    return { ...registro, id };
  });
};

export default function ConfiguracionPage() {
  const getStoredConfig = (): ConfiguracionSistema => {
    if (typeof window === 'undefined') return MOCK_CONFIGURACION;

    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) as ConfiguracionSistema : MOCK_CONFIGURACION;
  };

  const getStoredHistorial = (): RegistroHistorial[] => {
    if (typeof window === 'undefined') return MOCK_HISTORIAL;

    const stored = localStorage.getItem(HISTORIAL_KEY);
    if (!stored) return MOCK_HISTORIAL;

    const historialParseado = JSON.parse(stored) as RegistroHistorial[];
    return normalizarHistorial(Array.isArray(historialParseado) ? historialParseado : MOCK_HISTORIAL);
  };

  const [config, setConfig] = useState<ConfiguracionSistema>(() => getStoredConfig());
  const [historial, setHistorial] = useState<RegistroHistorial[]>(() => getStoredHistorial());

  const handleGuardarCambio = (campo: keyof ConfiguracionSistema, nuevoValor: number) => {
    setConfig((prev) => {
      const valorAnterior = formatearValor(campo, prev[campo]);
      const valorNuevo = formatearValor(campo, nuevoValor);
      const nombreCampo: Record<keyof ConfiguracionSistema, string> = {
        precioHectarea: 'Precio de predial por hectárea',
        precioLote: 'Precio de predial por lote',
        valorMultas: 'Valor de las multas',
        tiempoToleranciaDias: 'Tiempo de tolerancia',
      };

      const siguienteConfig = { ...prev, [campo]: nuevoValor };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siguienteConfig));

      const fechaActual = new Date().toLocaleString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      const nuevoRegistro: RegistroHistorial = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        usuarioNombre: 'Administrador',
        usuarioEmail: 'admin@comisaria.gob.mx',
        usuarioIniciales: 'AD',
        configuracionNombre: nombreCampo[campo],
        valorAnterior,
        valorNuevo,
        fecha: fechaActual,
      };

      setHistorial((prevHistorial) => {
        const siguienteHistorial = normalizarHistorial([nuevoRegistro, ...prevHistorial]);
        localStorage.setItem(HISTORIAL_KEY, JSON.stringify(siguienteHistorial));
        return siguienteHistorial;
      });

      return siguienteConfig;
    });
  };

  return (
    <main className="min-h-screen w-full bg-[#f8fafc] px-3 py-4 sm:px-5 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 sm:gap-6">
        <ConfiguracionHeader />
        <ConfiguracionCards
          configuracionInicial={config}
          onGuardar={handleGuardarCambio}
        />
        <HistorialCambiosList historial={historial} />
      </div>
    </main>
  );
}
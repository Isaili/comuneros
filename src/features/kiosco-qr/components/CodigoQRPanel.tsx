"use client";

import React, { useEffect, useState } from 'react';
import { QrCode, RefreshCcw, Smartphone } from 'lucide-react';

interface CodigoQRPanelProps {
  activo: boolean;
  reunionId?: string;
  onSimularEscaneo: () => void;
}

const INTERVALO_ROTACION = 20; 

export const CodigoQRPanel: React.FC<CodigoQRPanelProps> = ({ activo, reunionId, onSimularEscaneo }) => {
  const [token, setToken] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(INTERVALO_ROTACION);

  useEffect(() => {
    if (!activo) return;

    setToken(Date.now());
    setSegundosRestantes(INTERVALO_ROTACION);

    const rotacion = setInterval(() => {
      setToken(Date.now());
      setSegundosRestantes(INTERVALO_ROTACION);
    }, INTERVALO_ROTACION * 1000);

    const countdown = setInterval(() => {
      setSegundosRestantes((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(rotacion);
      clearInterval(countdown);
    };
  }, [activo]);

  const payload = encodeURIComponent(`asistencia://reunion/${reunionId ?? 'sin-reunion'}?token=${token}`);
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&data=${payload}`;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
          <QrCode className="w-4 h-4 text-gray-500" /> Código de acceso
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
            activo ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activo ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
          {activo ? 'Activo' : 'En espera'}
        </span>
      </div>

      <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center">
        {activo ? (
          <img
            key={token}
            src={qrSrc}
            alt="Código QR de asistencia"
            className="w-[80%] h-[80%] object-contain bg-white rounded-xl p-3 animate-fade-in"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400 px-6 text-center">
            <QrCode className="w-8 h-8" />
            <p className="text-xs font-semibold">Abre una reunión para mostrar el código QR</p>
          </div>
        )}
      </div>

      {activo && (
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 mt-3">
          <RefreshCcw className="w-3 h-3" /> El código se renueva en {segundosRestantes}s
        </div>
      )}

      <p className="text-[11px] text-gray-400 font-medium mt-3 text-center max-w-xs flex items-center justify-center gap-1.5">
        {activo ? (
          <>
            <Smartphone className="w-3.5 h-3.5 shrink-0" /> Escanea este código con tu teléfono para registrar tu entrada o salida.
          </>
        ) : (
          'El código se mostrará automáticamente cuando la reunión esté abierta.'
        )}
      </p>

      {activo && (
        <button
          onClick={onSimularEscaneo}
          className="mt-4 w-full max-w-xs flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5" /> Simular escaneo desde celular (demo)
        </button>
      )}
    </div>
  );
};
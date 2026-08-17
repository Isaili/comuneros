"use client";

import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { ScanLine, Camera, QrCode, CameraOff, Smartphone, LogIn, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface EscanerQrPanelProps {
  activo: boolean;
  reunionId?: string;
  salidasHabilitadas: boolean;
  estadoEscaneo?: 'idle' | 'valid' | 'warning' | 'invalid' | 'entrada' | 'salida';
  ultimoCodigo?: string;
  mensajeEscaneo?: string;
  onSimularEscaneo: (codigoEscaneado?: string) => void;
}

export const EscanerQrPanel: React.FC<EscanerQrPanelProps> = ({
  activo,
  reunionId,
  salidasHabilitadas,
  estadoEscaneo = 'idle',
  ultimoCodigo = '',
  mensajeEscaneo = 'Esperando QR',
  onSimularEscaneo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ultimoCodigoRef = useRef<string | null>(null);
  const [errorCamara, setErrorCamara] = useState<string | null>(null);
  const [camaraLista, setCamaraLista] = useState(false);
  const [codigoManual, setCodigoManual] = useState('');

  const estadoMeta = {
    idle: { label: 'Esperando', color: 'bg-slate-100 text-slate-600 border-slate-200', icon: QrCode },
    valid: { label: 'QR válido', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    warning: { label: 'Ya ingresado', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: AlertTriangle },
    invalid: { label: 'QR no válido', color: 'bg-red-50 text-red-700 border-red-200', icon: XCircle },
    entrada: { label: 'Entrada válida', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
    salida: { label: 'Salida válida', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: CheckCircle2 },
  }[estadoEscaneo];

  const StatusIcon = estadoMeta.icon;

  useEffect(() => {
    if (!activo) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCamaraLista(false);
      ultimoCodigoRef.current = null;
      return;
    }

    let cancelado = false;

    const iniciarCamara = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (cancelado) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setCamaraLista(true);
        setErrorCamara(null);
      } catch (err) {
        setErrorCamara('No se pudo acceder a la cámara. Revisa los permisos del navegador.');
        setCamaraLista(false);
      }
    };

    iniciarCamara();

    return () => {
      cancelado = true;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [activo]);

  useEffect(() => {
    if (!activo || !camaraLista || !videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) return;

    canvasRef.current = canvas;

    let rafId = 0;
    let lastScanAt = 0;

    const escanear = () => {
      if (!video.videoWidth || !video.videoHeight) {
        rafId = requestAnimationFrame(escanear);
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code?.data) {
        const codigo = code.data.trim();
        const ahora = Date.now();

        if (codigo && codigo !== ultimoCodigoRef.current && ahora - lastScanAt > 1500) {
          ultimoCodigoRef.current = codigo;
          lastScanAt = ahora;
          setCodigoManual(codigo);
          onSimularEscaneo(codigo);
        }
      }

      rafId = requestAnimationFrame(escanear);
    };

    rafId = requestAnimationFrame(escanear);

    return () => {
      cancelAnimationFrame(rafId);
      ultimoCodigoRef.current = null;
    };
  }, [activo, camaraLista, onSimularEscaneo]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
          <ScanLine className="w-4 h-4 text-gray-500" /> Escáner de asistencia
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
            activo && camaraLista ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${activo && camaraLista ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
          {activo && camaraLista ? 'Escaneando' : activo ? 'Activando cámara…' : 'En espera'}
        </span>
      </div>

      <div className={`w-full mb-4 rounded-xl border px-3 py-2 text-left ${estadoMeta.color}`}>
        <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em]">
          <StatusIcon className="w-3.5 h-3.5" />
          {estadoMeta.label}
        </div>
        <p className="mt-1 text-[11px] font-semibold break-all">
          {ultimoCodigo ? `Código: ${ultimoCodigo}` : 'Sin código leído'}
        </p>
        <p className="mt-1 text-[11px] font-medium">{mensajeEscaneo}</p>
      </div>

      <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden bg-gray-900 flex items-center justify-center">
        {activo ? (
          <>
            <video
              ref={videoRef}
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover ${camaraLista ? 'opacity-100' : 'opacity-0'}`}
            />

            {errorCamara && (
              <div className="relative z-10 flex flex-col items-center gap-2 text-red-300 px-6 text-center">
                <CameraOff className="w-8 h-8" />
                <p className="text-xs font-semibold">{errorCamara}</p>
              </div>
            )}

            {camaraLista && (
              <div className="relative z-10 w-[70%] h-[70%]">
                <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-lg" />
                <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-lg" />
                <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-lg" />
                <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-lg" />
                <div className="absolute inset-x-0 h-0.5 bg-emerald-400/90 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)] animate-scan-line" />
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400 px-6 text-center">
            <Camera className="w-8 h-8" />
            <p className="text-xs font-semibold">Abre una reunión para activar el escáner</p>
          </div>
        )}
      </div>

      <p className="text-[11px] text-gray-400 font-medium mt-3 text-center max-w-xs flex items-center justify-center gap-1.5">
        {activo ? (
          salidasHabilitadas ? (
            <>
              <Smartphone className="w-3.5 h-3.5 shrink-0" /> Escanea tu código para registrar tu salida.
            </>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5 shrink-0" /> Escanea tu código para registrar tu entrada.
            </>
          )
        ) : (
          'El escáner se activará automáticamente cuando la reunión esté abierta.'
        )}
      </p>

      {activo && (
        <div className="mt-4 w-full max-w-xs space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
            Código QR a validar
          </label>
          <input
            value={codigoManual}
            onChange={(e) => setCodigoManual(e.target.value)}
            placeholder="Ej. COM-ABC123"
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-700 text-xs font-semibold outline-none focus:border-[#1E4D3A]"
          />
          <button
            onClick={() => onSimularEscaneo(codigoManual.trim() || undefined)}
            className="w-full flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors"
          >
            {salidasHabilitadas ? (
              <>
                <Smartphone className="w-3.5 h-3.5" /> Simular escaneo (entrada o salida)
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" /> Simular escaneo (solo entrada)
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
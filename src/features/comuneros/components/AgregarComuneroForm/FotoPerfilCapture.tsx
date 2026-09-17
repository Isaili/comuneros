import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { User, Camera, Upload, RotateCcw } from 'lucide-react';

interface FotoPerfilCaptureProps {
  value: string | null;
  required?: boolean;
  onCapture: (file: File | Blob, previewUrl: string) => void;
  onRemove: () => void;
}

export interface FotoPerfilCaptureHandle {
  /** Detiene la cámara si está activa. Llamar al cerrar el modal/formulario padre. */
  stopCamera: () => void;
}

const TARGET_WIDTH = 400;
const TARGET_HEIGHT = 400;

export const FotoPerfilCapture = forwardRef<FotoPerfilCaptureHandle, FotoPerfilCaptureProps>(
  ({ value, required, onCapture, onRemove }, ref) => {
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const stopCamera = () => {
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsCameraActive(false);
    };

    useImperativeHandle(ref, () => ({ stopCamera }));

    const startCamera = async () => {
      setIsCameraActive(true);

      // Verificación explícita de contexto seguro (necesario en Safari/iOS)
      if (!window.isSecureContext) {
        alert('La cámara requiere HTTPS o localhost. Este sitio no está en un contexto seguro.');
        setIsCameraActive(false);
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        alert('Este navegador no soporta acceso a la cámara.');
        setIsCameraActive(false);
        return;
      }

      try {
        // Constraints relajados: facingMode como "ideal" en vez de exacto,
        // sin width/height forzados (Safari es más estricto con constraints exactos)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'user' } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err: any) {
        console.error('Error de cámara:', err?.name, err?.message, err);

        if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
          alert('Permiso de cámara denegado. Revisa los permisos del sitio en Ajustes/Configuración del navegador.');
        } else if (err?.name === 'NotFoundError' || err?.name === 'DevicesNotFoundError') {
          alert('No se encontró ninguna cámara disponible en este dispositivo.');
        } else if (err?.name === 'NotReadableError' || err?.name === 'TrackStartError') {
          alert('La cámara ya está siendo usada por otra aplicación o pestaña.');
        } else if (err?.name === 'OverconstrainedError') {
          alert('La cámara no soporta la configuración solicitada.');
        } else if (err?.name === 'SecurityError') {
          alert('Acceso a la cámara bloqueado por política de seguridad del sitio (revisa Permissions-Policy / si está en un iframe).');
        } else {
          alert(`No se pudo acceder a la cámara: ${err?.message || err?.name || 'error desconocido'}`);
        }
        setIsCameraActive(false);
      }
    };

    const capturePhoto = () => {
      if (!videoRef.current) return;
      const video = videoRef.current;

      const canvas = document.createElement('canvas');
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
        const previewUrl = canvas.toDataURL('image/jpeg', 0.75);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], `foto-camara-${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              onCapture(file, previewUrl);
            }
          },
          'image/jpeg',
          0.75
        );

        stopCamera();
      }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => onCapture(file, reader.result as string);
      reader.readAsDataURL(file);
    };

    return (
      <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
        <h4 className="text-gray-500 font-bold self-start">
          Fotografía de Perfil {required && <span className="text-red-500">*</span>}
        </h4>
        <div className="relative w-28 h-28 rounded-full border-2 border-[#006837]/20 bg-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
          {isCameraActive ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
          ) : value ? (
            <img src={value} alt="Foto" className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {isCameraActive ? (
            <>
              <button type="button" onClick={capturePhoto} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" /> Capturar
              </button>
              <button type="button" onClick={stopCamera} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg font-bold">
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={startCamera} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1">
                <Camera className="w-3.5 h-3.5" /> Usar Cámara
              </button>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-bold flex items-center gap-1">
                <Upload className="w-3.5 h-3.5 text-gray-400" /> Subir Archivo
              </button>
              {value && (
                <button type="button" onClick={onRemove} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
      </div>
    );
  }
);

FotoPerfilCapture.displayName = 'FotoPerfilCapture';

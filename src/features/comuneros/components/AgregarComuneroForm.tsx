"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, Calendar, MapPin, Phone, X, Save, Camera, Upload, RotateCcw } from 'lucide-react';
import * as Yup from 'yup';
import { Comunero } from '../types/types'; 

interface AgregarComuneroFormProps {
  onClose: () => void;
  onGuardar: (nuevoComunero: any) => void;
  comuneroAEditar?: Comunero | null; 
}

const comuneroValidationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre es obligatorio'),
  apellidos: Yup.string()
    .min(3, 'Los apellidos deben tener al menos 3 caracteres')
    .required('Los apellidos son obligatorios'),
  fechaNacimiento: Yup.string() 
    .required('La fecha de nacimiento es obligatoria'),
  fechaIngreso: Yup.string()
    .required('La fecha de ingreso es obligatoria'),
  direccion: Yup.string().optional(),
  colonia: Yup.string().required('La colonia o barrio es obligatoria'),
  telefono: Yup.string()
    .matches(/^[0-9]{10}$/, 'El teléfono debe tener exactamente 10 dígitos numéricos')
    .optional()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  tipoComunero: Yup.string()
    .oneOf(['comunero', 'avecindado'], 'Selecciona un tipo de miembro válido')
    .required('El tipo de miembro es obligatorio'),
});

export const AgregarComuneroForm: React.FC<AgregarComuneroFormProps> = ({
  onClose,
  onGuardar,
  comuneroAEditar = null
}) => {
  const esEdicion = !!comuneroAEditar;

  const formatearFechaParaInput = (fechaStr: string | undefined): string => {
    if (!fechaStr) return '';
    if (fechaStr.includes('-')) return fechaStr;
    const partes = fechaStr.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    }
    return '';
  };

  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    fechaIngreso: '',
    direccion: '',
    colonia: '',
    telefono: '',
    tipoComunero: 'comunero',
  });

  const [fotografia, setFotografia] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (comuneroAEditar) {
      setFormData({
        nombre: comuneroAEditar.nombre,
        apellidos: comuneroAEditar.apellidos,
        fechaNacimiento: formatearFechaParaInput(comuneroAEditar.fechaNacimiento),
        fechaIngreso: formatearFechaParaInput(comuneroAEditar.fechaRegistro || comuneroAEditar.fechaNacimiento),
        direccion: comuneroAEditar.direccion || '',
        colonia: comuneroAEditar.colonia || '',
        telefono: comuneroAEditar.telefono || '',
        tipoComunero: comuneroAEditar.tipo || 'comunero',
      });
      if (comuneroAEditar.fotografia) {
        setFotografia(comuneroAEditar.fotografia);
      }
    }
  }, [comuneroAEditar]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    setFotografia(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 320 },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo acceder a la cámara.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setFotografia(dataUrl);
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotografia(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await comuneroValidationSchema.validate(formData, { abortEarly: false });

      setIsSubmitting(true);

      onGuardar({
        id: comuneroAEditar?.id,
        ...formData,
        fotografia: fotografia || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200'
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-scale-up"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
              <span className="p-1.5 bg-[#006837]/10 text-[#006837] rounded-lg">
                <User className="w-4 h-4" />
              </span>
              {esEdicion ? 'Editar Expediente de Miembro' : 'Registrar Nuevo Miembro'}
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
              {esEdicion ? 'Modifica los campos del padrón que requieran actualización.' : 'Ingresa los datos y sube o toma la foto de perfil del comunero.'}
            </p>
          </div>
          <button 
            type="button"
            onClick={() => { stopCamera(); onClose(); }} 
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-gray-700 font-semibold text-xs">
          
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
            <h4 className="text-gray-500 font-bold self-start">Fotografía de Perfil</h4>
            
            <div className="relative w-28 h-28 rounded-full border-2 border-[#006837]/20 bg-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
              {isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
              ) : fotografia ? (
                <img src={fotografia} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>

            <div className="flex items-center gap-2">
              {isCameraActive ? (
                <>
                  <button type="button" onClick={capturePhoto} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-sm"><Camera className="w-3.5 h-3.5" /> Capturar</button>
                  <button type="button" onClick={stopCamera} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg font-bold">Cancelar</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={startCamera} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1"><Camera className="w-3.5 h-3.5" /> Usar Cámara</button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-bold flex items-center gap-1"><Upload className="w-3.5 h-3.5 text-gray-400" /> Subir Archivo</button>
                  {fotografia && <button type="button" onClick={() => setFotografia(null)} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"><RotateCcw className="w-3.5 h-3.5" /></button>}
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Nombre(s) <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Carlos"
                className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.nombre ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.nombre && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.nombre}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Apellidos <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Ej. Pérez Gómez"
                className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition-all ${errors.apellidos ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.apellidos && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.apellidos}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Fecha de Nacimiento <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 border rounded-xl ${errors.fechaNacimiento ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.fechaNacimiento && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.fechaNacimiento}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Fecha de Ingreso al Ejido <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="fechaIngreso"
                value={formData.fechaIngreso}
                onChange={handleChange}
                className={`w-full px-3 py-2.5 border rounded-xl ${errors.fechaIngreso ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.fechaIngreso && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.fechaIngreso}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                placeholder="Ej. Av. Central #45"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Colonia o Barrio <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="colonia"
                value={formData.colonia}
                onChange={handleChange}
                placeholder="Ej. Barrio Centro"
                className={`w-full px-3 py-2.5 border rounded-xl ${errors.colonia ? 'border-red-500' : 'border-gray-200'}`}
              />
              {errors.colonia && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.colonia}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-gray-500 font-bold block">Teléfono de Contacto</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej. 961 123 4567"
              className={`w-full px-3 py-2.5 border rounded-xl ${errors.telefono ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.telefono && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.telefono}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-gray-500 font-bold block">Tipo de Miembro <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`border rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all ${formData.tipoComunero === 'comunero' ? 'border-[#006837] bg-[#006837]/5 text-[#006837]' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="tipoComunero" value="comunero" checked={formData.tipoComunero === 'comunero'} onChange={handleChange} className="sr-only" />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${formData.tipoComunero === 'comunero' ? 'border-[#006837]' : 'border-gray-300'}`}>{formData.tipoComunero === 'comunero' && <div className="w-2 h-2 rounded-full bg-[#006837]" />}</div>
                <div className="min-w-0">
                  <p className="font-bold text-xs">Comunero</p>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Derechos de tierra</p>
                </div>
              </label>

              <label className={`border rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all ${formData.tipoComunero === 'avecindado' ? 'border-emerald-600 bg-emerald-50/25 text-emerald-800' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="tipoComunero" value="avecindado" checked={formData.tipoComunero === 'avecindado'} onChange={handleChange} className="sr-only" />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${formData.tipoComunero === 'avecindado' ? 'border-emerald-600' : 'border-gray-300'}`}>{formData.tipoComunero === 'avecindado' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}</div>
                <div className="min-w-0">
                  <p className="font-bold text-xs">Avecindado</p>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Residente sin título</p>
                </div>
              </label>
            </div>
            {errors.tipoComunero && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.tipoComunero}</p>}
          </div>

        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col-reverse sm:flex-row items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => { stopCamera(); onClose(); }}
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Guardando...' : esEdicion ? 'Actualizar Cambios' : 'Guardar Registro'}
          </button>
        </div>

      </form>
    </div>
  );
};
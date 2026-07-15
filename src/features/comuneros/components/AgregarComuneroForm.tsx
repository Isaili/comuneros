"use client";

import React, { useState, useRef } from 'react';
import { User, Calendar, MapPin, Phone, Mail, X, Save, Camera, Upload, RotateCcw } from 'lucide-react';
import * as Yup from 'yup';

interface AgregarComuneroFormProps {
  onClose: () => void;
  onGuardar: (nuevoComunero: any) => void;
}

const comuneroValidationSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('El nombre es obligatorio'),
  apellidos: Yup.string()
    .min(3, 'Los apellidos deben tener al menos 3 caracteres')
    .required('Los apellidos son obligatorios'),
  fechaNacimiento: Yup.date()
    .max(new Date(), 'La fecha de nacimiento no puede ser en el futuro')
    .required('La fecha de nacimiento es obligatoria'),
  fechaIngreso: Yup.date()
    .max(new Date(), 'La fecha de ingreso no puede ser en el futuro')
    .required('La fecha de ingreso es obligatoria'),
  direccion: Yup.string().optional(),
  colonia: Yup.string().required('La colonia o barrio es obligatoria'),
  telefono: Yup.string()
    .matches(/^[0-9]{10}$/, 'El teléfono debe tener exactamente 10 dígitos numéricos')
    .optional()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  correo: Yup.string()
    .email('Ingresa un correo electrónico válido')
    .optional()
    .nullable()
    .transform((value, originalValue) => (originalValue === '' ? null : value)),
  tipoComunero: Yup.string()
    .oneOf(['comunero', 'avecindado'], 'Selecciona un tipo de miembro válido')
    .required('El tipo de miembro es obligatorio'),
});

export const AgregarComuneroForm: React.FC<AgregarComuneroFormProps> = ({
  onClose,
  onGuardar
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    fechaNacimiento: '',
    fechaIngreso: '',
    direccion: '',
    colonia: '',
    telefono: '',
    correo: '',
    tipoComunero: 'comunero',
  });

  // Estados de Imagen y Cámara
  const [fotografia, setFotografia] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Referencias para la cámara en vivo
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 1. Activar la Cámara en Vivo
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
      console.error("Error al acceder a la cámara:", err);
      alert("No se pudo acceder a la cámara. Asegúrate de dar los permisos necesarios.");
      setIsCameraActive(false);
    }
  };

  // 2. Tomar la Foto (Capturar Frame del Video)
  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Dibujamos el frame del video en un canvas temporal
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Convertimos a URL Base64 para guardarlo en memoria
        const dataUrl = canvas.toDataURL('image/jpeg');
        setFotografia(dataUrl);
        stopCamera();
      }
    }
  };

  // 3. Apagar Cámara
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // 4. Manejar Subida de Archivos desde Disco
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotografia(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await comuneroValidationSchema.validate(formData, { abortEarly: false });
      
      // Enviamos el objeto con la propiedad fotografía añadida (ya sea Base64 o null)
      onGuardar({
        id: Date.now().toString(),
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
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-0 sm:p-4">
      <form 
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-[90vh] animate-scale-up"
      >
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
              <span className="p-1.5 bg-[#006837]/10 text-[#006837] rounded-lg">
                <User className="w-4 h-4" />
              </span>
              Registrar Nuevo Miembro
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
              Ingresa los datos y sube o toma la foto de perfil del comunero.
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

        {/* Cuerpo del Formulario */}
        <div className="p-5 overflow-y-auto space-y-4 text-gray-700 font-semibold text-xs">
          
          {/* SECCIÓN DE FOTOGRAFÍA / CÁMARA */}
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
            <h4 className="text-gray-500 font-bold self-start">Fotografía de Perfil</h4>
            
            <div className="relative w-28 h-28 rounded-full border-2 border-[#006837]/20 bg-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
              {isCameraActive ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover scale-x-[-1]" // Efecto espejo para comodidad del usuario
                />
              ) : fotografia ? (
                <img 
                  src={fotografia} 
                  alt="Foto de perfil cargada" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Controles de cámara / archivo */}
            <div className="flex items-center gap-2">
              {isCameraActive ? (
                <>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5" /> Capturar
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg font-bold"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={startCamera}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" /> Usar Cámara
                  </button>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-gray-400" /> Subir Archivo
                  </button>
                  {fotografia && (
                    <button
                      type="button"
                      onClick={() => setFotografia(null)}
                      className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"
                      title="Quitar foto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Input oculto para carga desde disco */}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden"
            />
          </div>

          {/* Fila 1: Nombre y Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Nombre(s) <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej. Juan Carlos"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-gray-700 font-semibold focus:outline-none focus:ring-2 transition-all ${
                    errors.nombre ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-[#006837]/20 focus:border-[#006837]'
                  }`}
                />
              </div>
              {errors.nombre && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.nombre}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Apellidos <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  placeholder="Ej. Pérez Gómez"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-gray-700 font-semibold focus:outline-none focus:ring-2 transition-all ${
                    errors.apellidos ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-[#006837]/20 focus:border-[#006837]'
                  }`}
                />
              </div>
              {errors.apellidos && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.apellidos}</p>}
            </div>
          </div>

          {/* Fila 2: Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Fecha de Nacimiento <span className="text-red-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-gray-700 font-semibold focus:outline-none focus:ring-2 transition-all ${
                    errors.fechaNacimiento ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-[#006837]/20 focus:border-[#006837]'
                  }`}
                />
              </div>
              {errors.fechaNacimiento && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.fechaNacimiento}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Fecha de Ingreso al Ejido <span className="text-red-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="fechaIngreso"
                  value={formData.fechaIngreso}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-gray-700 font-semibold focus:outline-none focus:ring-2 transition-all ${
                    errors.fechaIngreso ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-[#006837]/20 focus:border-[#006837]'
                  }`}
                />
              </div>
              {errors.fechaIngreso && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.fechaIngreso}</p>}
            </div>
          </div>

          {/* Fila 3: Dirección y Colonia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Dirección (Calle y Número)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej. Av. Central #45"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Colonia o Barrio <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="colonia"
                  value={formData.colonia}
                  onChange={handleChange}
                  placeholder="Ej. Barrio Centro"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-gray-700 font-semibold focus:outline-none focus:ring-2 transition-all ${
                    errors.colonia ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-[#006837]/20 focus:border-[#006837]'
                  }`}
                />
              </div>
              {errors.colonia && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.colonia}</p>}
            </div>
          </div>

          {/* Fila 4: Teléfono y Correo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Teléfono de Contacto</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Ej. 961 123 4567"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-gray-700 font-semibold focus:outline-none focus:ring-2 transition-all ${
                    errors.telefono ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-[#006837]/20 focus:border-[#006837]'
                  }`}
                />
              </div>
              {errors.telefono && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.telefono}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-gray-700 font-semibold focus:outline-none focus:ring-2 transition-all ${
                    errors.correo ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-200 focus:ring-[#006837]/20 focus:border-[#006837]'
                  }`}
                />
              </div>
              {errors.correo && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.correo}</p>}
            </div>
          </div>

          {/* Tipo de Comunero */}
          <div className="space-y-2">
            <label className="text-gray-500 font-bold block">Tipo de Miembro <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`border rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all ${
                formData.tipoComunero === 'comunero'
                  ? 'border-[#006837] bg-[#006837]/5 text-[#006837]'
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-slate-50/50'
              }`}>
                <input
                  type="radio"
                  name="tipoComunero"
                  value="comunero"
                  checked={formData.tipoComunero === 'comunero'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  formData.tipoComunero === 'comunero' ? 'border-[#006837]' : 'border-gray-300'
                }`}>
                  {formData.tipoComunero === 'comunero' && <div className="w-2 h-2 rounded-full bg-[#006837]" />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs">Comunero</p>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Derechos de tierra</p>
                </div>
              </label>

              <label className={`border rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all ${
                formData.tipoComunero === 'avecindado'
                  ? 'border-emerald-600 bg-emerald-50/25 text-emerald-800'
                  : 'border-gray-200 bg-white text-gray-500 hover:bg-slate-50/50'
              }`}>
                <input
                  type="radio"
                  name="tipoComunero"
                  value="avecindado"
                  checked={formData.tipoComunero === 'avecindado'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                  formData.tipoComunero === 'avecindado' ? 'border-emerald-600' : 'border-gray-300'
                }`}>
                  {formData.tipoComunero === 'avecindado' && <div className="w-2 h-2 rounded-full bg-emerald-600" />}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-xs">Avecindado</p>
                  <p className="text-[9px] text-gray-400 font-medium leading-none mt-0.5">Residente sin título</p>
                </div>
              </label>
            </div>
            {errors.tipoComunero && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.tipoComunero}</p>}
          </div>

        </div>

        {/* Botones de Acción */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col-reverse sm:flex-row items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => { stopCamera(); onClose(); }}
            className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            Guardar Registro
          </button>
        </div>

      </form>
    </div>
  );
};
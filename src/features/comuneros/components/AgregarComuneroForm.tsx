"use client";

import React, { useState, useRef, useEffect } from 'react';
import { User, Camera, Upload, RotateCcw, Save, X } from 'lucide-react';
import * as Yup from 'yup';
import { Comunero, CrearComuneroPayload } from '../types/types';
import { getNeighborhoods, Neighborhood } from '../services/neighborhoodsApi';

interface AgregarComuneroFormProps {
  onClose: () => void;
  onGuardar: (payload: CrearComuneroPayload, fotoFile?: File | Blob | null, eliminarFoto?: boolean) => void;
  comuneroAEditar?: Comunero | any;
}

const comuneroValidationSchema = Yup.object().shape({
  nombre: Yup.string().min(3, 'El nombre debe tener al menos 3 caracteres').required('El nombre es obligatorio'),
  apellidoPaterno: Yup.string().min(2, 'Muy corto').required('El apellido paterno es obligatorio'),
  apellidoMaterno: Yup.string().min(2, 'Muy corto').required('El apellido materno es obligatorio'),
  fechaNacimiento: Yup.string().required('La fecha de nacimiento es obligatoria'),
  estadoCivil: Yup.string()
    .oneOf(['soltero', 'casado', 'divorciado', 'viudo', 'union_libre'], 'Selecciona un estado civil válido')
    .required('El estado civil es obligatorio'),
  telefono: Yup.string()
    .matches(/^[0-9]{10}$/, 'El teléfono debe tener exactamente 10 dígitos numéricos')
    .required('El teléfono es obligatorio'),
  tipoComunero: Yup.string()
    .oneOf(['comunero', 'avecindado', 'poblador'], 'Selecciona un tipo de miembro válido')
    .required('El tipo de miembro es obligatorio'),
  estadoPersona: Yup.string()
    .oneOf(['activo', 'inactivo', 'fallecido'], 'Selecciona un estado válido')
    .required('El estado de la persona es obligatorio'),
  neighborhoodId: Yup.string().required('Debe seleccionar un barrio o vecindario'),
  address: Yup.string().min(5, 'La dirección debe tener al menos 5 caracteres').required('La dirección es obligatoria'),
  communityMemberSince: Yup.string().required('La fecha de registro/ingreso es obligatoria'),
});

const mapaTipoAInglés: Record<'comunero' | 'avecindado' | 'poblador', CrearComuneroPayload['personType']> = {
  comunero: 'COMMONER',
  avecindado: 'RESIDENT',
  poblador: 'INHABITANT',
};

const mapaEstadoCivilAInglés: Record<string, CrearComuneroPayload['maritalStatus']> = {
  soltero: 'SINGLE',
  casado: 'MARRIED',
  divorciado: 'DIVORCED',
  viudo: 'WIDOWED',
  union_libre: 'FREE_UNION',
};

// Mapeos inversos para cuando editamos (de lo que viene de la API al select del form)
const mapaEstadoCivilDesdeAPI: Record<string, string> = {
  SINGLE: 'soltero',
  MARRIED: 'casado',
  DIVORCED: 'divorciado',
  WIDOWED: 'viudo',
  FREE_UNION: 'union_libre',
  soltero: 'soltero',
  casado: 'casado',
  divorciado: 'divorciado',
  viudo: 'viudo',
  union_libre: 'union_libre',
};

// Estado de la persona (activo / inactivo / fallecido)
const mapaEstadoPersonaAInglés: Record<'activo' | 'inactivo' | 'fallecido', CrearComuneroPayload['status']> = {
  activo: 'ACTIVE',
  inactivo: 'INACTIVE',
  fallecido: 'DECEASED',
};

const mapaEstadoPersonaDesdeAPI: Record<string, string> = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
  DECEASED: 'fallecido',
  activo: 'activo',
  inactivo: 'inactivo',
  fallecido: 'fallecido',
};

// Formatea fechas ISO a YYYY-MM-DD para los <input type="date">
function toInputDate(val?: string | null): string {
  if (!val) return '';
  return String(val).trim().split('T')[0] || '';
}

export const AgregarComuneroForm: React.FC<AgregarComuneroFormProps> = ({
  onClose,
  onGuardar,
  comuneroAEditar = null,
}) => {
  const esEdicion = !!comuneroAEditar;
  const hoyStr = new Date().toISOString().split('T')[0];

  // 🔍 Extracción robusta de campos para edición (soporta inglés/español)
  const initialNombre = comuneroAEditar?.nombre ?? comuneroAEditar?.firstName ?? '';
  const initialApellidoPaterno = comuneroAEditar?.apellidoPaterno ?? comuneroAEditar?.paternalLastName ?? '';
  const initialApellidoMaterno = comuneroAEditar?.apellidoMaterno ?? comuneroAEditar?.maternalLastName ?? '';

  const rawFechaNac = comuneroAEditar?.fechaNacimiento ?? comuneroAEditar?.birthDate;
  const initialFechaNacimiento = toInputDate(rawFechaNac);

  const rawEstadoCivil = comuneroAEditar?.estadoCivil ?? comuneroAEditar?.maritalStatus ?? 'soltero';
  const initialEstadoCivil = mapaEstadoCivilDesdeAPI[rawEstadoCivil] || 'soltero';

  const initialTelefono = comuneroAEditar?.telefono ?? comuneroAEditar?.phoneNumber ?? comuneroAEditar?.phone ?? '';

  const rawTipo = comuneroAEditar?.tipo ?? comuneroAEditar?.personType ?? 'comunero';
  const initialTipoComunero =
    rawTipo === 'COMMONER' || rawTipo === 'comunero'
      ? 'comunero'
      : rawTipo === 'INHABITANT' || rawTipo === 'poblador'
      ? 'poblador'
      : 'avecindado';

  const rawEstadoPersona = comuneroAEditar?.estado ?? comuneroAEditar?.status ?? 'activo';
  const initialEstadoPersona = mapaEstadoPersonaDesdeAPI[rawEstadoPersona] || 'activo';

  const initialNeighborhoodId =
    comuneroAEditar?.neighborhoodId ??
    comuneroAEditar?.neighborhood?.id ??
    '';

  const initialAddress = comuneroAEditar?.address ?? comuneroAEditar?.direccion ?? '';

  const rawFechaReg =
    comuneroAEditar?.communityMemberSince ??
    comuneroAEditar?.fechaRegistro ??
    comuneroAEditar?.createdAt;
  const initialCommunityMemberSince = toInputDate(rawFechaReg) || hoyStr;

  const [formData, setFormData] = useState({
    nombre: initialNombre,
    apellidoPaterno: initialApellidoPaterno,
    apellidoMaterno: initialApellidoMaterno,
    fechaNacimiento: initialFechaNacimiento,
    estadoCivil: initialEstadoCivil,
    telefono: initialTelefono,
    tipoComunero: initialTipoComunero,
    estadoPersona: initialEstadoPersona,
    neighborhoodId: initialNeighborhoodId,
    address: initialAddress,
    communityMemberSince: initialCommunityMemberSince,
  });

  const [barrios, setBarrios] = useState<Neighborhood[]>([]);
  const [loadingBarrios, setLoadingBarrios] = useState<boolean>(true);

  // Fotografía
  const fotoInicial = comuneroAEditar?.fotografia ?? comuneroAEditar?.photo ?? null;
  const [fotografia, setFotografia] = useState<string | null>(fotoInicial);
  const [fotoFile, setFotoFile] = useState<File | Blob | null>(null);
  const [fotoEliminada, setFotoEliminada] = useState(false);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchBarrios = async () => {
      try {
        setLoadingBarrios(true);
        const data = await getNeighborhoods();
        setBarrios(data);

        // Si es edición y no teníamos el neighborhoodId explícito, intentamos matchear por el nombre del barrio
        if (esEdicion && !formData.neighborhoodId && comuneroAEditar?.vecindario) {
          const match = data.find(
            (b) => b.name.toLowerCase() === String(comuneroAEditar.vecindario).toLowerCase()
          );
          if (match) {
            setFormData((prev) => ({ ...prev, neighborhoodId: match.id }));
          }
        }
      } catch (err) {
        console.error('Error al cargar vecindarios:', err);
      } finally {
        setLoadingBarrios(false);
      }
    };
    fetchBarrios();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    setFotografia(null);
    setFotoFile(null);

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
        // En algunos navegadores (Safari incluido) hay que forzar play()
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

    const TARGET_WIDTH = 400;
    const TARGET_HEIGHT = 400;

    const canvas = document.createElement('canvas');
    canvas.width = TARGET_WIDTH;
    canvas.height = TARGET_HEIGHT;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
      const previewUrl = canvas.toDataURL('image/jpeg', 0.75);
      setFotografia(previewUrl);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], `foto-camara-${Date.now()}.jpg`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            setFotoFile(file);
          }
        },
        'image/jpeg',
        0.75
      );

      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    stream?.getTracks().forEach((t) => t.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setFotografia(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      // Al crear se requiere foto, al editar la foto existente es válida
      if (!fotoFile && !fotografia && !esEdicion) {
        alert('Debes tomar o subir una fotografía del miembro.');
        return;
      }

      await comuneroValidationSchema.validate(formData, { abortEarly: false });
      setIsSubmitting(true);

      const payload: CrearComuneroPayload = {
        personType: mapaTipoAInglés[formData.tipoComunero as 'comunero' | 'avecindado' | 'poblador'],
        status: mapaEstadoPersonaAInglés[formData.estadoPersona as 'activo' | 'inactivo' | 'fallecido'],
        firstName: formData.nombre,
        paternalLastName: formData.apellidoPaterno,
        maternalLastName: formData.apellidoMaterno,
        birthDate: formData.fechaNacimiento,
        maritalStatus: mapaEstadoCivilAInglés[formData.estadoCivil],
        phone: formData.telefono,
        neighborhoodId: formData.neighborhoodId,
        communityMemberSince: formData.communityMemberSince,
        address: formData.address,
      };

      onGuardar(payload, fotoFile, fotoEliminada);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) validationErrors[error.path] = error.message;
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
          </div>
          <button type="button" onClick={() => { stopCamera(); onClose(); }} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4 text-gray-700 font-semibold text-xs">
          {/* Fotografía */}
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
            <h4 className="text-gray-500 font-bold self-start">
              Fotografía de Perfil {!esEdicion && <span className="text-red-500">*</span>}
            </h4>
            <div className="relative w-28 h-28 rounded-full border-2 border-[#006837]/20 bg-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
              {isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              ) : fotografia ? (
                <img src={fotografia} alt="Foto" className="w-full h-full object-cover" />
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
                  <button type="button" onClick={stopCamera} className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg font-bold">Cancelar</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={startCamera} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" /> Usar Cámara
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-bold flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5 text-gray-400" /> Subir Archivo
                  </button>
                  {fotografia && (
                    <button type="button" onClick={() => { setFotografia(null); setFotoFile(null); setFotoEliminada(esEdicion); }} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </div>

          {/* Nombre y Estado Civil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Nombre(s) <span className="text-red-500">*</span></label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                placeholder="Ej. Juan Carlos"
                className={`w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${errors.nombre ? 'border-red-500' : 'border-gray-200'}`} />
              {errors.nombre && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.nombre}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Estado Civil <span className="text-red-500">*</span></label>
              <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange}
                className={`w-full px-3 py-2.5 border rounded-xl bg-white ${errors.estadoCivil ? 'border-red-500' : 'border-gray-200'}`}>
                <option value="">Selecciona...</option>
                <option value="soltero">Soltero(a)</option>
                <option value="casado">Casado(a)</option>
                <option value="divorciado">Divorciado(a)</option>
                <option value="viudo">Viudo(a)</option>
                <option value="union_libre">Unión libre</option>
              </select>
              {errors.estadoCivil && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.estadoCivil}</p>}
            </div>
          </div>

          {/* Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Apellido Paterno <span className="text-red-500">*</span></label>
              <input type="text" name="apellidoPaterno" value={formData.apellidoPaterno} onChange={handleChange}
                placeholder="Ej. Pérez"
                className={`w-full px-3 py-2.5 border rounded-xl ${errors.apellidoPaterno ? 'border-red-500' : 'border-gray-200'}`} />
              {errors.apellidoPaterno && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.apellidoPaterno}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Apellido Materno <span className="text-red-500">*</span></label>
              <input type="text" name="apellidoMaterno" value={formData.apellidoMaterno} onChange={handleChange}
                placeholder="Ej. Gómez"
                className={`w-full px-3 py-2.5 border rounded-xl ${errors.apellidoMaterno ? 'border-red-500' : 'border-gray-200'}`} />
              {errors.apellidoMaterno && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.apellidoMaterno}</p>}
            </div>
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Fecha de Nacimiento <span className="text-red-500">*</span></label>
              <input type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange}
                className={`w-full px-3 py-2.5 border rounded-xl ${errors.fechaNacimiento ? 'border-red-500' : 'border-gray-200'}`} />
              {errors.fechaNacimiento && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.fechaNacimiento}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Fecha Comunero Desde <span className="text-red-500">*</span></label>
              <input type="date" name="communityMemberSince" value={formData.communityMemberSince} onChange={handleChange}
                className={`w-full px-3 py-2.5 border rounded-xl ${errors.communityMemberSince ? 'border-red-500' : 'border-gray-200'}`} />
              {errors.communityMemberSince && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.communityMemberSince}</p>}
            </div>
          </div>

          {/* Teléfono y Vecindario (UUID) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Teléfono</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange}
                placeholder="Ej. 9611234567"
                className={`w-full px-3 py-2.5 border rounded-xl ${errors.telefono ? 'border-red-500' : 'border-gray-200'}`} />
              {errors.telefono && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.telefono}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Barrio / Vecindario <span className="text-red-500">*</span></label>
              <select
                name="neighborhoodId"
                value={formData.neighborhoodId}
                onChange={handleChange}
                disabled={loadingBarrios}
                className={`w-full px-3 py-2.5 border rounded-xl bg-white ${errors.neighborhoodId ? 'border-red-500' : 'border-gray-200'}`}
              >
                <option value="">
                  {loadingBarrios ? 'Cargando barrios...' : 'Selecciona un barrio...'}
                </option>
                {barrios.map((barrio) => (
                  <option key={barrio.id} value={barrio.id}>
                    {barrio.name}
                  </option>
                ))}
              </select>
              {errors.neighborhoodId && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.neighborhoodId}</p>}
            </div>
          </div>

          {/* Dirección completa */}
          <div className="space-y-1.5">
            <label className="text-gray-500 font-bold block">Dirección Particular <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Ej. Calle Benito Juárez #125"
              className={`w-full px-3 py-2.5 border rounded-xl ${errors.address ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.address}</p>}
          </div>

          {/* Tipo de Miembro */}
          <div className="space-y-2">
            <label className="text-gray-500 font-bold block">Tipo de Miembro <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
  <label className={`border rounded-xl px-2 py-2 flex flex-col items-center text-center gap-1 cursor-pointer ${formData.tipoComunero === 'comunero' ? 'border-[#006837] bg-[#006837]/5 text-[#006837]' : 'border-gray-200 bg-white'}`}>
    <input type="radio" name="tipoComunero" value="comunero" checked={formData.tipoComunero === 'comunero'} onChange={handleChange} className="sr-only" />
    <div className="min-w-0">
      <p className="font-bold text-[10px] leading-tight">Comunero</p>
      <p className="text-[8px] text-gray-400 font-medium leading-tight">Derechos de tierra</p>
    </div>
  </label>

  <label className={`border rounded-xl px-2 py-2 flex flex-col items-center text-center gap-1 cursor-pointer ${formData.tipoComunero === 'avecindado' ? 'border-emerald-600 bg-emerald-50/25 text-emerald-800' : 'border-gray-200 bg-white'}`}>
    <input type="radio" name="tipoComunero" value="avecindado" checked={formData.tipoComunero === 'avecindado'} onChange={handleChange} className="sr-only" />
    <div className="min-w-0">
      <p className="font-bold text-[10px] leading-tight">Avecindado</p>
      <p className="text-[8px] text-gray-400 font-medium leading-tight">Residente sin título</p>
    </div>
  </label>

  <label className={`border rounded-xl px-2 py-2 flex flex-col items-center text-center gap-1 cursor-pointer ${formData.tipoComunero === 'poblador' ? 'border-emerald-600 bg-emerald-50/25 text-emerald-800' : 'border-gray-200 bg-white'}`}>
    <input type="radio" name="tipoComunero" value="poblador" checked={formData.tipoComunero === 'poblador'} onChange={handleChange} className="sr-only" />
    <div className="min-w-0">
      <p className="font-bold text-[10px] leading-tight">Poblador</p>
      <p className="text-[8px] text-gray-400 font-medium leading-tight">Residente con título</p>
    </div>
  </label>
</div>
            {errors.tipoComunero && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.tipoComunero}</p>}
          </div>

          {/* Estado de la Persona */}
          <div className="space-y-2">
            <label className="text-gray-500 font-bold block">Estado <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-3 gap-2">
              <label className={`border rounded-xl px-2 py-2 flex flex-col items-center text-center gap-1 cursor-pointer ${formData.estadoPersona === 'activo' ? 'border-[#006837] bg-[#006837]/5 text-[#006837]' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="estadoPersona" value="activo" checked={formData.estadoPersona === 'activo'} onChange={handleChange} className="sr-only" />
                <div className="min-w-0">
                  <p className="font-bold text-[10px] leading-tight">Activo</p>
                  <p className="text-[8px] text-gray-400 font-medium leading-tight">En la comunidad</p>
                </div>
              </label>

              <label className={`border rounded-xl px-2 py-2 flex flex-col items-center text-center gap-1 cursor-pointer ${formData.estadoPersona === 'inactivo' ? 'border-amber-500 bg-amber-50/40 text-amber-700' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="estadoPersona" value="inactivo" checked={formData.estadoPersona === 'inactivo'} onChange={handleChange} className="sr-only" />
                <div className="min-w-0">
                  <p className="font-bold text-[10px] leading-tight">Inactivo</p>
                  <p className="text-[8px] text-gray-400 font-medium leading-tight">Sin participación</p>
                </div>
              </label>

              <label className={`border rounded-xl px-2 py-2 flex flex-col items-center text-center gap-1 cursor-pointer ${formData.estadoPersona === 'fallecido' ? 'border-gray-600 bg-gray-100/60 text-gray-700' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="estadoPersona" value="fallecido" checked={formData.estadoPersona === 'fallecido'} onChange={handleChange} className="sr-only" />
                <div className="min-w-0">
                  <p className="font-bold text-[10px] leading-tight">Fallecido</p>
                  <p className="text-[8px] text-gray-400 font-medium leading-tight">Requiere sucesión</p>
                </div>
              </label>
            </div>
            {errors.estadoPersona && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.estadoPersona}</p>}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col-reverse sm:flex-row items-center gap-2 shrink-0">
          <button type="button" onClick={() => { stopCamera(); onClose(); }} disabled={isSubmitting}
            className="w-full sm:w-1/2 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50">
            Cancelar
          </button>
          <button type="submit" disabled={isSubmitting}
            className="w-full sm:w-1/2 py-2.5 sm:py-3 bg-[#006837] hover:bg-[#00522b] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 disabled:opacity-60">
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Guardando...' : esEdicion ? 'Actualizar Cambios' : 'Guardar Registro'}
          </button>
        </div>
      </form>
    </div>
  );
};
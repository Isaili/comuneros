'use client';

import React, { useMemo, useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { KeyRound, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/core/auth/services/authApi';
import { calcularEntropia, ENTROPIA_MINIMA_ACEPTABLE, NivelFortaleza } from '@/features/recuperar-contrasena/utils/passwordEntropy';

const COLOR_POR_NIVEL: Record<NivelFortaleza, string> = {
  'muy-debil': 'bg-red-500',
  'debil': 'bg-orange-500',
  'regular': 'bg-amber-400',
  'fuerte': 'bg-lime-500',
  'muy-fuerte': 'bg-emerald-600',
};

const cambiarPasswordSchema = yup.object({
  currentPassword: yup.string().required('Ingresa tu contraseña actual'),
  newPassword: yup
    .string()
    .required('La nueva contraseña es obligatoria')
    .min(8, 'Debe tener al menos 8 caracteres')
    .test(
      'entropia-minima',
      'La contraseña es demasiado predecible, agrega mayúsculas, números o símbolos.',
      (value) => !!value && calcularEntropia(value).bits >= ENTROPIA_MINIMA_ACEPTABLE
    ),
  confirmarPassword: yup
    .string()
    .required('Confirma tu nueva contraseña')
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden'),
});

interface CambiarPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmarPassword: string;
}

export const CambiarPasswordCard: React.FC = () => {
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CambiarPasswordFormData>({
    resolver: yupResolver(cambiarPasswordSchema) as Resolver<CambiarPasswordFormData>,
  });

  const nuevaPasswordActual = watch('newPassword') ?? '';
  const entropia = useMemo(() => calcularEntropia(nuevaPasswordActual), [nuevaPasswordActual]);

  const onSubmit = async (data: CambiarPasswordFormData) => {
    setError(null);
    setExito(false);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      setExito(true);
      reset();
    } catch (err) {
      const mensaje = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(mensaje ?? 'No se pudo cambiar la contraseña. Verifica tu contraseña actual.');
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Cambiar contraseña</h3>
          <p className="text-xs text-gray-400">Actualiza tu contraseña de acceso al sistema</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-2.5 text-xs font-medium text-red-600">
          {error}
        </div>
      )}
      {exito && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-2.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" /> Contraseña actualizada correctamente.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs font-semibold text-gray-700">
        <div className="space-y-1">
          <label className="block text-gray-500">Contraseña actual</label>
          <div className="relative">
            <input
              type={mostrarActual ? 'text' : 'password'}
              {...register('currentPassword')}
              className={`w-full rounded-xl border bg-white px-3 py-2.5 pr-10 outline-none focus:border-emerald-500 ${
                errors.currentPassword ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Tu contraseña actual"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setMostrarActual((actual) => !actual)}
            >
              {mostrarActual ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
          {errors.currentPassword && <p className="text-red-500">{errors.currentPassword.message}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-gray-500">Nueva contraseña</label>
          <div className="relative">
            <input
              type={mostrarNueva ? 'text' : 'password'}
              {...register('newPassword')}
              className={`w-full rounded-xl border bg-white px-3 py-2.5 pr-10 outline-none focus:border-emerald-500 ${
                errors.newPassword ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setMostrarNueva((actual) => !actual)}
            >
              {mostrarNueva ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
          {errors.newPassword && <p className="text-red-500">{errors.newPassword.message}</p>}

          {nuevaPasswordActual.length > 0 && (
            <div className="pt-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full transition-all ${COLOR_POR_NIVEL[entropia.nivel]}`}
                  style={{ width: `${entropia.porcentaje}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-gray-400">
                Fortaleza: <span className="text-gray-600">{entropia.etiqueta}</span> · {entropia.bits} bits de entropía
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-gray-500">Confirmar nueva contraseña</label>
          <input
            type={mostrarNueva ? 'text' : 'password'}
            {...register('confirmarPassword')}
            className={`w-full rounded-xl border bg-white px-3 py-2.5 outline-none focus:border-emerald-500 ${
              errors.confirmarPassword ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="Repite la contraseña"
          />
          {errors.confirmarPassword && <p className="text-red-500">{errors.confirmarPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#1E4D3A] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#153629] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Guardando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
};

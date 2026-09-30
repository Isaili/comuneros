'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Home, Lock, Eye, EyeOff, MapPin, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { recuperarContrasenaApi } from '../services/recuperarContrasenaApi';
import { calcularEntropia, ENTROPIA_MINIMA_ACEPTABLE, NivelFortaleza } from '../utils/passwordEntropy';

const floatingPins = [
  { top: '16%', left: '12%' },
  { top: '28%', right: '18%' },
  { top: '55%', left: '10%' },
  { top: '70%', right: '16%' },
  { top: '60%', left: '50%' },
  { top: '22%', right: '48%' },
];

const COLOR_POR_NIVEL: Record<NivelFortaleza, string> = {
  'muy-debil': 'bg-red-500',
  'debil': 'bg-orange-500',
  'regular': 'bg-amber-400',
  'fuerte': 'bg-lime-400',
  'muy-fuerte': 'bg-[#a6f35a]',
};

const restablecerSchema = yup.object({
  password: yup
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
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

interface RestablecerFormData {
  password: string;
  confirmarPassword: string;
}

export default function RestablecerContrasena() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [restablecida, setRestablecida] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RestablecerFormData>({
    resolver: yupResolver(restablecerSchema) as Resolver<RestablecerFormData>,
  });

  const passwordActual = watch('password') ?? '';
  const entropia = useMemo(() => calcularEntropia(passwordActual), [passwordActual]);

  const onSubmit = async (data: RestablecerFormData) => {
    setError(null);
    try {
      await recuperarContrasenaApi.restablecerContrasena(token, data.password);
      setRestablecida(true);
    } catch {
      setError('El enlace ya expiró o no es válido. Solicita uno nuevo.');
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04120d] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(5, 22, 17, 0.45), rgba(5, 22, 17, 0.78)), url('/mejora.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'saturate(1.2) contrast(1.08) brightness(0.82)',
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(164,255,125,0.14),_transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,_rgba(0,0,0,0.08),_rgba(0,0,0,0.7))]" />

      {floatingPins.map((pin, index) => (
        <div
          key={index}
          className="pointer-events-none absolute"
          style={{ top: pin.top, left: pin.left, right: pin.right }}
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#d5ff8c]/70 bg-[#0a1a16]/70 shadow-[0_0_18px_rgba(184,255,90,0.35)]">
            <MapPin className="h-4 w-4 text-[#d5ff8c]" fill="rgba(213,255,140,0.25)" />
          </div>
        </div>
      ))}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-5 pb-6 pt-6 md:px-8 lg:px-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black tracking-tight text-white md:text-2xl">
              Bienes Comunales
            </h1>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9ff76a]">
              Copainalá, Chiapas
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0e1714]/75 px-5 py-3 text-base font-semibold text-white backdrop-blur-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition hover:border-[#9ff76a]/60 hover:text-[#d9ff7f]"
          >
            <Home className="h-5 w-5" />
            Ir al inicio
          </Link>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          {!token ? (
            <>
              <AlertTriangle className="h-16 w-16 text-amber-400" />
              <h2 className="mt-6 text-[1.8rem] font-black leading-tight text-white md:text-[2.6rem]">
                Enlace inválido
              </h2>
              <p className="mt-4 max-w-xl text-base text-stone-200 md:text-lg">
                Este enlace de recuperación no incluye un token válido. Solicita uno nuevo desde la pantalla de recuperación de contraseña.
              </p>
              <Link
                href="/recuperar-contrasena"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#a6f35a] px-8 py-4 text-lg font-black text-[#07140f] shadow-[0_0_25px_rgba(166,243,90,0.45)] transition hover:scale-[1.02]"
              >
                <ArrowLeft className="h-6 w-6" />
                Solicitar recuperación
              </Link>
            </>
          ) : !restablecida ? (
            <>
              <h2 className="text-[1.8rem] font-black leading-tight text-white md:text-[3.2rem]">
                Crea tu nueva contraseña
              </h2>

              <p className="mt-6 max-w-xl text-base text-stone-200 md:text-lg">
                Elige una contraseña segura que no hayas usado antes en el sistema.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0e1714]/75 p-8 text-left backdrop-blur-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
              >
                {error && (
                  <div className="mb-4 rounded-lg border border-red-400/40 bg-red-500/10 p-2.5 text-xs font-medium text-red-300">
                    {error}
                  </div>
                )}

                <label className="text-sm font-semibold text-[#9ff76a]">Nueva contraseña</label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-stone-300" />
                  </div>
                  <input
                    type={mostrarPassword ? 'text' : 'password'}
                    {...register('password')}
                    className={`block w-full rounded-xl border bg-[#04120d] py-3 pl-10 pr-10 text-sm font-medium text-white placeholder:text-stone-500 focus:border-[#a6f35a] focus:ring-[#a6f35a] ${
                      errors.password ? 'border-red-400' : 'border-white/10'
                    }`}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setMostrarPassword((actual) => !actual)}
                  >
                    {mostrarPassword ? (
                      <EyeOff className="h-5 w-5 text-stone-400 hover:text-white" />
                    ) : (
                      <Eye className="h-5 w-5 text-stone-400 hover:text-white" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-400">{errors.password.message}</p>
                )}

                {passwordActual.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className={`h-full rounded-full transition-all ${COLOR_POR_NIVEL[entropia.nivel]}`}
                        style={{ width: `${entropia.porcentaje}%` }}
                      />
                    </div>
                    <p className="mt-1 text-[11px] font-semibold text-stone-400">
                      Fortaleza: <span className="text-stone-200">{entropia.etiqueta}</span> · {entropia.bits} bits de entropía
                    </p>
                  </div>
                )}

                <label className="mt-4 block text-sm font-semibold text-[#9ff76a]">Confirmar contraseña</label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-stone-300" />
                  </div>
                  <input
                    type={mostrarConfirmar ? 'text' : 'password'}
                    {...register('confirmarPassword')}
                    className={`block w-full rounded-xl border bg-[#04120d] py-3 pl-10 pr-10 text-sm font-medium text-white placeholder:text-stone-500 focus:border-[#a6f35a] focus:ring-[#a6f35a] ${
                      errors.confirmarPassword ? 'border-red-400' : 'border-white/10'
                    }`}
                    placeholder="Repite la contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setMostrarConfirmar((actual) => !actual)}
                  >
                    {mostrarConfirmar ? (
                      <EyeOff className="h-5 w-5 text-stone-400 hover:text-white" />
                    ) : (
                      <Eye className="h-5 w-5 text-stone-400 hover:text-white" />
                    )}
                  </button>
                </div>
                {errors.confirmarPassword && (
                  <p className="mt-1.5 text-xs font-medium text-red-400">{errors.confirmarPassword.message}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#a6f35a] px-8 py-4 text-lg font-black text-[#07140f] shadow-[0_0_25px_rgba(166,243,90,0.45)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Guardando...' : 'Restablecer contraseña'}
                </button>

                <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#9ff76a]" />
                  Conexión segura
                </div>
              </form>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-20 w-20 text-[#a6f35a] drop-shadow-[0_0_25px_rgba(166,243,90,0.45)]" />
              <h2 className="mt-6 text-[1.8rem] font-black leading-tight text-white md:text-[2.6rem]">
                ¡Contraseña actualizada!
              </h2>
              <p className="mt-4 max-w-xl text-base text-stone-200 md:text-lg">
                Tu contraseña se restableció correctamente. Ya puedes iniciar sesión con tus nuevas credenciales.
              </p>

              <button
                type="button"
                onClick={() => router.push('/login')}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#a6f35a] px-8 py-4 text-lg font-black text-[#07140f] shadow-[0_0_25px_rgba(166,243,90,0.45)] transition hover:scale-[1.02]"
              >
                <ArrowLeft className="h-6 w-6" />
                Ir al inicio de sesión
              </button>
            </>
          )}
        </section>

        <footer className="pb-2 text-center text-sm text-stone-300">
          <span className="font-semibold text-[#a6f35a]">Bienes Comunales</span> © 2026 · Todos los derechos reservados
        </footer>
      </div>
    </main>
  );
}

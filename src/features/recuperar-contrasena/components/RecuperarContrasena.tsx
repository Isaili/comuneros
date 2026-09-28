'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowLeft, Home, Mail, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';

const floatingPins = [
  { top: '16%', left: '12%' },
  { top: '28%', right: '18%' },
  { top: '55%', left: '10%' },
  { top: '70%', right: '16%' },
  { top: '60%', left: '50%' },
  { top: '22%', right: '48%' },
];

const recuperarSchema = yup.object({
  correo: yup
    .string()
    .required('El correo electrónico es obligatorio')
    .email('Ingresa un correo electrónico válido'),
});

interface RecuperarFormData {
  correo: string;
}

export default function RecuperarContrasena() {
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecuperarFormData>({
    resolver: yupResolver(recuperarSchema) as Resolver<RecuperarFormData>,
  });

  const onSubmit = async (data: RecuperarFormData) => {
    setError(null);
    try {
      console.log('Solicitud de recuperación enviada a:', data.correo);
      setEnviado(true);
    } catch {
      setError('No se pudo enviar el correo de recuperación. Intenta de nuevo.');
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
          {!enviado ? (
            <>
              <h2 className="text-[1.8rem] font-black leading-tight text-white md:text-[3.2rem]">
                Recupera tu contraseña
              </h2>

              <p className="mt-6 max-w-xl text-base text-stone-200 md:text-lg">
                Ingresa tu correo electrónico registrado y te enviaremos las
                instrucciones para restablecer tu contraseña.
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

                <label className="text-sm font-semibold text-[#9ff76a]">
                  Correo electrónico
                </label>
                <div className="relative mt-1.5">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-stone-300" />
                  </div>
                  <input
                    type="text"
                    {...register('correo')}
                    className={`block w-full rounded-xl border bg-[#04120d] py-3 pl-10 pr-4 text-sm font-medium text-white placeholder:text-stone-500 focus:border-[#a6f35a] focus:ring-[#a6f35a] ${
                      errors.correo ? 'border-red-400' : 'border-white/10'
                    }`}
                    placeholder="ej. capturista@comisaria.gob.mx"
                  />
                </div>
                {errors.correo && (
                  <p className="mt-1.5 text-xs font-medium text-red-400">
                    {errors.correo.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[#a6f35a] px-8 py-4 text-lg font-black text-[#07140f] shadow-[0_0_25px_rgba(166,243,90,0.45)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar instrucciones'}
                </button>

                <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#9ff76a]" />
                  Conexión segura
                </div>
              </form>

              <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-stone-300 transition hover:text-[#d9ff7f]"
              >
                <ArrowLeft className="h-5 w-5" />
                Volver al inicio de sesión
              </Link>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-20 w-20 text-[#a6f35a] drop-shadow-[0_0_25px_rgba(166,243,90,0.45)]" />
              <h2 className="mt-6 text-[1.8rem] font-black leading-tight text-white md:text-[2.6rem]">
                ¡Revisa tu correo!
              </h2>
              <p className="mt-4 max-w-xl text-base text-stone-200 md:text-lg">
                Te enviamos un enlace con las instrucciones para restablecer tu
                contraseña. Si no lo encuentras, revisa tu bandeja de spam.
              </p>

              <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#a6f35a] px-8 py-4 text-lg font-black text-[#07140f] shadow-[0_0_25px_rgba(166,243,90,0.45)] transition hover:scale-[1.02]"
              >
                <ArrowLeft className="h-6 w-6" />
                Volver al inicio de sesión
              </Link>
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

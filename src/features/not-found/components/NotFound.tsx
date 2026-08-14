"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, MapPin } from "lucide-react";

const floatingPins = [
  { top: "16%", left: "12%" },
  { top: "28%", right: "18%" },
  { top: "55%", left: "10%" },
  { top: "70%", right: "16%" },
  { top: "60%", left: "50%" },
  { top: "22%", right: "48%" },
];

export default function NotFound() {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04120d] text-white">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(5, 22, 17, 0.45), rgba(5, 22, 17, 0.78)), url('/mejora.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(1.2) contrast(1.08) brightness(0.82)",
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
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[#9ff76a] bg-[#0a1d18]/70 text-lg font-black text-[#9ff76a] shadow-[0_0_20px_rgba(159,247,106,0.25)]">
              CBC
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white md:text-2xl">
                Casa de Bienes Comunales
              </h1>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9ff76a]">
                Copainalá, Chiapas
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0e1714]/75 px-5 py-3 text-base font-semibold text-white backdrop-blur-sm shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition hover:border-[#9ff76a]/60 hover:text-[#d9ff7f]"
          >
            <Home className="h-5 w-5" />
            Ir al inicio
          </Link>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <div className="text-[7rem] font-black leading-none tracking-[-0.1em] text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.18)] md:text-[15rem]">
            404
          </div>

          <h2 className="mt-3 text-[1.8rem] font-black leading-tight text-white md:text-[3.6rem]">
            ¡Ups! página no encontrada
          </h2>

          <p className="mt-6 max-w-3xl text-base text-stone-200 md:text-xl">
            La información que buscas no existe o fue movida.
            <br />
            pero no te preocupes, sigamos explorando.
          </p>

          <button
            onClick={handleBack}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#a6f35a] px-8 py-4 text-lg font-black text-[#07140f] shadow-[0_0_25px_rgba(166,243,90,0.45)] transition hover:scale-[1.02]"
          >
            <ArrowLeft className="h-6 w-6" />
            Volver a navegación
          </button>
        </section>

        <footer className="pb-2 text-center text-sm text-stone-300">
          <span className="font-semibold text-[#a6f35a]">Comisaría Ejidal</span> © 2026 · Todos los derechos reservados
        </footer>
      </div>
    </main>
  );
}

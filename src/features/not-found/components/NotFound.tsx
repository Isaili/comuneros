"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Definimos los iconos SVG aquí para mantener el componente limpio y autocontenido
const Icons = {
  Home: () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4 ml-auto text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
    </svg>
  ),
  Parcelas: () => (
    <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 4L9 7" />
    </svg>
  ),
  Padron: () => (
    <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Tramites: () => (
    <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
};

interface QuickAccessCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ icon, title, description, href }) => (
  <Link href={href} className="flex items-center gap-5 p-5 bg-[#111] bg-opacity-60 backdrop-blur-sm rounded-2xl border border-stone-800 hover:border-emerald-700 transition-all group flex-1 min-w-[300px]">
    <div className="shrink-0">{icon}</div>
    <div className="flex-1">
      <h4 className="text-lg font-bold text-white">{title}</h4>
      <p className="text-sm text-stone-400">{description}</p>
    </div>
    <Icons.ArrowRight />
  </Link>
);

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
    <main
      className="min-h-screen bg-black text-white font-sans flex flex-col justify-between p-6 md:p-10 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundColor: '#0f2d1f',
        backgroundImage: "linear-gradient(rgba(5, 18, 12, 0.12), rgba(5, 18, 12, 0.3)), url('/img1.webp')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      <header className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 font-serif font-black text-xl shadow-inner">CE</div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Comisaría Ejidal</h1>
            <p className="text-xs text-emerald-400 uppercase tracking-widest">Sistema de Gestión Agraria</p>
          </div>
        </div>
        <Link
          href="/"
          className="flex items-center px-4 py-2 rounded-full border border-stone-700 bg-black bg-opacity-50 text-white text-sm hover:bg-opacity-80 transition"
        >
          <Icons.Home />
          Ir al inicio
        </Link>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center relative z-10 my-16">
        <h2 className="text-[150px] md:text-[200px] font-black leading-none text-white tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          404
        </h2>
        <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-6">
          ¡Ups! Predio o página no localizada
        </h3>
        <p className="text-lg text-stone-300 max-w-2xl mb-10 leading-relaxed">
          La información que buscas no existe o fue movida.
          <br />
          Verifica la clave catastral o expediente, pero no te preocupes, sigamos explorando.
        </p>
        <button
          onClick={handleBack}
          className="flex items-center px-8 py-4 bg-[#a3e635] text-black font-bold rounded-full text-lg shadow-lg hover:bg-[#bef264] transition transform hover:scale-105"
        >
          <Icons.ArrowLeft />
          Volver a navegación
        </button>
      </div>

      <footer className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-8">
        <div className="flex flex-wrap gap-4 justify-center">
          <QuickAccessCard
            icon={<Icons.Parcelas />}
            title="Parcelas y Lotes"
            description="Consulta el mapa y estado de predios"
            href="/parcelas"
          />
          <QuickAccessCard
            icon={<Icons.Padron />}
            title="Padrón de Ejidatarios"
            description="Listado oficial y derechos vigentes"
            href="/padron"
          />
          <QuickAccessCard
            icon={<Icons.Tramites />}
            title="¿Necesitas ayuda?"
            description="Contacta a la mesa directiva"
            href="/contacto"
          />
        </div>

        <div className="text-center text-sm text-stone-500 pt-4 border-t border-stone-800 border-opacity-50">
          <span className="text-emerald-600 font-medium">Comisaría Ejidal</span> © 2024 · Todos los derechos reservados · v2.4
        </div>
      </footer>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  let router;
  try {
    router = useRouter();
  } catch (e) {
    // Storybook / test environments may not mount the Next App Router; provide a fallback
    router = { back: () => (typeof window !== "undefined" ? window.history.back() : undefined) } as { back: () => void };
  }

  const [copied, setCopied] = useState(false);

  function handleReport() {
    const subject = encodeURIComponent("Error 404 en la aplicación: recurso no encontrado");
    const body = encodeURIComponent(
      `Página: ${typeof window !== "undefined" ? window.location.href : "(desconocida)"}%0D%0A\nPor favor describa lo que intentó hacer aquí...`
    );
    // Abrir cliente de correo con asunto y cuerpo
    window.location.href = `mailto:soporte@comisaria.local?subject=${subject}&body=${body}`;
  }

  async function handleCopyLink() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      // Fallback: select and prompt
      const el = document.createElement("textarea");
      el.value = window.location.href;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <main role="main" aria-labelledby="notfound-title" aria-describedby="notfound-desc" className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-12">
      <div className="max-w-4xl w-full rounded-2xl shadow-2xl bg-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
        {/* Ilustración */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <svg
            width="320"
            height="220"
            viewBox="0 0 320 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            className="transform transition-transform duration-500 hover:-translate-y-1"
          >
            <rect x="0" y="0" width="320" height="220" rx="16" fill="#F8FAFC" />
            <g transform="translate(36,28)">
              <path d="M20 160c26-30 54-46 86-46s60 16 86 46" stroke="#D1FAE5" strokeWidth="8" strokeLinecap="round" />
              <circle cx="92" cy="60" r="36" fill="#EFF6FF" />
              <text x="88" y="68" fontSize="36" fontWeight="800" fill="#0F172A">404</text>
              <g transform="translate(160,20)">
                <rect x="0" y="20" width="80" height="60" rx="8" fill="#FEF3C7" />
                <path d="M12 60h56" stroke="#F97316" strokeWidth="4" strokeLinecap="round" />
              </g>
            </g>
          </svg>
        </div>

        {/* Texto y acciones */}
        <section className="w-full md:w-1/2 text-center md:text-left">
          <h1 id="notfound-title" className="text-6xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700">Página no encontrada</h2>
          <p id="notfound-desc" className="mt-4 text-gray-600">Lo sentimos — la página que buscas no existe, fue movida o hubo un error tipográfico en la dirección.</p>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
            <Link href="/" className="inline-flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-md shadow-lg hover:from-blue-700 hover:to-indigo-700 transition">
              Ir al inicio
            </Link>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Volver
            </button>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center bg-gray-100 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-200"
            >
              {copied ? 'Enlace copiado' : 'Copiar enlace'}
            </button>

            <button
              onClick={handleReport}
              className="inline-flex items-center justify-center ml-0 sm:ml-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Reportar error
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>¿Necesitas ayuda inmediata? <a href="mailto:soporte@comisaria.local" className="text-blue-600 underline">Contacta soporte</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}

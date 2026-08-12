"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  function handleReport() {
    const subject = encodeURIComponent("Error 404 en la aplicación: recurso no encontrado");
    const body = encodeURIComponent(
      `Página: ${typeof window !== "undefined" ? window.location.href : "(desconocida)"}%0D%0A\nPor favor describa lo que intentó hacer aquí...`
    );
    // Abrir cliente de correo con asunto y cuerpo
    window.location.href = `mailto:soporte@comisaria.local?subject=${subject}&body=${body}`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <div className="max-w-3xl w-full rounded-lg shadow-lg bg-white p-8 flex flex-col md:flex-row items-center gap-8">
        {/* Ilustración */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <svg
            width="240"
            height="200"
            viewBox="0 0 240 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <rect width="240" height="200" rx="12" fill="#EFF6FF" />
            <g transform="translate(40,28)">
              <circle cx="62" cy="50" r="28" fill="#DBEAFE" />
              <path d="M12 148c18-18 36-28 62-28s44 10 62 28" stroke="#BFDBFE" strokeWidth="6" strokeLinecap="round" />
              <text x="56" y="58" fontSize="28" fontWeight="700" fill="#1E293B">404</text>
            </g>
          </svg>
        </div>

        {/* Texto y acciones */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl font-extrabold text-gray-900">404</h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-700">Página no encontrada</h2>
          <p className="mt-4 text-gray-600">Lo sentimos, el recurso que buscas no existe o fue movido. Verifica la dirección o vuelve al inicio.</p>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3">
            <Link href="/" className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700">
              Ir al inicio
            </Link>

            <button
              onClick={() => router.back()}
              className="inline-flex items-center justify-center border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Volver
            </button>

            <button
              onClick={handleReport}
              className="inline-flex items-center justify-center ml-0 sm:ml-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Reportar error
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-500">Si el problema persiste, contacta con el administrador.</p>
        </div>
      </div>
    </div>
  );
}

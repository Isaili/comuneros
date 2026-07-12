"use client";

import React from "react";
// Importación de los componentes principales
import Sidebar from "../components/Sidebar";
import DashboardView from "../components/DashboardView"; // Asegúrate de ajustar la ruta si está en otra carpeta

export default function PreviewPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50">
      {/* Menú lateral (Responsivo: Oculto en móviles con botón, fijo en escritorio) */}
      <Sidebar />

      {/* Contenedor del contenido principal */}
      {/* CORRECCIÓN RESPONSIVA: Añadimos pt-16 en pantallas pequeñas para que el botón flotante del Sidebar no tape el título del Dashboard */}
      <main className="flex-1 p-4 sm:p-8 pt-20 lg:pt-8 overflow-x-hidden">
        <DashboardView />
      </main>
    </div>
  );
}
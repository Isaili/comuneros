"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  FileText,
  Receipt,
  CircleDollarSign,
  ClipboardList,
  QrCode,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

// Opciones del menú originales
const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Comuneros", href: "/comuneros", icon: Users },
  { name: "Parcelas", href: "/parcelas", icon: FileText },
  { name: "Pagos", href: "/pagos", icon: Receipt },
  { name: "Multas y Asistencias", href: "/multas-asistencias", icon: CircleDollarSign },
  { name: "Reportes", href: "/reportes", icon: ClipboardList },
  { name: "Kiosco QR", href: "/kiosco-qr", icon: QrCode },
  { name: "Seguridad", href: "/seguridad", icon: ShieldCheck },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón de Hamburguesa para Móviles */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-[#1E4D3A] text-white shadow-md hover:bg-[#153629] transition-colors"
        aria-label="Abrir menú"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay para móviles */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Componente Sidebar con Degradado Verde Máximo al 80% */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 h-screen border-r border-gray-100 flex flex-col justify-between px-5 py-6 select-none transition-transform duration-300 ease-in-out
          bg-gradient-to-b from-white via-white via-40% to-[#1E4D3A]/80
          lg:translate-x-0 lg:static lg:flex
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Contenedor Superior (Logo + Menú) */}
        <div className="flex flex-col flex-1 min-h-0">
          
          {/* Encabezado Oficial */}
          <div className="flex items-center justify-between w-full px-1 mb-8">
            {/* Escudo México */}
            <div className="relative w-14 h-14 shrink-0">
              <img
                src="https://th.bing.com/th/id/R.1ec4f3cefeefdc9c8463c6fca2da4e63?rik=POmiAu2hUvchEQ&pid=ImgRaw&r=0"
                alt="Escudo Nacional de México"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Texto Central Oficial */}
            <div className="flex flex-col items-center text-center mx-1">
              <span className="text-[11px] font-serif font-bold text-gray-700 leading-tight tracking-wide">
                Casa de Bienes
              </span>
              <span className="text-[11px] font-serif font-bold text-gray-700 leading-tight tracking-wide">
                Comunales
              </span>
              <span className="text-sm font-serif font-extrabold text-[#1E4D3A] tracking-normal mt-0.5">
                Copainalá
              </span>
            </div>

            {/* Escudo Chiapas */}
            <div className="relative w-12 h-14 shrink-0">
              <img
                src="https://tse1.explicit.bing.net/th/id/OIP.8C8vXyoLrLsLUNeSI1cX2gAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="Escudo de Chiapas"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Navegación del Menú */}
          <nav className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href === "/dashboard" && pathname === "/");

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)} 
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 group ${
                    isActive
                      ? "bg-[#1E4D3A] text-white font-semibold shadow-md"
                      : "text-slate-700 hover:bg-black/5 hover:text-slate-900 font-medium"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${
                      isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700"
                    }`}
                  />
                  <span className="text-[14px] tracking-wide">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pie de página: Tarjeta de Administrador al 90% para contraste perfecto */}
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/90 backdrop-blur-md border border-white/80 hover:bg-white transition-colors cursor-pointer group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-3 min-w-0">
              {/* Avatar circular */}
              <div className="w-9 h-9 rounded-full bg-[#1E4D3A]/10 text-[#1E4D3A] font-bold text-xs flex items-center justify-center shrink-0 border border-[#1E4D3A]/30">
                AD
              </div>
              
              {/* Información */}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-gray-900 tracking-wide truncate">
                  Administrador
                </span>
                <span className="text-[10px] text-emerald-800 font-bold truncate mt-0.5">
                  Comisaría Ejidal
                </span>
              </div>
            </div>

            {/* Flecha desplegable */}
            <ChevronDown className="w-3.5 h-3.5 text-emerald-800 shrink-0 mr-1 transition-transform group-hover:translate-y-0.5" />
          </div>
        </div>

      </aside>
    </>
  );
}
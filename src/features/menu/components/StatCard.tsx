import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  iconBg: string; 
  iconColor: string; 
}

export default function StatCard({ title, value, subtext, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="group bg-white hover:bg-gray-100/70 p-4 rounded-xl border border-gray-100 hover:border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all duration-150 flex flex-col justify-between min-w-0 cursor-pointer">
      
      {/* Fila Superior: Icono y Título */}
      <div className="flex items-center gap-2 mb-2 min-w-0">
        <div className={`p-1.5 rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-105 ${iconBg} ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[11px] font-bold text-gray-400 tracking-wide truncate uppercase">
          {title}
        </span>
      </div>

      {/* Fila Inferior: Datos numéricos */}
      <div className="mt-1">
        <h3 className="text-xl font-extrabold text-gray-800 tracking-tight truncate group-hover:text-gray-900">
          {value}
        </h3>
        <p className="text-[10px] font-semibold text-gray-400 mt-0.5 truncate group-hover:text-gray-500">
          {subtext}
        </p>
      </div>

    </div>
  );
}
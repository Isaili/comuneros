import React from "react";
import { LucideIcon, ArrowDownRight, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;

  trend?: number;
}

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}: StatCardProps) {
  const tieneTrend = typeof trend === "number";
  const trendPositivo = tieneTrend && trend! >= 0;

  return (
    <div
      tabIndex={0}
      className="group relative flex min-w-0 cursor-pointer flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-[0_4px_10px_rgba(16,24,40,0.06),0_2px_4px_rgba(16,24,40,0.04)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E4D3A]/30"
    >
      
      <div className="mb-3 flex min-w-0 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${iconBg} ${iconColor}`}
          >
            <Icon className="h-4 w-4" strokeWidth={2.25} />
          </div>
          <span className="truncate text-[11px] font-bold uppercase tracking-wide text-gray-400">
            {title}
          </span>
        </div>

        {tieneTrend && (
          <span
            className={`flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
              trendPositivo
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {trendPositivo ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(trend!).toFixed(1)}%
          </span>
        )}
      </div>

    
      <div>
        <h3 className="truncate text-2xl font-extrabold tracking-tight text-gray-800 tabular-nums transition-colors group-hover:text-gray-900">
          {value}
        </h3>
        <p className="mt-1 truncate text-[11px] font-medium text-gray-400 transition-colors group-hover:text-gray-500">
          {subtext}
        </p>
      </div>

    
      <span
        className={`absolute inset-x-4 bottom-0 h-px scale-x-0 rounded-full opacity-0 transition-all duration-200 group-hover:scale-x-100 group-hover:opacity-100 ${iconBg}`}
      />
    </div>
  );
}
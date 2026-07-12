'use client';

import React from 'react';

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  suffix: string;
  trend: number[];
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 100;
  const h = 20;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-4" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#6EE7B7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / (max - min || 1)) * h;
        const isPeak = v === max;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isPeak ? 2.5 : 1.5}
            fill={isPeak ? '#E4C468' : '#6EE7B7'}
          />
        );
      })}
    </svg>
  );
}

export default function StatCard({ icon: Icon, label, value, suffix, trend }: StatCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-lg px-2 py-3.5 w-[140px] h-[160px] flex flex-col items-center justify-between text-center hover:bg-white/[0.07] transition-colors">
      <div className="w-6 h-6 rounded-full border border-[#E4C468]/40 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#E4C468]" />
      </div>
      <div className="flex flex-col items-center my-auto gap-0.5">
        <span className="text-[9px] font-bold text-white/60 tracking-widest uppercase leading-tight">
          {label}
        </span>
        <span className="text-2xl font-serif text-white leading-none font-semibold">
          {value}
        </span>
        <span className="text-[10px] text-white/50 leading-none">{suffix}</span>
      </div>
      <div className="w-full shrink-0 mt-1">
        <Sparkline data={trend} />
      </div>
    </div>
  );
}
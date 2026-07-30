"use client";

import React, { useState } from 'react';
import { X, CalendarPlus, MapPin, Clock, FileText, Hourglass } from 'lucide-react';
import { Reunion } from '../../types/types';

interface CrearReunionModalProps {
  onClose: () => void;
  onCrear: (reunion: Omit<Reunion, 'id' | 'estado'>) => void;
}

export const CrearReunionModal: React.FC<CrearReunionModalProps> = ({ onClose, onCrear }) => {
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [lugar, setLugar] = useState('');
  const [toleranciaMinutos, setToleranciaMinutos] = useState(15);
  const [errores, setErrores] = useState<Record<string, string>>({});

  const validar = () => {
    const nuevosErrores: Record<string, string> = {};
    if (!nombre.trim()) nuevosErrores.nombre = 'Ingresa el nombre de la asamblea.';
    if (!fecha) nuevosErrores.fecha = 'Selecciona una fecha.';
    if (!horaInicio) nuevosErrores.horaInicio = 'Selecciona una hora.';
    if (!lugar.trim()) nuevosErrores.lugar = 'Ingresa el lugar.';
    if (!toleranciaMinutos || toleranciaMinutos <= 0) nuevosErrores.toleranciaMinutos = 'Tolerancia inválida.';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validar()) return;
    onCrear({ nombre: nombre.trim(), fecha, horaInicio, lugar: lugar.trim(), toleranciaMinutos });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col text-gray-700 text-sm font-semibold">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
          <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <span className="p-1.5 bg-[#1E4D3A]/10 text-[#1E4D3A] rounded-lg">
              <CalendarPlus className="w-4 h-4" />
            </span>
            Nueva asamblea
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-3 h-3" /> Nombre de la asamblea
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Asamblea ordinaria - Agosto 2026"
              className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#1E4D3A]/20 focus:border-[#1E4D3A]/40 ${
                errores.nombre ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errores.nombre && <p className="text-[11px] text-red-600 font-semibold mt-1">{errores.nombre}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#1E4D3A]/20 focus:border-[#1E4D3A]/40 ${
                  errores.fecha ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errores.fecha && <p className="text-[11px] text-red-600 font-semibold mt-1">{errores.fecha}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Hora
              </label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#1E4D3A]/20 focus:border-[#1E4D3A]/40 ${
                  errores.horaInicio ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errores.horaInicio && <p className="text-[11px] text-red-600 font-semibold mt-1">{errores.horaInicio}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Lugar
            </label>
            <input
              type="text"
              value={lugar}
              onChange={(e) => setLugar(e.target.value)}
              placeholder="Ej. Salón ejidal principal"
              className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#1E4D3A]/20 focus:border-[#1E4D3A]/40 ${
                errores.lugar ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errores.lugar && <p className="text-[11px] text-red-600 font-semibold mt-1">{errores.lugar}</p>}
          </div>

          <div>
            <label className="text-xs text-gray-400 font-bold uppercase tracking-wide flex items-center gap-1.5">
              <Hourglass className="w-3 h-3" /> Tiempo estimado de tolerancia (minutos)
            </label>
            <input
              type="number"
              min={5}
              step={5}
              value={toleranciaMinutos}
              onChange={(e) => setToleranciaMinutos(Number(e.target.value))}
              className={`mt-1.5 w-full rounded-xl border px-3.5 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#1E4D3A]/20 focus:border-[#1E4D3A]/40 ${
                errores.toleranciaMinutos ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            <p className="text-[11px] text-gray-400 font-medium mt-1">
              Minutos de gracia después de la hora de inicio para registrar asistencia a tiempo.
            </p>
            {errores.toleranciaMinutos && <p className="text-[11px] text-red-600 font-semibold mt-1">{errores.toleranciaMinutos}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-600 transition-colors">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#1E4D3A] hover:bg-[#153629] text-white rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <CalendarPlus className="w-3.5 h-3.5" /> Crear asamblea
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
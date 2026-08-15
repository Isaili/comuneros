"use client";

import React, { useState } from 'react';
import { Leaf, Home, AlertTriangle, Clock } from 'lucide-react';
import { ConfiguracionSistema } from '../types/configuracion';
import { ConfirmationModal } from './ConfirmationModal';

interface CardsProps {
  configuracionInicial: ConfiguracionSistema;
  onGuardar: (campo: keyof ConfiguracionSistema, nuevoValor: number) => void;
}

export const ConfiguracionCards: React.FC<CardsProps> = ({ configuracionInicial, onGuardar }) => {
  const [valores, setValores] = useState<ConfiguracionSistema>(() => configuracionInicial);
  const [modalActivo, setModalActivo] = useState<{
    campo: keyof ConfiguracionSistema;
    titulo: string;
    valorAnterior: string;
    valorNuevo: string;
    nuevoValor: number;
  } | null>(null);

  const handleChange = (campo: keyof ConfiguracionSistema, valor: string) => {
    const num = parseFloat(valor) || 0;
    setValores((prev) => ({ ...prev, [campo]: num }));
  };

  const formatearValor = (campo: keyof ConfiguracionSistema, valor: number) => {
    if (campo === 'tiempoToleranciaDias') {
      return `${valor} días`;
    }

    return `$${valor.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
  };

  const abrirModalConfirmacion = (campo: keyof ConfiguracionSistema) => {
    const valorAnterior = formatearValor(campo, configuracionInicial[campo]);
    const valorNuevo = formatearValor(campo, valores[campo]);

    const titulos: Record<keyof ConfiguracionSistema, string> = {
      precioHectarea: 'Precio de predial por hectárea',
      precioLote: 'Precio de predial por lote',
      valorMultas: 'Valor de las multas',
      tiempoToleranciaDias: 'Tiempo de tolerancia',
    };

    setModalActivo({
      campo,
      titulo: titulos[campo],
      valorAnterior,
      valorNuevo,
      nuevoValor: valores[campo],
    });
  };

  const confirmarCambio = () => {
    if (!modalActivo) return;

    onGuardar(modalActivo.campo, modalActivo.nuevoValor);
    setModalActivo(null);
  };

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* 1. Precio por hectárea */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Leaf className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Precio de predial por hectárea</h4>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-gray-900 font-bold text-sm">$</span>
            <input
              type="text"
              value={valores.precioHectarea.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              onChange={(e) => handleChange('precioHectarea', e.target.value.replace(/,/g, ''))}
              className="w-full bg-slate-50/60 border border-gray-200/80 rounded-xl pl-8 pr-12 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-[#006837] focus:bg-white transition-all"
            />
            <span className="absolute right-3.5 text-xs font-semibold text-gray-400">MXN</span>
          </div>

          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            Precio de predial establecido por cada hectárea de terreno.
          </p>
        </div>

        <button
          onClick={() => abrirModalConfirmacion('precioHectarea')}
          className="w-full bg-[#006837] hover:bg-[#00522b] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>

      {/* 2. Precio del lote */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
              <Home className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Precio de predial por lote</h4>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-gray-900 font-bold text-sm">$</span>
            <input
              type="text"
              value={valores.precioLote.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              onChange={(e) => handleChange('precioLote', e.target.value.replace(/,/g, ''))}
              className="w-full bg-slate-50/60 border border-gray-200/80 rounded-xl pl-8 pr-12 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
            <span className="absolute right-3.5 text-xs font-semibold text-gray-400">MXN</span>
          </div>

          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            Precio fijo de predial establecido para cada lote.
          </p>
        </div>

        <button
          onClick={() => abrirModalConfirmacion('precioLote')}
          className="w-full bg-[#1b64da] hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>

      {/* 3. Valor de las multas */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Valor de las multas</h4>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-gray-900 font-bold text-sm">$</span>
            <input
              type="text"
              value={valores.valorMultas.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              onChange={(e) => handleChange('valorMultas', e.target.value.replace(/,/g, ''))}
              className="w-full bg-slate-50/60 border border-gray-200/80 rounded-xl pl-8 pr-12 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-rose-500 focus:bg-white transition-all"
            />
            <span className="absolute right-3.5 text-xs font-semibold text-gray-400">MXN</span>
          </div>

          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            Monto base para la generación de multas.
          </p>
        </div>

        <button
          onClick={() => abrirModalConfirmacion('valorMultas')}
          className="w-full bg-[#f4283b] hover:bg-red-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>

      {/* 4. Tiempo de tolerancia */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm">Tiempo de tolerancia</h4>
          </div>

          <div className="relative flex items-center">
            <input
              type="number"
              value={valores.tiempoToleranciaDias}
              onChange={(e) => handleChange('tiempoToleranciaDias', e.target.value)}
              className="w-full bg-slate-50/60 border border-gray-200/80 rounded-xl pl-4 pr-12 py-2.5 text-sm font-bold text-gray-900 outline-none focus:border-purple-600 focus:bg-white transition-all"
            />
            <span className="absolute right-3.5 text-xs font-semibold text-gray-400">días</span>
          </div>

          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            Días de tolerancia antes de aplicar multas.
          </p>
        </div>

        <button
          onClick={() => abrirModalConfirmacion('tiempoToleranciaDias')}
          className="w-full bg-[#6b3ba7] hover:bg-purple-800 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          Guardar cambios
        </button>
      </div>
    </div>

      <ConfirmationModal
        isOpen={Boolean(modalActivo)}
        title={modalActivo?.titulo ?? 'Confirmación'}
        valorAnterior={modalActivo?.valorAnterior ?? ''}
        valorNuevo={modalActivo?.valorNuevo ?? ''}
        onClose={() => setModalActivo(null)}
        onConfirm={confirmarCambio}
      />
    </>
  );
};
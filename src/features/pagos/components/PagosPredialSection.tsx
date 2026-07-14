"use client";

import React, { useState } from 'react';
import { Search, DollarSign, Receipt, Clock, CheckCircle2 } from 'lucide-react';
import { Parcela } from '@/features/parcelas/components/ParcelasList';
import { Lote } from '@/features/lotes/components/LotesList';
import { ProcesarPagoModal } from './ProcesarPagoModal';

// Datos dummy de ejemplo para visualizar el comportamiento de cobro
const INITIAL_PARCELAS: Parcela[] = [
  { id: 'p1', numero: 'Parcela 12', superficie: '2.50 ha', titularesCount: 1, propietarios: ['José Antonio Hernández'], estadoPredial: 'Pagar' },
  { id: 'p2', numero: 'Parcela 45', superficie: '5.00 ha', titularesCount: 2, propietarios: ['María Guadalupe Pérez'], estadoPredial: 'Pagado' },
];

const INITIAL_LOTES: Lote[] = [
  { id: 'l1', numero: 'Lote 03-A', folio: 'F-9921', superficie: '350 m²', propietarios: ['Carlos Mendoza'], estadoPredial: 'Pagar' },
  { id: 'l2', numero: 'Lote 14-B', folio: 'F-1024', superficie: '400 m²', propietarios: ['Laura Estela Gómez'], estadoPredial: 'Pagado' },
];

export const PagosPredialSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'parcelas' | 'lotes'>('parcelas');
  const [searchQuery, setSearchQuery] = useState('');
  const [parcelas, setParcelas] = useState<Parcela[]>(INITIAL_PARCELAS);
  const [lotes, setLotes] = useState<Lote[]>(INITIAL_LOTES);
  
  // Estados para el modal de pago
  const [selectedItem, setSelectedItem] = useState<{ type: 'parcela' | 'lote'; data: any } | null>(null);

  const handleOpenPago = (type: 'parcela' | 'lote', item: any) => {
    setSelectedItem({ type, data: item });
  };

  const handleConfirmarPago = (id: string, type: 'parcela' | 'lote') => {
    if (type === 'parcela') {
      setParcelas(prev => prev.map(p => p.id === id ? { ...p, estadoPredial: 'Pagado' } : p));
    } else {
      setLotes(prev => prev.map(l => l.id === id ? { ...l, estadoPredial: 'Pagado' } : l));
    }
    setSelectedItem(null);
  };

  // Filtros aplicados
  const filteredParcelas = parcelas.filter(p => 
    p.numero.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.propietarios[0]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLotes = lotes.filter(l => 
    l.numero.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.propietarios[0]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 space-y-6 w-full min-h-[600px]">
      
      {/* Encabezado Responsivo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-gray-900 flex items-center gap-2">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            Módulo de Pagos Prediales
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
            Administración, cálculo de recargos y cobro de derechos ejidales.
          </p>
        </div>

        {/* Buscador full-width en móviles y auto en tablet/desktop */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por número o propietario..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 sm:py-2 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#006837]/20 focus:border-[#006837] transition-all"
          />
        </div>
      </div>

      {/* Tabs / Pestañas de Selección (Equitativas en móvil) */}
      <div className="flex items-center gap-1 border-b border-gray-100 w-full">
        <button 
          onClick={() => { setActiveTab('parcelas'); setSearchQuery(''); }}
          className={`flex-1 md:flex-none text-center px-4 sm:px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'parcelas' ? 'border-[#006837] text-[#006837]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Predial Parcelas
        </button>
        <button 
          onClick={() => { setActiveTab('lotes'); setSearchQuery(''); }}
          className={`flex-1 md:flex-none text-center px-4 sm:px-5 py-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'lotes' ? 'border-[#006837] text-[#006837]' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Predial Lotes
        </button>
      </div>

      {/* RENDERIZADO DINÁMICO */}
      <div className="w-full">
        
        {/* ================= SECCIÓN PARCELAS ================= */}
        {activeTab === 'parcelas' && (
          <div>
            {/* Vista Mobile/Tablet: Lista de Cards (Oculta en md:) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {filteredParcelas.map((p) => {
                const isPagado = p.estadoPredial === 'Pagado';
                return (
                  <div key={p.id} className="bg-slate-50/50 border border-gray-100 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-gray-200 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">{p.numero}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-md ${
                          isPagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {isPagado ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {p.estadoPredial}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span>Superficie:</span>
                          <span className="font-semibold text-gray-700">{p.superficie}</span>
                        </div>
                        <div className="pt-1.5">
                          <span className="block mb-0.5 text-gray-400">Propietario(s):</span>
                          <span className="font-semibold text-gray-800 text-xs block truncate">{p.propietarios.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleOpenPago('parcela', p)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                        isPagado 
                          ? 'border border-gray-200 text-emerald-700 bg-white hover:bg-emerald-50/20' 
                          : 'bg-[#006837] hover:bg-[#00522b] text-white shadow-xs'
                      }`}
                    >
                      {isPagado ? 'Ver Recibo' : 'Pagar'}
                    </button>
                  </div>
                );
              })}
              {filteredParcelas.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400 text-xs font-medium">
                  No se encontraron parcelas.
                </div>
              )}
            </div>

            {/* Vista Desktop: Tabla tradicional (Oculta en pantallas pequeñas) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 px-3">Número Parcela</th>
                    <th className="pb-3 px-3">Superficie</th>
                    <th className="pb-3 px-3">Propietario</th>
                    <th className="pb-3 px-3">Estado</th>
                    <th className="pb-3 px-3 text-right">Acción de Pago</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                  {filteredParcelas.map((p) => {
                    const isPagado = p.estadoPredial === 'Pagado';
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-3 font-bold text-gray-900">{p.numero}</td>
                        <td className="py-4 px-3 text-gray-600">{p.superficie}</td>
                        <td className="py-4 px-3 text-gray-900">{p.propietarios.join(', ')}</td>
                        <td className="py-4 px-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            isPagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {isPagado ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {p.estadoPredial}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => handleOpenPago('parcela', p)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isPagado 
                                ? 'border border-gray-200 text-emerald-700 bg-emerald-50/20 hover:bg-emerald-50/40' 
                                : 'bg-[#006837] hover:bg-[#00522b] text-white'
                            }`}
                          >
                            {isPagado ? 'Ver Recibo' : 'Pagar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= SECCIÓN LOTES ================= */}
        {activeTab === 'lotes' && (
          <div>
            {/* Vista Mobile/Tablet: Lista de Cards (Oculta en md:) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
              {filteredLotes.map((l) => {
                const isPagado = l.estadoPredial === 'Pagado';
                return (
                  <div key={l.id} className="bg-slate-50/50 border border-gray-100 rounded-xl p-4 flex flex-col justify-between space-y-4 hover:border-gray-200 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">{l.numero}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-1 rounded-md ${
                          isPagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                        }`}>
                          {isPagado ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {l.estadoPredial}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        <div className="flex justify-between py-1 border-b border-gray-100">
                          <span>Folio:</span>
                          <span className="font-mono font-semibold text-gray-700">{l.folio}</span>
                        </div>
                        <div className="pt-1.5">
                          <span className="block mb-0.5 text-gray-400">Propietario(s):</span>
                          <span className="font-semibold text-gray-800 text-xs block truncate">{l.propietarios.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleOpenPago('lote', l)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                        isPagado 
                          ? 'border border-gray-200 text-emerald-700 bg-white hover:bg-emerald-50/20' 
                          : 'bg-[#006837] hover:bg-[#00522b] text-white shadow-xs'
                      }`}
                    >
                      {isPagado ? 'Ver Recibo' : 'Pagar'}
                    </button>
                  </div>
                );
              })}
              {filteredLotes.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400 text-xs font-medium">
                  No se encontraron lotes.
                </div>
              )}
            </div>

            {/* Vista Desktop: Tabla tradicional (Oculta en pantallas pequeñas) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-3 px-3">Número Lote</th>
                    <th className="pb-3 px-3">Folio</th>
                    <th className="pb-3 px-3">Propietario</th>
                    <th className="pb-3 px-3">Estado</th>
                    <th className="pb-3 px-3 text-right">Acción de Pago</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700 font-semibold">
                  {filteredLotes.map((l) => {
                    const isPagado = l.estadoPredial === 'Pagado';
                    return (
                      <tr key={l.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-3 font-bold text-gray-900">{l.numero}</td>
                        <td className="py-4 px-3 font-mono text-gray-500">{l.folio}</td>
                        <td className="py-4 px-3 text-gray-900">{l.propietarios.join(', ')}</td>
                        <td className="py-4 px-3">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            isPagado ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {isPagado ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {l.estadoPredial}
                          </span>
                        </td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => handleOpenPago('lote', l)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isPagado 
                                ? 'border border-gray-200 text-emerald-700 bg-emerald-50/20 hover:bg-emerald-50/40' 
                                : 'bg-[#006837] hover:bg-[#00522b] text-white'
                            }`}
                          >
                            {isPagado ? 'Ver Recibo' : 'Pagar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modal de Pago / Recibo */}
      {selectedItem && (
        <ProcesarPagoModal 
          type={selectedItem.type}
          item={selectedItem.data}
          onClose={() => setSelectedItem(null)}
          onConfirmarPago={(id) => handleConfirmarPago(id, selectedItem.type)}
        />
      )}
    </div>
  );
};
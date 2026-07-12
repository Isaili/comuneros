"use client";
import React, { useState } from 'react';
import { Calendar, Heart, MapPin, Phone, Mail, FileText, QrCode, Edit2, Trash2 } from 'lucide-react';
import { Comunero } from '@/features/comuneros/types/types';

interface DetailProps {
  comunero: Comunero;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ComuneroDetail: React.FC<DetailProps> = ({ comunero, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'parcelas' | 'lotes'>('parcelas');

  const parcelas = comunero.terrenos.filter(t => t.tipo === 'Parcela');
  const lotes = comunero.terrenos.filter(t => t.tipo === 'Lote');

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 space-y-8 animate-fade-in">
      
      {/* Cabecera del Perfil Detallado */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="flex items-center gap-5">
          <img src={comunero.fotografia} alt={comunero.nombre} className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-100 shadow-md" />
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">{comunero.nombre} {comunero.apellidos}</h2>
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Activo</span>
            </div>
            
            {/* Campos de datos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-medium text-gray-500 pt-1">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {comunero.fechaNacimiento} ({comunero.edad} años)</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {comunero.telefono}</div>
              <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-gray-400" /> {comunero.estadoCivil}</div>
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {comunero.correo}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {comunero.direccion}</div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> Reg: {comunero.fechaRegistro}</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> Colonia: {comunero.colonia}</div>
              <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" /> Folio: {comunero.folioComunero}</div>
            </div>
          </div>
        </div>

        {/* Acciones de Ficha */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto justify-end">
          <button onClick={() => onEdit(comunero.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 transition-colors">
            <Edit2 className="w-3.5 h-3.5" /> Editar
          </button>
          <button onClick={() => onDelete(comunero.id)} className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 bg-white hover:bg-red-50 rounded-lg text-xs font-bold text-red-600 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />baja
          </button>
        </div>
      </div>

      {/* Grid Central: Fotos y QR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Fotografía</p>
          <img src={comunero.fotografia} alt="Identificación" className="w-32 h-32 rounded-xl object-cover shadow-sm border border-gray-200" />
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Código QR</p>
          <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-inner">
            <img src={comunero.qrCode} alt="Código QR" className="w-28 h-28 object-contain" />
          </div>
          <span className="text-[11px] font-extrabold text-[#006837] tracking-wider mt-2 bg-emerald-50 px-2 py-0.5 rounded">
            {comunero.folioComunero}
          </span>
        </div>
      </div>

      {/* Sección Terrenos Asociados */}
      <div className="space-y-4 pt-2">
        <h4 className="font-bold text-gray-900 text-sm">Terrenos asociados</h4>
        
        {/* Tabs de Selección */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <button 
            onClick={() => setActiveTab('parcelas')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'parcelas' ? 'bg-[#006837] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Parcelas ({parcelas.length})
          </button>
          <button 
            onClick={() => setActiveTab('lotes')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'lotes' ? 'bg-[#006837] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Lotes ({lotes.length})
          </button>
        </div>

        {/* Tabla de Terrenos Filtrada */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="text-gray-400 font-bold border-b border-gray-100">
                <th className="pb-2">Tipo</th>
                <th className="pb-2">Número</th>
                <th className="pb-2">Folio</th>
                {activeTab === 'parcelas' && <th className="pb-2">Certificado</th>}
                <th className="pb-2">Superficie</th>
                <th className="pb-2">Ubicación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
              {(activeTab === 'parcelas' ? parcelas : lotes).map((t, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50">
                  <td className="py-2.5">{t.tipo}</td>
                  <td className="py-2.5">{t.numero}</td>
                  <td className="py-2.5">{t.folio}</td>
                  {activeTab === 'parcelas' && <td className="py-2.5 text-gray-900 font-semibold">{t.certificado || '—'}</td>}
                  <td className="py-2.5">{t.superficie}</td>
                  <td className="py-2.5 text-gray-500">{t.ubicacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
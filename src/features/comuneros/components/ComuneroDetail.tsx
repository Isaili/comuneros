"use client";

import React, { useState } from 'react';
import { Calendar, Heart, MapPin, Phone, FileText, Edit2, Trash2, UserCheck, UserPlus, QrCode } from 'lucide-react';
import { Comunero } from '@/features/comuneros/types/types';

interface DetailProps {
  comunero: Comunero | any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// Función auxiliar para formatear fechas de YYYY-MM-DD a DD/MM/YYYY de forma segura
function formatFecha(fechaRaw?: string | null): string {
  if (!fechaRaw) return '—';
  const cleanStr = String(fechaRaw).trim().split('T')[0];
  const parts = cleanStr.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  return cleanStr || '—';
}

// Función para calcular la edad 
function calcularEdad(fechaNacimientoRaw?: string | null): string | null {
  if (!fechaNacimientoRaw) return null;
  const birthDate = new Date(fechaNacimientoRaw);
  if (isNaN(birthDate.getTime())) return null;
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? `${age} años` : null;
}

export const ComuneroDetail: React.FC<DetailProps> = ({ comunero, onEdit, onDelete }) => {
  const [activeTab, setActiveTab] = useState<'parcelas' | 'lotes'>('parcelas');
  const [imgError, setImgError] = useState(false);

  if (!comunero) return null;

  // Extracción segura de propiedades (mappea camelCase backend y español frontend)
  const id = comunero.id ?? '';
  const nombre = comunero.nombre ?? comunero.firstName ?? '';
  const apellidoPaterno = comunero.apellidoPaterno ?? comunero.paternalLastName ?? comunero.apellidos ?? '';
  const apellidoMaterno = comunero.apellidoMaterno ?? comunero.maternalLastName ?? '';
  const nombreCompleto = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();

  const foto = comunero.fotografia ?? comunero.photo ?? null;
  const telefono = comunero.telefono ?? comunero.phone ?? '—';
  const direccion = comunero.direccion ?? comunero.address ?? '—';
  const vecindario = comunero.vecindario ?? comunero.neighborhood ?? comunero.colonia ?? '—';
  const estadoCivil = comunero.estadoCivil ?? comunero.maritalStatus ?? '—';
  const tipo = comunero.tipo ?? comunero.personType ?? 'COMMUNER';

  // Fechas y Folio
  const rawFechaRegistro = comunero.fechaRegistro ?? comunero.communityMemberSince ?? comunero.createdAt;
  const fechaRegistroFormatted = formatFecha(rawFechaRegistro);

  const rawFechaNacimiento = comunero.fechaNacimiento ?? comunero.birthDate;
  const fechaNacimientoFormatted = formatFecha(rawFechaNacimiento);
  const edadCalculada = comunero.edad ? `${comunero.edad} años` : calcularEdad(rawFechaNacimiento);

  const folio = comunero.folioComunero ?? comunero.folio ?? id.substring(0, 8).toUpperCase();

  // QR Code: Usa la URL del backend o genera uno dinámico con el folio/ID usando QuickChart API
  const qrUrl = comunero.qrCode || comunero.qr_code || `https://quickchart.io/qr?text=${encodeURIComponent(folio)}&size=200`;

  // Manejo de terrenos (evita errores si terrenos viene undefined)
  const terrenos = Array.isArray(comunero.terrenos) ? comunero.terrenos : [];
  const parcelas = terrenos.filter((t: any) => t.tipo === 'Parcela' || t.type === 'PARCEL');
  const lotes = terrenos.filter((t: any) => t.tipo === 'Lote' || t.type === 'LOT');

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8 space-y-8 animate-fade-in">
      {/* Header Principal */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
        <div className="flex items-center gap-5">
          {foto && !imgError ? (
            <img
              src={foto}
              alt={nombreCompleto}
              onError={() => setImgError(true)}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-gray-100 shadow-md shrink-0"
            />
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-[#006837]/10 text-[#006837] flex items-center justify-center font-bold text-2xl border-2 border-gray-100 shadow-md shrink-0">
              {`${nombre?.[0] ?? ''}${apellidoPaterno?.[0] ?? ''}`.toUpperCase() || '?'}
            </div>
          )}

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-gray-900">{nombreCompleto}</h2>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold ${
                tipo === 'comunero' || tipo === 'COMMUNER' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}>
                {tipo === 'comunero' || tipo === 'COMMUNER' ? (
                  <><UserCheck className="w-3 h-3" /> Comunero</>
                ) : (
                  <><UserPlus className="w-3 h-3" /> Avecindado</>
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs font-medium text-gray-500 pt-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                {fechaNacimientoFormatted} {edadCalculada ? `(${edadCalculada})` : ''}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400 shrink-0" /> {telefono}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> {direccion}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400 shrink-0" /> Reg: {fechaRegistroFormatted}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0" /> Vecindario/Colonia: {vecindario}
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400 shrink-0" /> Folio: {folio}
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => onEdit(id)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-lg text-xs font-bold text-gray-700 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" /> Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 bg-white hover:bg-red-50 rounded-lg text-xs font-bold text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Baja
          </button>
        </div>
      </div>

      {/* Grid de Fotografía y QR */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Fotografía</p>

          <div className="flex-1 flex items-center justify-center">
            {foto && !imgError ? (
              <img
                src={foto}
                alt="Identificación"
                className="w-32 h-32 rounded-xl object-cover shadow-sm border border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-gray-200/60 flex items-center justify-center text-gray-400 font-bold text-xl border border-gray-200">
                Sin foto
              </div>
            )}
          </div>

          <span className="text-[11px] font-extrabold tracking-wider mt-2 px-2.5 py-1 rounded invisible select-none">
            FOLIO: {folio}
          </span>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col items-center text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            Código QR
          </p>

          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-2.5 rounded-xl border border-gray-200 shadow-inner">
              <img src={qrUrl} alt={`Código QR - ${folio}`} className="w-28 h-28 object-contain" />
            </div>
          </div>

          <span className="text-[11px] font-extrabold text-[#006837] tracking-wider mt-2 bg-emerald-50 px-2.5 py-1 rounded">
            FOLIO: {folio}
          </span>
        </div>
      </div>

      {/* Tabla de Terrenos Asociados */}
      <div className="space-y-4 pt-2">
        <h4 className="font-bold text-gray-900 text-sm">Terrenos asociados</h4>

        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('parcelas')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'parcelas'
                ? 'bg-[#006837] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Parcelas ({parcelas.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lotes')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'lotes'
                ? 'bg-[#006837] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Lotes ({lotes.length})
          </button>
        </div>

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
              {(activeTab === 'parcelas' ? parcelas : lotes).length > 0 ? (
                (activeTab === 'parcelas' ? parcelas : lotes).map((t: any, idx: number) => (
                  <tr key={t.id ?? idx} className="hover:bg-gray-50/50">
                    <td className="py-2.5">{t.tipo ?? t.type ?? activeTab}</td>
                    <td className="py-2.5">{t.numero ?? t.number ?? '—'}</td>
                    <td className="py-2.5">{t.folio ?? '—'}</td>
                    {activeTab === 'parcelas' && (
                      <td className="py-2.5 text-gray-900 font-semibold">
                        {t.certificado ?? t.certificate ?? '—'}
                      </td>
                    )}
                    <td className="py-2.5">{t.superficie ?? t.surface ?? '—'}</td>
                    <td className="py-2.5 text-gray-500">{t.ubicacion ?? t.location ?? '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={activeTab === 'parcelas' ? 6 : 5}
                    className="py-6 text-center text-gray-400 font-normal"
                  >
                    No hay {activeTab} registradas para este comunero.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
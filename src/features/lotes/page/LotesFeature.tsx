"use client";

import React, { useState } from 'react';
import { Layers, Search, MapPin, UserPlus, ArrowRightLeft, UserCheck } from 'lucide-react';
import { Lote, PropietarioHistoricoLote } from '../types/typesLotes';
import { Comunero } from '../../comuneros/types/types';

// Importamos únicamente el componente del modal
import AsignarTitularLoteModal from '../components/AsignarTitularLoteModal';

import { 
  TraspasarLoteModal, 
  DatosTraspasoLotePayload 
} from '../components/TraspasarLoteModal';

export interface TitularLoteAsignado {
  nombreCompleto: string;
  certificado: string;
  calidadAgraria: string;
  actoJuridico: string;
}

const MOCK_COMUNEROS: Comunero[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'Gómez',
    tipo: 'comunero',
    estadoCivil: 'casado',
    fotografia: '',
    vecindario: 'Barrio Centro',
    activo: true, 
    fechaRegistro: '2023-01-01',
    telefono: '5551234567',
    fechaNacimiento: '1985-05-12',
    qrCode: 'QR-001',
  },
  {
    id: '2',
    nombre: 'María',
    apellidoPaterno: 'López',
    apellidoMaterno: 'Hernández',
    tipo: 'avecindado',
    estadoCivil: 'soltero',
    fotografia: '',
    vecindario: 'San Mateo',
    activo: true, 
    fechaRegistro: '2023-03-15',
    telefono: '5559876543',
    fechaNacimiento: '1990-08-22',
    qrCode: 'QR-002',
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellidoPaterno: 'Sánchez',
    apellidoMaterno: 'Ruiz',
    tipo: 'comunero',
    estadoCivil: 'union_libre',
    fotografia: '',
    vecindario: 'Santa María',
    activo: true, 
    fechaRegistro: '2022-11-10',
    telefono: '5554567890',
    fechaNacimiento: '1978-12-05',
    qrCode: 'QR-003',
  },
];

const INITIAL_LOTES: Lote[] = [
  {
    id: 'lote-1',
    numeroLote: 'LOTE-101',
    folioInterno: 'FOL-001',
    largo: 25,
    ancho: 20,
    superficieM2: 500,
    fechaRegistro: '2024-01-15',
    observaciones: 'Sin novedades',
    estadoPredial: 'Pagado',
    propietario: 'Juan Pérez Gómez',
    certificado: 'CERT-FOL-001',
    calidadAgraria: 'Comunero',
    actoJuridico: 'Asignación Directa',
    ubicacion: 'Zona Norte - Sector A',
    estatus: 'asignado',
    historialPropietarios: [
      {
        nombre: 'Sin Propietario Anterior',
        certificado: 'N/A',
        fechaAdquisicion: '2024-01-15',
        fechaCesion: '2024-01-15',
        actoJuridico: 'Asignación Directa',
        adquirente: 'Juan Pérez Gómez'
      }
    ],
    historialPrediales: []
  },
  {
    id: 'lote-2',
    numeroLote: 'LOTE-102',
    folioInterno: 'FOL-002',
    largo: 30,
    ancho: 25,
    superficieM2: 750,
    fechaRegistro: '2024-02-01',
    observaciones: 'Disponible para asignación',
    estadoPredial: 'Pagar',
    propietario: '',
    certificado: '',
    calidadAgraria: '',
    actoJuridico: '',
    ubicacion: 'Zona Sur - Sector B',
    estatus: 'disponible',
    historialPropietarios: [],
    historialPrediales: []
  }
];

export const LotesFeature: React.FC = () => {
  const [lotes, setLotes] = useState<Lote[]>(INITIAL_LOTES);
  const [busqueda, setBusqueda] = useState<string>('');
  const [loteSeleccionadoAsignar, setLoteSeleccionadoAsignar] = useState<Lote | null>(null);
  const [loteSeleccionadoTraspasar, setLoteSeleccionadoTraspasar] = useState<Lote | null>(null);

  const lotesFiltrados = lotes.filter(l => 
    l.numeroLote.toLowerCase().includes(busqueda.toLowerCase()) ||
    l.folioInterno.toLowerCase().includes(busqueda.toLowerCase()) ||
    (l.propietario && l.propietario.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const handleAsignarTitular = (datos: TitularLoteAsignado) => {
    if (!loteSeleccionadoAsignar) return;

    const hoy = new Date().toISOString().split('T')[0];

    const nuevaTransaccion: PropietarioHistoricoLote = {
      nombre: 'Ninguno',
      certificado: 'N/A',
      fechaAdquisicion: hoy,
      fechaCesion: hoy,
      actoJuridico: datos.actoJuridico,
      adquirente: datos.nombreCompleto
    };

    setLotes(prev => prev.map(l => {
      if (l.id === loteSeleccionadoAsignar.id) {
        return {
          ...l,
          propietario: datos.nombreCompleto,
          certificado: datos.certificado,
          calidadAgraria: datos.calidadAgraria,
          actoJuridico: datos.actoJuridico,
          estatus: 'asignado',
          historialPropietarios: [nuevaTransaccion, ...(l.historialPropietarios || [])]
        };
      }
      return l;
    }));

    setLoteSeleccionadoAsignar(null);
  };

  const handleTraspasarLote = (datos: DatosTraspasoLotePayload) => {
    if (!loteSeleccionadoTraspasar) return;

    const nombresNuevos = datos.nuevosPropietarios.map(p => p.nombre).join(' / ');
    const certificadosNuevos = datos.nuevosPropietarios.map(p => p.certificado).join(' / ');

    const nuevaTransaccion: PropietarioHistoricoLote = {
      nombre: loteSeleccionadoTraspasar.propietario || 'Sin Titular',
      certificado: loteSeleccionadoTraspasar.certificado || 'Sin Certificado',
      fechaAdquisicion: loteSeleccionadoTraspasar.fechaRegistro,
      fechaCesion: datos.fecha,
      actoJuridico: datos.actoJuridico,
      adquirente: nombresNuevos
    };

    setLotes(prev => prev.map(l => {
      if (l.id === loteSeleccionadoTraspasar.id) {
        return {
          ...l,
          propietario: nombresNuevos,
          certificado: certificadosNuevos,
          actoJuridico: datos.actoJuridico,
          estatus: 'asignado',
          historialPropietarios: [nuevaTransaccion, ...(l.historialPropietarios || [])]
        };
      }
      return l;
    }));

    setLoteSeleccionadoTraspasar(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-700 rounded-xl">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Gestión de Lotes Comunales</h1>
            <p className="text-xs text-gray-500 font-medium">Asignación, propiedad y control de traspasos</p>
          </div>
        </div>

        {/* Buscador */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar lote, folio o titular..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid de Lotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lotesFiltrados.map((lote) => {
          const estaAsignado = Boolean(lote.propietario && lote.propietario.trim() !== '');

          return (
            <div key={lote.id} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Folio: {lote.folioInterno}</span>
                  <h3 className="text-base font-bold text-gray-900">{lote.numeroLote}</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  estaAsignado ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  {estaAsignado ? 'Asignado' : 'Disponible'}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{lote.ubicacion || 'Sin ubicación registrada'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-bold text-gray-800">{lote.propietario || 'Sin titular asignado'}</span>
                </div>
                <div className="text-[11px] text-gray-400">
                  Dimensiones: {lote.largo}m x {lote.ancho}m ({lote.superficieM2} m²)
                </div>
              </div>

              {/* Acciones */}
              <div className="pt-2 flex gap-2 border-t border-gray-50">
                {!estaAsignado ? (
                  <button
                    onClick={() => setLoteSeleccionadoAsignar(lote)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Asignar Titular
                  </button>
                ) : (
                  <button
                    onClick={() => setLoteSeleccionadoTraspasar(lote)}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" /> Traspasar
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modales */}
      {loteSeleccionadoAsignar && (
        <AsignarTitularLoteModal
          comunerosRegistrados={MOCK_COMUNEROS}
          onClose={() => setLoteSeleccionadoAsignar(null)}
          onAsignar={(comuneroId, nombreCompleto) => {
            handleAsignarTitular({
              nombreCompleto,
              certificado: 'PENDIENTE',
              calidadAgraria: 'Comunero',
              actoJuridico: 'Asignación Directa'
            });
          }}
        />
      )}

      {loteSeleccionadoTraspasar && (
        <TraspasarLoteModal
          lote={loteSeleccionadoTraspasar}
          comunerosRegistrados={MOCK_COMUNEROS}
          onClose={() => setLoteSeleccionadoTraspasar(null)}
          onConfirmar={handleTraspasarLote}
        />
      )}
    </div>
  );
};

export default LotesFeature;
"use client";

import React, { useState } from 'react';

import { ParcelasHeader } from '../components/ParcelasHeader';
import { ParcelasList } from '../components/ParcelasList';
import { ParcelaDetail } from '../components/ParcelaDetail';
import { AgregarParcelaForm } from '../components/AgregarParcelaForm'; 
import { TraspasarParcelaModal } from '../components/TraspasarParcelaModal'; 
import { Comunero } from '../../comuneros/types/types'; 

import { Parcela, PropietarioHistorico } from '../types/typesParcela'; 

// Tipamos la payload que entrega el TraspasarParcelaModal
interface DatosTraspasoPayload {
  nuevosPropietarios?: Array<{
    nombre?: string;
    nombreCompleto?: string;
    certificado?: string;
    porcentaje?: number;
  }>;
  adquirentes?: Array<{
    nombre?: string;
    nombreCompleto?: string;
    certificado?: string;
    porcentaje?: number;
  }>;
  actoJuridico?: string;
  motivo?: string;
  fecha?: string;
}

const MOCK_PARCELAS: Parcela[] = [
  { id: '1', numero: 'P-001', superficie: '2.50 ha', titularesCount: 2, propietarios: ['José Antonio Hernández López', 'María Guadalupe Pérez Martínez'], estadoPredial: 'Pagado', historialPropietarios: [], historialPrediales: [] },
  { id: '2', numero: 'P-002', superficie: '1.75 ha', titularesCount: 1, propietarios: ['José Antonio Hernández López'], estadoPredial: 'Pagado', historialPropietarios: [], historialPrediales: [] },
  { id: '3', numero: 'P-003', superficie: '3.20 ha', titularesCount: 3, propietarios: ['María Guadalupe Pérez Martínez', 'Isabel Hernández López'], estadoPredial: 'Pagar', historialPropietarios: [], historialPrediales: [] },
];

const MOCK_COMUNEROS_REGISTRADOS: Comunero[] = [
  {
    id: '1',
    nombre: 'Isabel',
    apellidos: 'Hernández López',
    tipo: 'comunero',
    fechaNacimiento: '15/03/1980',
    edad: 46,
    estadoCivil: 'Casado',
    direccion: 'Calle Miguel Hidalgo #123',
    colonia: 'Santa Ana',
    telefono: '961 123 4567',
    fechaRegistro: '10 de enero de 2010',
    folioComunero: 'COM-0042',
    fotografia: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COM-0042',
    activo: true,
    terrenos: []
  },
  {
    id: '2',
    nombre: 'José Antonio',
    apellidos: 'Hernández López',
    tipo: 'avecindado',
    fechaNacimiento: '15/03/1980',
    edad: 46,
    estadoCivil: 'Casado',
    direccion: 'Calle Miguel Hidalgo #123',
    colonia: 'Centro',
    telefono: '961 123 4567',
    fechaRegistro: '10 de enero de 2010',
    folioComunero: 'COM-0043',
    fotografia: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COM-0043',
    activo: true,
    terrenos: []
  },
  {
    id: '3',
    nombre: 'María Guadalupe',
    apellidos: 'Pérez Martínez',
    tipo: 'comunero',
    fechaNacimiento: '22/07/1985',
    estadoCivil: 'Casado',
    edad: 40,
    direccion: 'Av. Central Oriente #45',
    colonia: 'San José',
    telefono: '961 987 6543',
    fechaRegistro: '15 de marzo de 2014',
    folioComunero: 'COM-0089',
    fotografia: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COM-0089',
    activo: true,
    terrenos: []
  }
];

export const ParcelasFeature: React.FC = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>(MOCK_PARCELAS);
  const [comuneros] = useState<Comunero[]>(MOCK_COMUNEROS_REGISTRADOS);
  
  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [parcelaATraspasar, setParcelaATraspasar] = useState<Parcela | null>(null);
  const [parcelaAEditar, setParcelaAEditar] = useState<Parcela | null>(null);

  const handleGuardarParcela = (datosFormulario: Partial<Parcela> & { titulares?: Array<{ nombreCompleto: string }> }) => {
    const rawSuperficie = datosFormulario.superficie || '';
    const superficieNumerica = Number(rawSuperficie.replace(/[^\d.]/g, ''));
    const formatoSuperficie = isNaN(superficieNumerica) || superficieNumerica === 0 
      ? '0.00 ha' 
      : `${superficieNumerica.toFixed(2)} ha`;

    if (parcelaAEditar) {
      setParcelas(prev => prev.map(p => {
        if (p.id === parcelaAEditar.id) {
          return {
            ...p,
            numero: datosFormulario.numero || datosFormulario.folioInterno || p.numero,
            superficie: rawSuperficie.includes('ha') ? rawSuperficie : formatoSuperficie,
            titularesCount: datosFormulario.titularesCount || datosFormulario.titulares?.length || p.titularesCount,
            propietarios: datosFormulario.propietarios || (datosFormulario.titulares?.map(t => t.nombreCompleto) ?? p.propietarios),
            estadoPredial: datosFormulario.estadoPredial || p.estadoPredial,
            historialPropietarios: datosFormulario.historialPropietarios || p.historialPropietarios,
            historialPrediales: datosFormulario.historialPrediales || p.historialPrediales
          };
        }
        return p;
      }));
      setParcelaAEditar(null);
    } else {
      const nuevaParcelaFormateada: Parcela = {
        id: Date.now().toString(),
        numero: datosFormulario.numero || datosFormulario.folioInterno || 'P-000',
        superficie: formatoSuperficie,
        titularesCount: datosFormulario.titularesCount || datosFormulario.titulares?.length || 1,
        propietarios: datosFormulario.propietarios || (datosFormulario.titulares?.map(t => t.nombreCompleto) ?? ['Sin propietario asignado']),
        estadoPredial: datosFormulario.estadoPredial || 'Pagar',
        historialPropietarios: datosFormulario.historialPropietarios || [],
        historialPrediales: datosFormulario.historialPrediales || []
      };
      setParcelas(prev => [nuevaParcelaFormateada, ...prev]);
    }

    setIsAddModalOpen(false);
  };

  const handleEditarClick = (parcela: Parcela) => {
    setParcelaAEditar(parcela);
    setIsAddModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsAddModalOpen(false);
    setParcelaAEditar(null);
  };

  // Función ajustada con contrato estricto
  const handleEjecutarTraspaso = (datosTraspaso: DatosTraspasoPayload) => {
    if (!parcelaATraspasar) return;

    const listaNuevos = datosTraspaso.nuevosPropietarios || datosTraspaso.adquirentes || [];

    const adquirentesValidos = listaNuevos
      .map(n => ({
        nombre: n.nombre || n.nombreCompleto || '',
        certificado: n.certificado || 'CERT-S/N',
        porcentaje: n.porcentaje ?? 100
      }))
      .filter(n => n.nombre.trim() !== '');

    if (adquirentesValidos.length === 0) {
      alert("Error: Debe seleccionar adquirentes válidos para guardar.");
      return;
    }

    const fechaOperacion = datosTraspaso.fecha || new Date().toLocaleDateString('es-MX');
    const acto = datosTraspaso.actoJuridico || datosTraspaso.motivo || 'Cesión de derechos';

    setParcelas(prev => prev.map(p => {
      if (p.id !== parcelaATraspasar.id) return p;

      const fechaOrigen = "01/01/2018";

      const dueñosSalientesHistoricos: PropietarioHistorico[] = (p.propietarios || []).map(nombreProp => ({
        nombre: nombreProp,
        certificado: "CERT-ANTECEDENTE",
        fechaAdquisicion: fechaOrigen,
        fechaCesion: fechaOperacion,
        actoJuridico: acto,
        adquirente: adquirentesValidos.map(n => `${n.nombre} (${n.porcentaje}%)`).join(', ')
      }));

      const historialActualizado = [
        ...dueñosSalientesHistoricos,
        ...(p.historialPropietarios || [])
      ];

      const nuevosRegistrosCronologicos: PropietarioHistorico[] = adquirentesValidos.map(a => ({
        nombre: a.nombre,
        certificado: a.certificado,
        fechaAdquisicion: fechaOperacion,
        fechaCesion: "— (Actual)",
        actoJuridico: acto,
        adquirente: "Titular Activo"
      }));

      return {
        ...p,
        propietarios: adquirentesValidos.map(n => n.nombre),
        titularesCount: adquirentesValidos.length,
        historialPropietarios: [...nuevosRegistrosCronologicos, ...historialActualizado]
      };
    }));

    setParcelaATraspasar(null);
    setSelectedParcela(null);
  };

  const filteredParcelas = parcelas.filter(p => 
    p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.propietarios.some((prop: string) => prop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      
      <ParcelasHeader 
        onSearchChange={setSearchTerm} 
        onAddClick={() => {
          setParcelaAEditar(null);
          setIsAddModalOpen(true);
        }}
      />

      <div className="w-full">
        {filteredParcelas.length > 0 ? (
          <ParcelasList 
            parcelas={filteredParcelas}
            selectedId={selectedParcela?.id ?? ""} 
            onSelect={setSelectedParcela}
            onTraspasar={setParcelaATraspasar}
            onEditar={handleEditarClick}
          />
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-12 text-center text-gray-400 font-medium text-sm shadow-sm">
            No se encontraron parcelas que coincidan con la búsqueda.
          </div>
        )}
      </div>

      {selectedParcela && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedParcela(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
              <h3 className="text-base font-bold text-gray-800">Expediente de la Parcela</h3>
              <button 
                onClick={() => setSelectedParcela(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-colors"
              >
                ✕ Cerrar
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <ParcelaDetail parcela={selectedParcela} />
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AgregarParcelaForm 
          comunerosRegistrados={comuneros}
          onClose={handleCloseForm}
          onGuardar={handleGuardarParcela}
          parcelaAEditar={parcelaAEditar}
        />
      )}

      {parcelaATraspasar && (
        <TraspasarParcelaModal 
          parcela={parcelaATraspasar}
          comunerosRegistrados={comuneros}
          onClose={() => setParcelaATraspasar(null)}
          onConfirmar={handleEjecutarTraspaso}
        />
      )}

    </div>
  );
};

export default ParcelasFeature;
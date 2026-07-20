"use client";

import React, { useState } from 'react';
import { LotesHeader } from '../components/LotesHeader';
import { LotesList, Lote as LoteSimplificado } from '../components/LotesList';
import { LoteDetail } from '../components/LoteDetail';

import { AgregarLoteForm } from '../components/AgregarLoteForm';
import { Lote as LoteCompleto } from '../types/typesLotes';
import { Comunero } from '../../comuneros/types/types';

const MOCK_LOTES: LoteSimplificado[] = [
  { id: 'l1', numero: 'L-001', folio: 'L-001', superficie: '300.00 m²', propietarios: ['José Antonio Hernández López'], estadoPredial: 'Pagado' },
  { id: 'l2', numero: 'L-002', folio: 'L-002', superficie: '250.00 m²', propietarios: ['María G. Pérez Martínez'], estadoPredial: 'Pagado' },
  { id: 'l3', numero: 'L-003', folio: 'L-003', superficie: '180.00 m²', propietarios: ['Pedro Jiménez Vázquez'], estadoPredial: 'Pagar' },
  { id: 'l4', numero: 'L-004', folio: 'L-004', superficie: '350.00 m²', propietarios: ['Rosa Elena Gómez Díaz'], estadoPredial: 'Pagado' },
  { id: 'l5', numero: 'L-005', folio: 'L-005', superficie: '200.00 m²', propietarios: ['Carlos A. López Hernández'], estadoPredial: 'Pagar' },
  { id: 'l6', numero: 'L-006', folio: 'L-006', superficie: '275.00 m²', propietarios: ['Ana Laura Vázquez Pérez'], estadoPredial: 'Pagado' },
  { id: 'l7', numero: 'L-007', folio: 'L-007', superficie: '150.00 m²', propietarios: ['Miguel Ángel Martínez Gómez'], estadoPredial: 'Pagar' },
  { id: 'l8', numero: 'L-008', folio: 'L-008', superficie: '400.00 m²', propietarios: ['Juan Carlos Pérez López'], estadoPredial: 'Pagado' }
];

const MOCK_COMUNEROS: Comunero[] = [
  {
    id: "com-1",
    nombre: "José Antonio",
    apellidos: "Hernández López",
    tipo: "comunero",
    fechaNacimiento: "1975-04-12",
    edad: 51,
    estadoCivil: "Casado",
    direccion: "Av. de los Ejidos #45",
    colonia: "San Isidro",
    telefono: "9511234567",
    correo: "jose.hernandez@ejido.com",
    fechaRegistro: "2010-02-15",
    folioComunero: "FOL-2010-089",
    fotografia: "",
    qrCode: "",
    terrenos: [],
    activo: true
  },
  {
    id: "com-2",
    nombre: "María G.",
    apellidos: "Pérez Martínez",
    tipo: "avecindado",
    fechaNacimiento: "1988-11-23",
    edad: 37,
    estadoCivil: "Soltero",
    direccion: "Calle Benito Juárez #10",
    colonia: "Centro",
    telefono: "9519876543",
    correo: "maria.perez@ejido.com",
    fechaRegistro: "2018-06-10",
    folioComunero: "FOL-2018-402",
    fotografia: "",
    qrCode: "",
    terrenos: [],
    activo: true
  }
];

export const LotesFeature: React.FC = () => {
  const [lotes, setLotes] = useState<LoteSimplificado[]>(MOCK_LOTES);
  const [selectedLote, setSelectedLote] = useState<LoteSimplificado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [loteEdicionCompleto, setLoteEdicionCompleto] = useState<LoteCompleto | null>(null);

  const filteredLotes = lotes.filter(l => 
    l.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.propietarios.some((prop: string) => prop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const activarEdicionDeLote = (loteSimplificado: LoteSimplificado) => {
    setSelectedLote(null);

    const superficieNumerica = parseFloat(loteSimplificado.superficie) || 200;
    const largoCalculado = 20;
    const anchoCalculado = superficieNumerica / largoCalculado;

    const loteParaFormulario: LoteCompleto = {
      folioInterno: loteSimplificado.folio,
      numeroLote: loteSimplificado.numero,
      largo: largoCalculado,
      ancho: anchoCalculado,
      superficieM2: superficieNumerica,
      fechaRegistro: new Date().toISOString().split('T')[0],
      estadoPredial: loteSimplificado.estadoPredial,
      propietario: loteSimplificado.propietarios[0] || '',
      certificado: `CERT-${loteSimplificado.folio}`, 
      calidadAgraria: 'Ejidatario',
      actoJuridico: 'Asignación',
      historialPropietarios: [],
      historialPrediales: [],
      observaciones: ''
    };

    setLoteEdicionCompleto(loteParaFormulario);
    setIsAddModalOpen(true);
  };

  const handleEliminarLote = (loteAEliminar: LoteSimplificado) => {
    if (confirm(`¿Está seguro que desea eliminar el registro del Lote ${loteAEliminar.numero}?`)) {
      setLotes(prev => prev.filter(l => l.id !== loteAEliminar.id));
      if (selectedLote?.id === loteAEliminar.id) {
        setSelectedLote(null);
      }
    }
  };

  const handleGuardarLote = (loteProcesado: LoteCompleto) => {
    const loteAdaptado: LoteSimplificado = {
      id: loteProcesado.folioInterno,
      numero: loteProcesado.numeroLote,
      folio: loteProcesado.folioInterno,
      superficie: `${loteProcesado.superficieM2.toFixed(2)} m²`,
      propietarios: [loteProcesado.propietario],
      estadoPredial: loteProcesado.estadoPredial
    };

    if (loteEdicionCompleto) {
      setLotes(prev => prev.map(l => l.folio === loteEdicionCompleto.folioInterno ? loteAdaptado : l));
    } else {
      setLotes(prev => [loteAdaptado, ...prev]);
    }

    setIsAddModalOpen(false);
    setLoteEdicionCompleto(null);
  };

  const handleCancelarFormulario = () => {
    setIsAddModalOpen(false);
    setLoteEdicionCompleto(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      
      <LotesHeader 
        onSearchChange={setSearchTerm} 
        onAddClick={() => {
          setLoteEdicionCompleto(null); 
          setIsAddModalOpen(true);
        }}
      />

      <div className="w-full">
        {filteredLotes.length > 0 ? (
          <LotesList 
            lotes={filteredLotes}
            selectedId={selectedLote?.id ?? ""} 
            onSelect={setSelectedLote}
            onEdit={activarEdicionDeLote}
            onDelete={handleEliminarLote}
          />
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-12 text-center text-gray-400 font-medium text-xs sm:text-sm shadow-sm">
            No se encontraron lotes que coincidan con la búsqueda.
          </div>
        )}
      </div>

      {selectedLote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedLote(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
              <h3 className="text-base font-bold text-gray-800">Expediente del Lote</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => activarEdicionDeLote(selectedLote)}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 rounded-lg text-xs font-bold transition-colors"
                >
                  ✏️ Editar Lote
                </button>
                <button 
                  onClick={() => setSelectedLote(null)}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-colors"
                >
                  ✕ Cerrar
                </button>
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <LoteDetail lote={selectedLote} />
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AgregarLoteForm 
          comunerosRegistrados={MOCK_COMUNEROS} 
          onClose={handleCancelarFormulario} 
          onGuardar={handleGuardarLote} 
          loteAEditar={loteEdicionCompleto} 
        />
      )}

    </div>
  );
};

export default LotesFeature;

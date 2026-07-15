"use client";

import React, { useState } from 'react';

import { ParcelasHeader } from '../components/ParcelasHeader';
import { ParcelasList } from '../components/ParcelasList';
import { ParcelaDetail } from '../components/ParcelaDetail';
import { AgregarParcelaForm } from '../components/AgregarParcelaForm'; 
import { TraspasarParcelaModal } from '../components/TraspasarParcelaModal'; 
import { Comunero } from '../../comuneros/types/types'; 


import { Parcela } from '../types/types'; 

const MOCK_PARCELAS: Parcela[] = [
  { id: '1', numero: 'P-001', superficie: '2.50 ha', titularesCount: 2, propietarios: ['José Antonio Hernández López', 'María Guadalupe Pérez Martínez'], estadoPredial: 'Pagado', historialPropietarios: [], historialPrediales: [] },
  { id: '2', numero: 'P-002', superficie: '1.75 ha', titularesCount: 1, propietarios: ['José Antonio Hernández López'], estadoPredial: 'Pagado', historialPropietarios: [], historialPrediales: [] },
  { id: '3', numero: 'P-003', superficie: '3.20 ha', titularesCount: 3, propietarios: ['María Guadalupe Pérez Martínez', 'Isabel Hernández López'], estadoPredial: 'Pagar', historialPropietarios: [], historialPrediales: [] },
];

// Mock rápido de comuneros registrados para que el selector del formulario tenga con quién asociar las parcelas
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
    correo: 'jose.hernandez@email.com',
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
    correo: 'jose.hernandez@email.com',
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
    correo: 'maria.perez@email.com',
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
  const [comuneros] = useState<Comunero[]>(MOCK_COMUNEROS_REGISTRADOS); // Mantenemos la base de comuneros
  
  // Estados para modales y búsquedas
  const [selectedParcela, setSelectedParcela] = useState<Parcela | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Controla el formulario de agregar
  const [searchTerm, setSearchTerm] = useState('');

  // 👈 Guarda temporalmente la parcela que se va a traspasar
  const [parcelaATraspasar, setParcelaATraspasar] = useState<Parcela | null>(null);

  // 🛠️ FUNCIÓN CORREGIDA: Procesa y añade la parcela de forma segura evitando errores de tipo string/number
  const handleGuardarParcela = (datosFormulario: any) => {
    // 1. Forzamos conversión a número real para prevenir fallos en métodos matemáticos
    const superficieNumerica = Number(datosFormulario.superficie);

    // 2. Mapeamos de forma robusta tolerando las variantes de nombres de tu formulario
    const nuevaParcelaFormateada: Parcela = {
      id: Date.now().toString(),
      numero: datosFormulario.numero || datosFormulario.folioInterno || 'P-000',
      superficie: isNaN(superficieNumerica) ? '0.00 ha' : `${superficieNumerica.toFixed(2)} ha`,
      titularesCount: datosFormulario.titularesCount || datosFormulario.titulares?.length || 1,
      propietarios: datosFormulario.propietarios || (datosFormulario.titulares?.map((t: any) => t.nombreCompleto) ?? ['Sin propietario asignado']),
      estadoPredial: datosFormulario.estadoPredial || 'Pagar',
      
      // 💾 Guardamos las nuevas colecciones cronológicas del expediente completo
      historialPropietarios: datosFormulario.historialPropietarios || [],
      historialPrediales: datosFormulario.historialPrediales || []
    };

    // Agregamos la nueva parcela al inicio de la lista
    setParcelas(prev => [nuevaParcelaFormateada, ...prev]);
    setIsAddModalOpen(false); // Cerramos el modal
  };

  // 🔄 NUEVA IMPLEMENTACIÓN INTEGRADA: Procesa e impacta el cambio de múltiples titulares en la parcela
  const handleEjecutarTraspaso = (datosTraspaso: {
    nuevosPropietarios: { nombre: string; certificado: string; porcentaje: number }[];
    actoJuridico: string;
    fecha: string;
  }) => {
    if (!parcelaATraspasar) return;

    // Filtrar para evitar que pasen elementos vacíos o corruptos
    const adquirentesValidos = datosTraspaso.nuevosPropietarios.filter(
      n => n && typeof n.nombre === 'string' && n.nombre.trim() !== ''
    );

    if (adquirentesValidos.length === 0) {
      alert("Error: Debe seleccionar adquirentes válidos para guardar.");
      return;
    }

    setParcelas(prev => prev.map(p => {
      if (p.id !== parcelaATraspasar.id) return p;

      const fechaOrigen = "01/01/2018"; 

      // Mapeamos los propietarios actuales al historial de dueños anteriores
      const dueñosSalientesHistoricos = (p.propietarios || []).map(nombreProp => ({
        nombre: nombreProp,
        certificado: "CERT-ANTECEDENTE",
        fechaAdquisicion: fechaOrigen,
        fechaCesion: datosTraspaso.fecha,
        actoJuridico: datosTraspaso.actoJuridico,
        adquirente: adquirentesValidos.map(n => `${n.nombre} (${n.porcentaje}%)`).join(', ')
      }));

      const historialActualizado = [
        ...dueñosSalientesHistoricos,
        ...(p.historialPropietarios || [])
      ];

      // El primer adquirente nuevo se posiciona a la cabeza de la vista cronológica
      const nuevosRegistrosCronologicos = adquirentesValidos.map(a => ({
        nombre: a.nombre,
        certificado: a.certificado,
        fechaAdquisicion: datosTraspaso.fecha,
        fechaCesion: "— (Actual)",
        actoJuridico: datosTraspaso.actoJuridico,
        adquirente: "Titular Activo"
      }));

      return {
        ...p,
        // Asignamos la lista limpia de strings con los nombres al estado principal
        propietarios: adquirentesValidos.map(n => n.nombre), 
        titularesCount: adquirentesValidos.length, 
        historialPropietarios: [...nuevosRegistrosCronologicos, ...historialActualizado]
      };
    }));

    setParcelaATraspasar(null); // Cerramos el modal
    setSelectedParcela(null);   // Reseteamos el detalle para forzar el re-renderizado
  };

  const filteredParcelas = parcelas.filter(p => 
    p.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.propietarios.some((prop: string) => prop.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in w-full px-2 py-2 max-w-[1600px] mx-auto relative">
      
      {/* 1. Componente Superior de Filtros */}
      <ParcelasHeader 
        onSearchChange={setSearchTerm} 
        onAddClick={() => setIsAddModalOpen(true)}
      />

      {/* Lista de Registros a Ancho Completo */}
      <div className="w-full">
        {filteredParcelas.length > 0 ? (
          <ParcelasList 
            parcelas={filteredParcelas}
            selectedId={selectedParcela?.id ?? ""} 
            onSelect={setSelectedParcela}
            onTraspasar={setParcelaATraspasar}
          />
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-8 sm:p-12 text-center text-gray-400 font-medium text-sm shadow-sm">
            No se encontraron parcelas que coincidan con la búsqueda.
          </div>
        )}
      </div>

      {/* VENTANA MODAL COMPACTA: Detalles de la parcela seleccionada */}
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

      {/* 💡 MODAL DINÁMICO: Agregar nueva Parcela */}
      {isAddModalOpen && (
        <AgregarParcelaForm 
          comunerosRegistrados={comuneros}
          onClose={() => setIsAddModalOpen(false)}
          onGuardar={handleGuardarParcela}
        />
      )}

      {/* 💡 MODAL: Traspasar derechos de Parcela */}
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
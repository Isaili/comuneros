"use client";

import React, { useState } from 'react';
import { Comunero } from '../types/types';
import { ComunerosHeader } from '../components/ComunerosHeader';
import { ComunerosList } from '../components/ComunerosList';
import { ComuneroDetail } from '../components/ComuneroDetail';
import { AgregarComuneroForm } from '../components/AgregarComuneroForm'; 

const MOCK_COMUNEROS: Comunero[] = [
  {
    id: '1',
    nombre: 'Isabel',
    apellidos: 'Hernández López',
    tipo: 'comunero',
    fechaNacimiento: '15/03/1980',
    edad: 65,
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
    terrenos: [
      { tipo: 'Parcela', numero: 155, folio: 'P-0155', certificado: 'CERT-15857', superficie: '2.50 ha', ubicacion: 'Ejido Copainalá' },
      { tipo: 'Parcela', numero: 257, folio: 'P-0627', certificado: 'CERT-23565', superficie: '1.75 ha', ubicacion: 'Ejido Copainalá' },
      { tipo: 'Lote', numero: 85, folio: 'L-008', superficie: '300 m²', ubicacion: 'Barrio San José' }
    ]
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
    folioComunero: 'COM-0042',
    fotografia: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COM-0042',
    activo: true,
    terrenos: [
      { tipo: 'Parcela', numero: 15, folio: 'P-015', certificado: 'CERT-1587', superficie: '2.50 ha', ubicacion: 'Ejido Copainalá' },
      { tipo: 'Parcela', numero: 27, folio: 'P-027', certificado: 'CERT-2365', superficie: '1.75 ha', ubicacion: 'Ejido Copainalá' },
      { tipo: 'Lote', numero: 8, folio: 'L-008', superficie: '300 m²', ubicacion: 'Barrio San José' }
    ]
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
    terrenos: [
      { tipo: 'Parcela', numero: 4, folio: 'P-004', certificado: 'CERT-0921', superficie: '3.10 ha', ubicacion: 'Ejido Copainalá' }
    ]
  }
];

export const ComunerosFeature: React.FC = () => {
  const [comuneros, setComuneros] = useState<Comunero[]>(MOCK_COMUNEROS);
  
  // Estados para modales y búsquedas
  const [selectedComunero, setSelectedComunero] = useState<Comunero | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (text: string) => setSearchTerm(text);
  
  // Abrir el modal de creación
  const handleAddComunero = () => setIsAddModalOpen(true);

  // Función para procesar y guardar el nuevo miembro desde el formulario validado
  const handleGuardarNuevoComunero = (nuevoComunero: any) => {
    // Generar un folio aleatorio para el ejemplo
    const numeroFolio = Math.floor(1000 + Math.random() * 9000);
    const folioGenerado = `COM-${numeroFolio}`;

    // Mapear la respuesta del formulario a la interfaz estricta de Comunero
    const comuneroFormateado: Comunero = {
      id: nuevoComunero.id,
      nombre: nuevoComunero.nombre,
      apellidos: nuevoComunero.apellidos,
      tipo: nuevoComunero.tipoComunero as 'comunero' | 'avecindado',
      fechaNacimiento: nuevoComunero.fechaNacimiento,
      edad: nuevoComunero.fechaNacimiento ? new Date().getFullYear() - new Date(nuevoComunero.fechaNacimiento).getFullYear() : 30,
      estadoCivil: 'Soltero', // Por defecto o mapear si se agrega en el futuro
      direccion: nuevoComunero.direccion || 'Sin dirección registrada',
      colonia: nuevoComunero.colonia,
      telefono: nuevoComunero.telefono || '',
      correo: nuevoComunero.correo || '',
      fechaRegistro: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }),
      folioComunero: folioGenerado,
      fotografia: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200', // Avatar por defecto
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${folioGenerado}`,
      activo: true,
      terrenos: [] // Inicializa sin terrenos asignados
    };

    setComuneros(prev => [comuneroFormateado, ...prev]);
    setIsAddModalOpen(false); // Cierra el modal de creación
  };

  const handleEdit = (id: string) => alert(`Editar comunero con ID: ${id}`);
  
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro?")) {
      setComuneros(prev => prev.filter(c => c.id !== id));
      if (selectedComunero?.id === id) setSelectedComunero(null);
    }
  };

  const filteredComuneros = comuneros.filter(c => 
    `${c.nombre} ${c.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      
      {/* Encabezado Principal */}
      <ComunerosHeader 
        onAddClick={handleAddComunero} 
        onSearchChange={handleSearch} 
      />

      {/* Lista de Comuneros a Ancho Completo */}
      <div className="w-full">
        {filteredComuneros.length > 0 ? (
          <ComunerosList 
            comuneros={filteredComuneros}
            selectedId={selectedComunero?.id ?? ""}
            onSelect={setSelectedComunero}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-12 text-center text-gray-400 font-medium text-xs sm:text-sm shadow-sm">
            No se encontraron comuneros o avecindados registrados con ese nombre.
          </div>
        )}
      </div>

      {/* MODAL PARA DETALLE DEL COMUNERO */}
      {selectedComunero && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedComunero(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto z-10 animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
              <h3 className="text-lg font-bold text-gray-800">Expediente del Comunero</h3>
              <button 
                onClick={() => setSelectedComunero(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-colors"
              >
                ✕ Cerrar
              </button>
            </div>
            <div className="p-6">
              <ComuneroDetail 
                comunero={selectedComunero} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA AGREGAR NUEVO COMUNERO */}
      {isAddModalOpen && (
        <AgregarComuneroForm 
          onClose={() => setIsAddModalOpen(false)}
          onGuardar={handleGuardarNuevoComunero}
        />
      )}

    </div>
  );
};

export default ComunerosFeature;
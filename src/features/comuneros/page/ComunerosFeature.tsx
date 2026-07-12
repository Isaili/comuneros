"use client";

import React, { useState } from 'react';
import { Comunero } from '../types/types';
import { ComunerosHeader } from '../components/ComunerosHeader';
import { ComunerosList } from '../components/ComunerosList';
import { ComuneroDetail } from '../components/ComuneroDetail';

// 1. RE-INSERTAMOS LOS DATOS DE PRUEBA (MOCK DATA)
const MOCK_COMUNEROS: Comunero[] = [
  {
    id: '1',
    nombre: 'José Antonio',
    apellidos: 'Hernández López',
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
    id: '2',
    nombre: 'María Guadalupe',
    apellidos: 'Pérez Martínez',
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
  const [selectedComunero, setSelectedComunero] = useState<Comunero>(MOCK_COMUNEROS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (text: string) => setSearchTerm(text);
  const handleAddComunero = () => alert("Manejador para añadir nuevo comunero");
  const handleEdit = (id: string) => alert(`Editar comunero con ID: ${id}`);
  const handleDelete = (id: string) => {
    if(confirm("¿Estás seguro?")) setComuneros(prev => prev.filter(c => c.id !== id));
  };

  const filteredComuneros = comuneros.filter(c => 
    `${c.nombre} ${c.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-in w-full">
      <ComunerosHeader 
        onAddClick={handleAddComunero} 
        onSearchChange={handleSearch} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <ComunerosList 
            comuneros={filteredComuneros}
            selectedId={selectedComunero?.id}
            onSelect={setSelectedComunero}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        <div className="lg:col-span-7">
          {selectedComunero ? (
            <ComuneroDetail 
              comunero={selectedComunero} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium">
              Selecciona un comunero de la lista para ver su expediente.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComunerosFeature;
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
    fechaRegistro: '10 de enero de 2010',
    folioComunero: 'COM-0042',
    fotografia: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COM-0042',
    activo: true,
    terrenos: [
      { tipo: 'Parcela', numero: 155, folio: 'P-0155', certificado: 'CERT-15857', superficie: '2.50 ha', ubicacion: 'Ejido Copainalá', hectareasPosesion: 2.5 },
      { tipo: 'Parcela', numero: 257, folio: 'P-0627', certificado: 'CERT-23565', superficie: '1.75 ha', ubicacion: 'Ejido Copainalá', hectareasPosesion: 1.75 },
      { tipo: 'Lote', numero: 85, folio: 'L-008', superficie: '300 m²', ubicacion: 'Barrio San José', hectareasPosesion: 0.03 }
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
    fechaRegistro: '10 de enero de 2010',
    folioComunero: 'COM-0042',
    fotografia: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COM-0042',
    activo: true,
    terrenos: [
      { tipo: 'Parcela', numero: 15, folio: 'P-015', certificado: 'CERT-1587', superficie: '2.50 ha', ubicacion: 'Ejido Copainalá', hectareasPosesion: 2.5 },
      { tipo: 'Parcela', numero: 27, folio: 'P-027', certificado: 'CERT-2365', superficie: '1.75 ha', ubicacion: 'Ejido Copainalá', hectareasPosesion: 1.75 },
      { tipo: 'Lote', numero: 8, folio: 'L-008', superficie: '300 m²', ubicacion: 'Barrio San José', hectareasPosesion: 0.03 }
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
    fechaRegistro: '15 de marzo de 2014',
    folioComunero: 'COM-0089',
    fotografia: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=COM-0089',
    activo: true,
    terrenos: [
      { tipo: 'Parcela', numero: 4, folio: 'P-004', certificado: 'CERT-0921', superficie: '3.10 ha', ubicacion: 'Ejido Copainalá', hectareasPosesion: 3.1 }
    ]
  }
];

export const ComunerosFeature: React.FC = () => {
  const [comuneros, setComuneros] = useState<Comunero[]>(MOCK_COMUNEROS);
  
  const [selectedComunero, setSelectedComunero] = useState<Comunero | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [comuneroAEditar, setComuneroAEditar] = useState<Comunero | null>(null);

  const handleSearch = (text: string) => setSearchTerm(text);
  
  const handleAddComunero = () => {
    setComuneroAEditar(null);
    setIsAddModalOpen(true);
  };

  // Función unificada para guardar (crear o actualizar) un miembro
  const handleGuardarNuevoComunero = (datosFormulario: any) => {
    // 💡 CAMBIO: ya no confiamos en si el form mandó un id "falso" (Date.now()).
    // Ahora decidimos si es edición según si comuneroAEditar existe en el estado,
    // no según lo que traiga datosFormulario. El form solo manda id cuando
    // realmente estás editando (viene de comuneroAEditar?.id).
    const esEdicion = !!comuneroAEditar;

    if (esEdicion) {
      // TODO backend: aquí en vez de setComuneros(prev => prev.map(...)) directo,
      // vas a hacer algo como:
      //
      //   await api.put(`/comuneros/${comuneroAEditar.id}`, datosFormulario);
      //   // luego, si la respuesta es exitosa, actualizas el estado local igual que abajo,
      //   // o mejor, usas lo que el backend te devuelva (por si normaliza algún campo).
      //
      setComuneros(prev => prev.map(c => {
        if (c.id === comuneroAEditar!.id) {
          let fechaNacimientoFormateada = datosFormulario.fechaNacimiento;
          if (datosFormulario.fechaNacimiento.includes('-')) {
            const partes = datosFormulario.fechaNacimiento.split('-');
            fechaNacimientoFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
          }

          const nuevaEdad = datosFormulario.fechaNacimiento 
            ? new Date().getFullYear() - new Date(datosFormulario.fechaNacimiento).getFullYear() 
            : c.edad;

          return {
            ...c,
            nombre: datosFormulario.nombre,
            apellidos: datosFormulario.apellidos,
            tipo: datosFormulario.tipoComunero as 'comunero' | 'avecindado',
            fechaNacimiento: fechaNacimientoFormateada,
            edad: nuevaEdad,
            direccion: datosFormulario.direccion || 'Sin dirección registrada',
            colonia: datosFormulario.colonia,
            telefono: datosFormulario.telefono || '',
            correo: datosFormulario.correo || '',
            fotografia: datosFormulario.fotografia,
          };
        }
        return c;
      }));

      if (selectedComunero?.id === comuneroAEditar!.id) {
        setSelectedComunero(null);
      }

    } else {
      // TODO backend: aquí es donde cambia más. En vez de generar folioGenerado
      // y el id en el cliente, vas a hacer algo como:
      //
      //   const response = await api.post('/comuneros', datosFormulario);
      //   const comuneroCreado = response.data; // el backend regresa id, folio, qrCode reales
      //   setComuneros(prev => [comuneroCreado, ...prev]);
      //
      // Por ahora seguimos generando folio/id localmente porque no hay backend real:
      const numeroFolio = Math.floor(1000 + Math.random() * 9000);
      const folioGenerado = `COM-${numeroFolio}`;
      const idGenerado = Date.now().toString(); // 💡 el id ahora se genera aquí, en un solo lugar,
                                                  // no en el formulario — más fácil de reemplazar después

      let fechaNacimientoFormateada = datosFormulario.fechaNacimiento;
      if (datosFormulario.fechaNacimiento.includes('-')) {
        const partes = datosFormulario.fechaNacimiento.split('-');
        fechaNacimientoFormateada = `${partes[2]}/${partes[1]}/${partes[0]}`;
      }

      const comuneroFormateado: Comunero = {
        id: idGenerado,
        nombre: datosFormulario.nombre,
        apellidos: datosFormulario.apellidos,
        tipo: datosFormulario.tipoComunero as 'comunero' | 'avecindado',
        fechaNacimiento: fechaNacimientoFormateada,
        edad: datosFormulario.fechaNacimiento ? new Date().getFullYear() - new Date(datosFormulario.fechaNacimiento).getFullYear() : 30,
        estadoCivil: 'Soltero',
        direccion: datosFormulario.direccion || 'Sin dirección registrada',
        colonia: datosFormulario.colonia,
        telefono: datosFormulario.telefono || '',
        fechaRegistro: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }),
        folioComunero: folioGenerado,
        fotografia: datosFormulario.fotografia,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${folioGenerado}`,
        activo: true,
        terrenos: []
      };

      setComuneros(prev => [comuneroFormateado, ...prev]);
    }

    setIsAddModalOpen(false);
    setComuneroAEditar(null);
  };

  const handleEdit = (id: string) => {
    const comuneroBuscado = comuneros.find(c => c.id === id);
    if (comuneroBuscado) {
      setComuneroAEditar(comuneroBuscado);
      setIsAddModalOpen(true);
    }
  };
  
  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este registro?")) {
      // TODO backend: aquí iría await api.delete(`/comuneros/${id}`) antes de actualizar el estado local
      setComuneros(prev => prev.filter(c => c.id !== id));
      if (selectedComunero?.id === id) setSelectedComunero(null);
    }
  };

  const filteredComuneros = comuneros.filter(c => 
    `${c.nombre} ${c.apellidos}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      
      <ComunerosHeader 
        onAddClick={handleAddComunero} 
        onSearchChange={handleSearch} 
      />

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
                onEdit={(id) => {
                  setSelectedComunero(null);
                  handleEdit(id);
                }}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <AgregarComuneroForm 
          onClose={() => {
            setIsAddModalOpen(false);
            setComuneroAEditar(null);
          }}
          onGuardar={handleGuardarNuevoComunero}
          comuneroAEditar={comuneroAEditar}
        />
      )}

    </div>
  );
};

export default ComunerosFeature;
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Comunero, CrearComuneroPayload } from '../types/types';
import { comunerosApi } from '../services/comunerosApi';
import { ComunerosHeader } from '../components/ComunerosHeader';
import { ComunerosList } from '../components/ComunerosList';
import { ComuneroDetail } from '../components/ComuneroDetail';
import { AgregarComuneroForm } from '../components/AgregarComuneroForm';

export const ComunerosFeature: React.FC = () => {
  const [comuneros, setComuneros] = useState<Comunero[]>([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedComunero, setSelectedComunero] = useState<Comunero | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [comuneroAEditar, setComuneroAEditar] = useState<Comunero | null>(null);

  const cargarComuneros = useCallback(async (paginaActual: number) => {
    setIsLoading(true);
    try {
      const { comuneros: lista, totalPages: paginasTotales } = await comunerosApi.listar(paginaActual, limit);
      setComuneros(lista);
      setTotalPages(paginasTotales);
    } catch (err) {
      console.error('Error al cargar comuneros:', err);
      setComuneros([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    cargarComuneros(page);
  }, [page, cargarComuneros]);

  const handleSearch = (text: string) => setSearchTerm(text);

  const handleAddComunero = () => {
    setComuneroAEditar(null);
    setIsAddModalOpen(true);
  };

  const handleGuardarNuevoComunero = async (
    payload: CrearComuneroPayload,
    fotoFile?: File | Blob | string | null
  ) => {
    try {
      // Si recibes un File/Blob lo envía directamente; si es un string o null no fuerza el archivo
      const archivoAEnviar = fotoFile instanceof Blob ? fotoFile : null;

      if (comuneroAEditar) {
        await comunerosApi.actualizar(comuneroAEditar.id, payload, archivoAEnviar);
      } else {
        await comunerosApi.crear(payload, archivoAEnviar);
      }
      
      setIsAddModalOpen(false);
      setComuneroAEditar(null);
      await cargarComuneros(page); // Refresca la lista
    } catch (err: any) {
      if (err.response) {
        console.error('❌ Error devuelto por el servidor:', err.response.data);
        const errorMsg = err.response.data.message || 'Error al procesar la solicitud.';
        alert(`No se pudo guardar: ${Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg}`);
      } else {
        console.error('Error al guardar comunero:', err);
        alert('No se pudo guardar el registro. Revisa la conexión con el servidor.');
      }
    }
  };

  const handleEdit = (id: string) => {
    const comuneroBuscado = comuneros.find((c) => c.id === id);
    if (comuneroBuscado) {
      setComuneroAEditar(comuneroBuscado);
      setIsAddModalOpen(true);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
    try {
      await comunerosApi.eliminar(id);
      await cargarComuneros(page);
      if (selectedComunero?.id === id) setSelectedComunero(null);
    } catch (err) {
      console.error('Error al eliminar comunero:', err);
      alert('No se pudo eliminar el registro.');
    }
  };

  const filteredComuneros = comuneros.filter((c) =>
    `${c.nombre} ${c.apellidoPaterno} ${c.apellidoMaterno}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      <ComunerosHeader onAddClick={handleAddComunero} onSearchChange={handleSearch} />

      <div className="w-full">
        {isLoading ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col justify-between min-h-[600px]">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-4">
                Lista de comuneros <span className="text-gray-900 font-bold">(0)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="py-3 px-2">Nombre</th>
                      <th className="py-3 px-2">Tipo</th>
                      <th className="py-3 px-2">Comunero Desde</th>
                      <th className="py-3 px-2">Vecindario</th>
                      <th className="py-3 px-2 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan={5} className="py-24">
                        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          Cargando comuneros...
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : filteredComuneros.length > 0 ? (
          <ComunerosList
            comuneros={filteredComuneros}
            selectedId={selectedComunero?.id ?? ''}
            onSelect={setSelectedComunero}
            onEdit={handleEdit}
            onDelete={handleDelete}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
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
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Comunero, CrearComuneroPayload, EstadoPersona, TipoPersona } from '../types/types';
import { comunerosApi } from '../services/comunerosApi';
import { ComunerosHeader } from '../components/ComunerosHeader';
import { ComunerosList } from '../components/ComunerosList';
import { ComuneroDetail } from '../components/ComuneroDetail';
import { AgregarComuneroForm } from '../components/AgregarComuneroForm';

const mapaTipoAPersonType: Record<TipoPersona, 'COMMONER' | 'RESIDENT' | 'INHABITANT'> = {
  comunero: 'COMMONER',
  avecindado: 'RESIDENT',
  poblador: 'INHABITANT',
};

const deduplicarComuneros = (items: Comunero[]) => {
  const mapa = new Map<string, Comunero>();
  items.forEach((item) => {
    if (item?.id) mapa.set(item.id, item);
  });
  return Array.from(mapa.values());
};

interface ComunerosFeatureProps {
  onIrABarrios?: () => void;
}

export const ComunerosFeature: React.FC<ComunerosFeatureProps> = () => {
  const [comuneros, setComuneros] = useState<Comunero[]>([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [selectedComunero, setSelectedComunero] = useState<Comunero | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [comuneroAEditar, setComuneroAEditar] = useState<Comunero | null>(null);
  const ultimaCargaRef = useRef('');

  useEffect(() => {
    window.localStorage.removeItem('comuneros_detalles_cache');
  }, []);

  const cargarComuneros = useCallback(async (paginaActual: number) => {
    setIsLoading(true);
    try {
      const { comuneros: lista, totalPages: paginasTotales } = await comunerosApi.listar(
        paginaActual,
        limit,
        { fullName: searchTerm || undefined }
      );
      const listaSinDuplicados = deduplicarComuneros(lista);
      setComuneros(listaSinDuplicados);
      setTotalPages(paginasTotales);
    } catch (err) {
      console.error('Error al cargar comuneros:', err);
      setComuneros([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit, searchTerm]);

  useEffect(() => {
    const cargaKey = `${page}:${searchTerm}`;
    if (ultimaCargaRef.current === cargaKey) return;
    ultimaCargaRef.current = cargaKey;
    cargarComuneros(page);
  }, [page, searchTerm, cargarComuneros]);

  useEffect(() => {
    if (searchInput === searchTerm) return;
    const debounce = window.setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 5000);
    return () => window.clearTimeout(debounce);
  }, [searchInput, searchTerm]);

  const handleSelectComunero = async (comunero: Comunero) => {
    setSelectedComunero(comunero);
    setIsDetailLoading(true);
    try {
      const detalle = await comunerosApi.obtenerPorId(comunero.id);
      setSelectedComunero(detalle);
    } catch (err) {
      console.error('Error al cargar el detalle del comunero:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchInput(text);
  };

  const handleAddComunero = () => {
    setComuneroAEditar(null);
    setIsAddModalOpen(true);
  };

  const handleGuardarNuevoComunero = async (
    payload: CrearComuneroPayload,
    fotoFile?: File | Blob | string | null,
    eliminarFoto = false
  ) => {
    try {
      const archivoAEnviar = fotoFile instanceof Blob ? fotoFile : null;

      if (comuneroAEditar) {
        const comuneroActualizado = await comunerosApi.actualizar(
          comuneroAEditar.id,
          payload,
          archivoAEnviar,
          comuneroAEditar.status,
          eliminarFoto
        );

        setComuneros((actuales) => actuales.flatMap((comunero) => {
          if (comunero.id !== comuneroActualizado.id) return [comunero];
          return comuneroActualizado.status === 'ACTIVE' ? [comuneroActualizado] : [];
        }));

        if (selectedComunero?.id === comuneroAEditar.id) {
          setSelectedComunero(comuneroActualizado);
        }
      } else {
        await comunerosApi.crear(payload, archivoAEnviar);
        ultimaCargaRef.current = '';
        await cargarComuneros(page);
      }

      setIsAddModalOpen(false);
      setComuneroAEditar(null);
    } catch (err: unknown) {
      const responseData = typeof err === 'object' && err !== null && 'response' in err
        ? (err as { response?: { data?: { message?: string | string[] } } }).response?.data
        : undefined;
      if (responseData) {
        console.error('❌ Error devuelto por el servidor:', responseData);
        const errorMsg = responseData.message || 'Error al procesar la solicitud.';
        alert(`No se pudo guardar: ${Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg}`);
      } else {
        console.error('Error al guardar comunero:', err);
        alert('No se pudo guardar el registro. Revisa la conexión con el servidor.');
      }
    }
  };

  const handleEdit = async (id: string) => {
    const comuneroBuscado = comuneros.find((c) => c.id === id);
    if (!comuneroBuscado) return;

    try {
      // GET fresco previo a la edición
      const comuneroCompleto = await comunerosApi.obtenerPorId(id);

      setComuneroAEditar(comuneroCompleto);
    } catch (err) {
      console.error('Error al cargar el expediente para editar:', err);
      alert('No se pudo cargar la información completa del comunero.');
      return;
    }

    setIsAddModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas dar de baja este registro?')) return;
    try {
      await comunerosApi.actualizarEstado(id, 'INACTIVE');

      ultimaCargaRef.current = '';
      await cargarComuneros(page);
      if (selectedComunero?.id === id) setSelectedComunero(null);
    } catch (err) {
      console.error('Error al eliminar comunero:', err);
      alert('No se pudo eliminar el registro.');
    }
  };

  const refrescarComuneroActualizado = async (id: string) => {
    const comuneroActualizado = await comunerosApi.obtenerPorId(id);
    if (selectedComunero?.id === id) setSelectedComunero(comuneroActualizado);
    ultimaCargaRef.current = '';
    await cargarComuneros(page);
  };

  const handleChangeTipo = async (id: string, tipo: TipoPersona) => {
    try {
      await comunerosApi.actualizarTipo(id, mapaTipoAPersonType[tipo]);
      await refrescarComuneroActualizado(id);
    } catch (err) {
      console.error('Error al cambiar el tipo de persona:', err);
      alert('No se pudo cambiar el tipo de persona.');
    }
  };

  const handleChangeEstado = async (id: string, estado: EstadoPersona) => {
    try {
      if (estado === 'fallecido') {
        await comunerosApi.marcarFallecido(id);
      } else {
        await comunerosApi.actualizarEstado(id, estado === 'activo' ? 'ACTIVATE' : 'INACTIVE');
      }
      await refrescarComuneroActualizado(id);
    } catch (err) {
      console.error('Error al cambiar el estatus:', err);
      alert('No se pudo cambiar el estatus.');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      <ComunerosHeader
        onAddClick={handleAddComunero}
        searchValue={searchInput}
        onSearchChange={handleSearch}
      />

      <div className="w-full">
        {isLoading ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col justify-between min-h-[600px]">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-4">
                Lista de Miembros <span className="text-gray-900 font-bold">(0)</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="text-gray-400 font-bold text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="py-3 px-2">Nombre</th>
                      <th className="py-3 px-2">Tipo</th>
                      <th className="py-3 px-2">Miembro Desde</th>
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
        ) : comuneros.length > 0 ? (
          <ComunerosList
            comuneros={comuneros}
            selectedId={selectedComunero?.id ?? ''}
            onSelect={handleSelectComunero}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onChangeTipo={handleChangeTipo}
            onChangeEstado={handleChangeEstado}
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
              <h3 className="text-lg font-bold text-gray-800">Expediente del Miembro</h3>
              <button
                onClick={() => setSelectedComunero(null)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition-colors"
              >
                ✕ Cerrar
              </button>
            </div>
            <div className="p-6">
              {isDetailLoading ? (
                <div className="py-12 text-center text-gray-500">Cargando expediente...</div>
              ) : (
                <ComuneroDetail
                  comunero={selectedComunero}
                  onEdit={(id) => {
                    setSelectedComunero(null);
                    handleEdit(id);
                  }}
                  onDelete={handleDelete}
                />
              )}
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
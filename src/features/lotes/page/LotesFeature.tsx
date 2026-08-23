"use client";

import React, { useEffect, useState } from 'react';
import { LotesHeader } from '../components/LotesHeader';
import { LotesList, Lote as LoteSimplificado } from '../components/LotesList';
import { LoteDetail } from '../components/LoteDetail';

import { AgregarLoteForm } from '../components/AgregarLoteForm';
import { TraspasarLoteModal } from '../components/TraspasarLoteModal';
import { DividirLoteModal } from '../components/DividirLoteModal';
import { Lote as LoteCompleto, PropietarioHistoricoLote } from '../types/typesLotes';
import { Comunero } from '../../comuneros/types/types';
import { comunerosApi } from '../../comuneros/services/comunerosApi';

interface DatosTraspasoLotePayload {
  nuevosPropietarios?: Array<{
    nombre?: string;
    certificado?: string;
  }>;
  actoJuridico?: string;
  fecha?: string;
}

const LOTES_STORAGE_KEY = 'lotes_titulares_local';
const COMUNEROS_STORAGE_KEY = 'lotes_comuneros_registrados';

const leerTitularesLocal = (): Record<string, { propietarios: string[]; historialPropietarios: PropietarioHistoricoLote[] }> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(LOTES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const guardarTitularesLocal = (value: Record<string, { propietarios: string[]; historialPropietarios: PropietarioHistoricoLote[] }>) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(LOTES_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // noop
  }
};

const leerComunerosCache = (): Comunero[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(COMUNEROS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const normalizarTexto = (value?: string | null) => String(value ?? '').replace(/\s+/g, ' ').trim();

const normalizarPropietarios = (propietarios?: string[]) =>
  Array.from(new Set((propietarios ?? []).map((item) => normalizarTexto(item)).filter(Boolean)));

const enriquecerLoteConHistorial = (lote: LoteSimplificado): LoteSimplificado => {
  const local = leerTitularesLocal()[lote.id];
  return {
    ...lote,
    propietarios: normalizarPropietarios(local?.propietarios ?? lote.propietarios),
    historialPropietarios: local?.historialPropietarios ?? [],
  };
};

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
    estadoCivil: 'casado',
    direccion: "Av. de los Ejidos #45",
    colonia: "San Isidro",
    telefono: "9511234567",
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
    estadoCivil: 'soltero',
    direccion: "Calle Benito Juárez #10",
    colonia: "Centro",
    telefono: "9519876543",
    fechaRegistro: "2018-06-10",
    folioComunero: "FOL-2018-402",
    fotografia: "",
    qrCode: "",
    terrenos: [],
    activo: true
  },
  {
    id: "com-3",
    nombre: "Isabel",
    apellidos: "Hernández López",
    tipo: "comunero",
    fechaNacimiento: "1980-03-15",
    edad: 46,
    estadoCivil: 'casado',
    direccion: "Calle Miguel Hidalgo #123",
    colonia: "Santa Ana",
    telefono: "9611234567",
    fechaRegistro: "2010-01-10",
    folioComunero: "COM-0042",
    fotografia: "",
    qrCode: "",
    terrenos: [],
    activo: true
  }
];

export const LotesFeature: React.FC = () => {
  const [lotes, setLotes] = useState<LoteSimplificado[]>(MOCK_LOTES);
  const [comuneros, setComuneros] = useState<Comunero[]>(() => leerComunerosCache());

  useEffect(() => {
    let isMounted = true;
    const cargarComuneros = async () => {
      try {
        const { comuneros: lista } = await comunerosApi.listar(1, 200);
        if (!isMounted) return;
        setComuneros(lista);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(COMUNEROS_STORAGE_KEY, JSON.stringify(lista));
        }
      } catch {
        if (!isMounted) return;
        setComuneros(leerComunerosCache());
      }
    };

    cargarComuneros();
    return () => { isMounted = false; };
  }, []);

  const [selectedLote, setSelectedLote] = useState<LoteSimplificado | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [loteEdicionCompleto, setLoteEdicionCompleto] = useState<LoteCompleto | null>(null);
  const [loteATraspasar, setLoteATraspasar] = useState<LoteCompleto | null>(null);
  const [loteADividir, setLoteADividir] = useState<LoteSimplificado | null>(null);

  const filteredLotes = lotes
    .map(enriquecerLoteConHistorial)
    .filter((l) => {
      const query = searchTerm.toLowerCase();
      return (
        l.numero.toLowerCase().includes(query) ||
        l.folio.toLowerCase().includes(query) ||
        l.propietarios.some((prop: string) => prop.toLowerCase().includes(query))
      );
    });

  // Convierte un LoteSimplificado a LoteCompleto para pasarlo a modales
  const adaptarLoteACompleto = (loteSimplificado: LoteSimplificado): LoteCompleto => {
    const loteEnriquecido = enriquecerLoteConHistorial(loteSimplificado);
    const superficieNumerica = parseFloat(loteSimplificado.superficie) || 200;
    const largoCalculado = 20;
    const anchoCalculado = superficieNumerica / largoCalculado;

    return {
      id: loteSimplificado.id,
      folioInterno: loteSimplificado.folio,
      numeroLote: loteSimplificado.numero,
      largo: largoCalculado,
      ancho: anchoCalculado,
      superficieM2: superficieNumerica,
      fechaRegistro: new Date().toISOString().split('T')[0],
      estadoPredial: loteSimplificado.estadoPredial,
      propietario: loteEnriquecido.propietarios[0] || 'Sin propietario asignado',
      propietarios: loteEnriquecido.propietarios,
      certificado: `CERT-${loteSimplificado.folio}`,
      calidadAgraria: 'Comunero',
      actoJuridico: 'Asignación Directa',
      historialPropietarios: loteEnriquecido.historialPropietarios ?? [],
      historialPrediales: [],
      observaciones: ''
    };
  };

  const activarEdicionDeLote = (loteSimplificado: LoteSimplificado) => {
    setSelectedLote(null);
    setLoteEdicionCompleto(adaptarLoteACompleto(loteSimplificado));
    setIsAddModalOpen(true);
  };

  const activarTraspasoDeLote = (loteSimplificado: LoteSimplificado) => {
    setSelectedLote(null);
    setLoteATraspasar(adaptarLoteACompleto(loteSimplificado));
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
    const propietarios = loteProcesado.propietarios?.length ? loteProcesado.propietarios : [loteProcesado.propietario || 'Sin propietario asignado'];
    const loteAdaptado: LoteSimplificado = {
      id: loteProcesado.id || loteProcesado.folioInterno,
      numero: loteProcesado.numeroLote,
      folio: loteProcesado.folioInterno,
      superficie: `${loteProcesado.superficieM2.toFixed(2)} m²`,
      propietarios,
      estadoPredial: loteProcesado.estadoPredial
    };

    const titularesGuardados = leerTitularesLocal();
    const loteId = loteAdaptado.id;
    titularesGuardados[loteId] = {
      propietarios,
      historialPropietarios: loteProcesado.historialPropietarios ?? [
        {
          nombre: propietarios[0],
          certificado: loteProcesado.certificado || `CERT-${loteAdaptado.folio}`,
          fechaAdquisicion: loteProcesado.fechaRegistro || new Date().toISOString().split('T')[0],
          fechaCesion: '— (Actual)',
          actoJuridico: loteProcesado.actoJuridico || 'Asignación Directa',
          adquirente: 'Titular activo',
          esActual: true,
        }
      ],
    };
    guardarTitularesLocal(titularesGuardados);

    if (loteEdicionCompleto) {
      setLotes(prev => prev.map(l => l.folio === loteEdicionCompleto.folioInterno ? loteAdaptado : l));
    } else {
      setLotes(prev => [loteAdaptado, ...prev]);
    }

    setIsAddModalOpen(false);
    setLoteEdicionCompleto(null);
  };

  const handleEjecutarTraspasoLote = (datosTraspaso: DatosTraspasoLotePayload) => {
    if (!loteATraspasar) return;

    const listaNuevos = datosTraspaso.nuevosPropietarios || [];
    const adquirentesValidos = listaNuevos
      .map(n => ({
        nombre: (n.nombre || '').trim(),
        certificado: n.certificado || 'CERT-S/N'
      }))
      .filter(n => n.nombre !== '');

    if (adquirentesValidos.length === 0) {
      alert('Error: Debe seleccionar adquirentes válidos para ejecutar el traspaso.');
      return;
    }

    const propietariosActuales = loteATraspasar.propietarios?.length ? loteATraspasar.propietarios : [loteATraspasar.propietario || 'Sin propietario asignado'];
    const fechaOperacion = datosTraspaso.fecha || new Date().toLocaleDateString('es-MX');
    const acto = datosTraspaso.actoJuridico || 'Cesión de derechos';

    const dueñosSalientes: PropietarioHistoricoLote[] = propietariosActuales.map(nombre => ({
      nombre,
      certificado: 'CERT-ANTECEDENTE',
      fechaAdquisicion: loteATraspasar.fechaRegistro || '—',
      fechaCesion: fechaOperacion,
      actoJuridico: acto,
      adquirente: adquirentesValidos.map(a => a.nombre).join(', '),
      esActual: false,
    }));

    const nuevosRegistros: PropietarioHistoricoLote[] = adquirentesValidos.map((a) => ({
      nombre: a.nombre,
      certificado: a.certificado,
      fechaAdquisicion: fechaOperacion,
      fechaCesion: '— (Actual)',
      actoJuridico: acto,
      adquirente: 'Titular activo',
      esActual: true,
    }));

    const historialCombinado = [...nuevosRegistros, ...dueñosSalientes, ...(loteATraspasar.historialPropietarios ?? [])];
    const nuevosNombres = adquirentesValidos.map(a => a.nombre);

    const titularesPorLote = leerTitularesLocal();
    titularesPorLote[loteATraspasar.id || loteATraspasar.folioInterno] = {
      propietarios: nuevosNombres,
      historialPropietarios: historialCombinado,
    };
    guardarTitularesLocal(titularesPorLote);

    setLotes(prev => prev.map(l => {
      if (l.folio !== loteATraspasar.folioInterno && l.id !== loteATraspasar.id) return l;
      return {
        ...l,
        propietarios: nuevosNombres,
      };
    }));

    setLoteATraspasar(null);
    setSelectedLote(null);
  };

  const dividirLote = (loteOrigen: LoteSimplificado) => {
    setLoteADividir(loteOrigen);
  };

  const handleConfirmarDivisionLote = (payload: {
    comuneroId: string;
    nombreCompleto: string;
    largo: number;
    ancho: number;
    superficieFraccion: number;
    motivo: string;
  }) => {
    if (!loteADividir) return;

    const loteOrigen = loteADividir;
    const superficieOriginal = Number.parseFloat(loteOrigen.superficie) || 0;
    const superficieNueva = Math.max(payload.superficieFraccion, 0.01);
    const nuevoId = `lote-${Date.now()}`;
    const nombreBase = loteOrigen.numero.replace(/\s*[-–].*$/, '');
    const fechaActual = new Date().toISOString().split('T')[0];

    const historialOrigen = leerTitularesLocal()[loteOrigen.id] ?? {
      propietarios: loteOrigen.propietarios,
      historialPropietarios: [] as PropietarioHistoricoLote[]
    };

    const nuevoHistorialOriginal: PropietarioHistoricoLote[] = [
      ...(historialOrigen.historialPropietarios ?? []),
      {
        nombre: payload.nombreCompleto.trim(),
        certificado: `CERT-DIV-${Date.now().toString().slice(-6)}`,
        fechaAdquisicion: fechaActual,
        fechaCesion: '— (Fracción vendida)',
        actoJuridico: payload.motivo || 'División de lote',
        adquirente: 'Fracción segregada',
        esActual: false,
      },
    ];

    const loteRestante: LoteSimplificado = {
      ...loteOrigen,
      id: loteOrigen.id,
      superficie: `${(superficieOriginal - superficieNueva).toFixed(2)} m²`,
      propietarios: loteOrigen.propietarios,
      estadoPredial: loteOrigen.estadoPredial,
    };

    const nuevoLote: LoteSimplificado = {
      id: nuevoId,
      numero: `${nombreBase} - Fracción`,
      folio: `F-${Date.now().toString().slice(-6)}`,
      superficie: `${superficieNueva.toFixed(2)} m²`,
      propietarios: [payload.nombreCompleto.trim()],
      estadoPredial: loteOrigen.estadoPredial,
    };

    const titularesPorLote = leerTitularesLocal();
    titularesPorLote[loteRestante.id] = {
      propietarios: loteRestante.propietarios,
      historialPropietarios: nuevoHistorialOriginal,
    };
    titularesPorLote[nuevoLote.id] = {
      propietarios: nuevoLote.propietarios,
      historialPropietarios: [
        {
          nombre: payload.nombreCompleto.trim(),
          certificado: `CERT-DIV-${Date.now().toString().slice(-6)}`,
          fechaAdquisicion: fechaActual,
          fechaCesion: '— (Actual)',
          actoJuridico: payload.motivo || 'División de lote',
          adquirente: 'Titular activo',
          esActual: true,
        },
        {
          nombre: loteOrigen.propietarios[0] || 'Titular de origen',
          certificado: 'CERT-ORIGEN',
          fechaAdquisicion: fechaActual,
          fechaCesion: fechaActual,
          actoJuridico: payload.motivo || 'División de lote',
          adquirente: payload.nombreCompleto.trim(),
          esActual: false,
        },
      ],
    };
    guardarTitularesLocal(titularesPorLote);

    setLotes(prev => {
      const sinOriginal = prev.filter(item => item.id !== loteOrigen.id);
      return [loteRestante, nuevoLote, ...sinOriginal];
    });

    if (selectedLote?.id === loteOrigen.id) {
      setSelectedLote(enriquecerLoteConHistorial(loteRestante));
    }
    setLoteADividir(null);
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
            onSelect={(lote) => setSelectedLote(enriquecerLoteConHistorial(lote))}
            onEdit={activarEdicionDeLote}
            onDelete={handleEliminarLote}
            onTraspasar={activarTraspasoDeLote}
          />
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-12 text-center text-gray-400 font-medium text-xs sm:text-sm shadow-sm">
            No se encontraron lotes que coincidan con la búsqueda.
          </div>
        )}
      </div>

      {/* Modal de Detalle de Lote */}
      {selectedLote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedLote(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto z-10 animate-slide-up">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-20">
              <h3 className="text-base font-bold text-gray-800">Expediente del Lote</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => activarTraspasoDeLote(selectedLote)}
                  className="px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100/80 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                >
                   Traspasar
                </button>
                <button
                  onClick={() => activarEdicionDeLote(selectedLote)}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 rounded-lg text-xs font-bold transition-colors"
                >
                  Editar
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
              <LoteDetail lote={selectedLote} onDividir={dividirLote} />
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar/Editar Lote */}
      {isAddModalOpen && (
        <AgregarLoteForm 
          comunerosRegistrados={comuneros} 
          onClose={handleCancelarFormulario} 
          onGuardar={handleGuardarLote} 
          loteAEditar={loteEdicionCompleto} 
        />
      )}

      {/* Modal Traspasar Lote */}
      {loteATraspasar && (
        <TraspasarLoteModal
          lote={loteATraspasar}
          comunerosRegistrados={comuneros}
          onClose={() => setLoteATraspasar(null)}
          onConfirmar={handleEjecutarTraspasoLote}
        />
      )}

      {loteADividir && (
        <DividirLoteModal
          lote={loteADividir}
          comunerosRegistrados={comuneros}
          onClose={() => setLoteADividir(null)}
          onConfirmar={handleConfirmarDivisionLote}
        />
      )}

    </div>
  );
};

export default LotesFeature;
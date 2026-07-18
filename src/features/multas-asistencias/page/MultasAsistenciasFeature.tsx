"use client";

import React, { useMemo, useState } from 'react';
import { MultasHeader } from '../components/MultasHeader';
import { MultasList } from '../components/MultasList';
import { MultaDetail } from '../components/MultaDetail';
import { PagarMultaModal } from '../components/modals/PagarMultaModal';
import { ReciboPagoModal } from '../components/modals/ReciboPagoModal';
import { AgregarMultaForm } from '../components/AgregarMultaForm';
import { EditarMultaForm } from '../components/modals/Editarmultaform';
import { ConfirmarEliminarModal } from '../components/modals/Confirmareliminarmodal';
import { Multa, TipoMulta, EstadoMulta } from '../types/types';
import { multasMock } from '../mocks/multasMock';

export default function MultasAsistenciasFeature() {
  const [multas, setMultas] = useState<Multa[]>(multasMock);
  const [selectedId, setSelectedId] = useState<string>('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoMulta | 'todos'>('todos');
  const [filtroEstado, setFiltroEstado] = useState<EstadoMulta | 'todos'>('todos');

  const [modalDetalle, setModalDetalle] = useState<Multa | null>(null);
  const [modalPago, setModalPago] = useState<Multa | null>(null);
  const [modalRecibo, setModalRecibo] = useState<Multa | null>(null);
  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState<Multa | null>(null);
  const [modalEliminar, setModalEliminar] = useState<Multa | null>(null);

  const multasFiltradas = useMemo(() => {
    return multas.filter((m) => {
      const coincideBusqueda = m.comuneroNombre.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = filtroTipo === 'todos' || m.tipo === filtroTipo;
      const coincideEstado = filtroEstado === 'todos' || m.estado === filtroEstado;
      return coincideBusqueda && coincideTipo && coincideEstado;
    });
  }, [multas, busqueda, filtroTipo, filtroEstado]);

  const confirmarPago = (multa: Multa) => {
    const reciboFolio = `REC-${Date.now().toString().slice(-6)}`;
    const multaPagada: Multa = {
      ...multa,
      estado: 'pagada',
      fechaPago: new Date().toISOString(),
      reciboFolio,
    };
    setMultas((prev) => prev.map((m) => (m.id === multa.id ? multaPagada : m)));
    setModalPago(null);
    setModalRecibo(multaPagada);
  };

  const agregarMulta = (nuevaMulta: Multa) => {
    setMultas((prev) => [nuevaMulta, ...prev]);
    setModalAgregar(false);
    setSelectedId(nuevaMulta.id);
  };

  const guardarEdicion = (multaActualizada: Multa) => {
    setMultas((prev) => prev.map((m) => (m.id === multaActualizada.id ? multaActualizada : m)));
    setModalEditar(null);
  };

  const confirmarEliminacion = (multa: Multa) => {
    setMultas((prev) => prev.filter((m) => m.id !== multa.id));
    setModalEliminar(null);
    if (selectedId === multa.id) setSelectedId('');
  };

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 animate-fade-in w-full px-2 sm:px-4 py-2 max-w-[1600px] mx-auto relative">
      <MultasHeader
        onBusquedaChange={setBusqueda}
        filtroTipo={filtroTipo}
        onFiltroTipoChange={setFiltroTipo}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={setFiltroEstado}
        onAgregarClick={() => setModalAgregar(true)}
      />

      <MultasList
        multas={multasFiltradas}
        selectedId={selectedId}
        onSelect={(m) => {
          setSelectedId(m.id);
          setModalDetalle(m);
        }}
        onEditarClick={(m) => setModalEditar(m)}
        onEliminarClick={(m) => setModalEliminar(m)}
      />

      {modalDetalle && (
        <MultaDetail
          multa={modalDetalle}
          onClose={() => setModalDetalle(null)}
          onPagarClick={() => {
            setModalDetalle(null);
            setModalPago(modalDetalle);
          }}
        />
      )}

      {modalPago && (
        <PagarMultaModal multa={modalPago} onClose={() => setModalPago(null)} onConfirmar={confirmarPago} />
      )}

      {modalRecibo && (
        <ReciboPagoModal multa={modalRecibo} onClose={() => setModalRecibo(null)} />
      )}

      {modalAgregar && (
        <AgregarMultaForm onClose={() => setModalAgregar(false)} onGuardar={agregarMulta} />
      )}

      {modalEditar && (
        <EditarMultaForm multa={modalEditar} onClose={() => setModalEditar(null)} onGuardar={guardarEdicion} />
      )}

      {modalEliminar && (
        <ConfirmarEliminarModal multa={modalEliminar} onClose={() => setModalEliminar(null)} onConfirmar={confirmarEliminacion} />
      )}
    </div>
  );
}
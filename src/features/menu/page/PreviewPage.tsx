"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardView from '../components/DashboardView';
import { ComunerosFeature } from '../../comuneros/page/ComunerosFeature';
import { ParcelasFeature } from '../../parcelas/page/ParcelasFeature';
import { LotesFeature } from '../../lotes/page/LotesFeature';

// 💡 CORREGIDO: Añadida la barra diagonal '/' que faltaba en la ruta relativa
import { PredialPagos } from '../../pagos/page/PredialPagos';

export const PreviewPage: React.FC = () => {
  const [currentView, setView] = useState<string>('dashboard');

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased">
      
      {/* El Sidebar pasa el estado de la vista de forma global */}
      <Sidebar currentView={currentView} setView={setView} />

      {/* Contenedor dinámico del panel derecho */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 pt-20 lg:pt-8 space-y-8 overflow-y-auto h-screen">
        
        {/* VISTA: Dashboard */}
        {currentView === 'dashboard' && (
          <div className="animate-fade-in">
            <DashboardView />
          </div>
        )}

        {/* VISTA: Comuneros */}
        {currentView === 'comuneros' && (
          <ComunerosFeature />
        )}

        {/* VISTA: Parcelas */}
        {currentView === 'parcelas' && (
          <ParcelasFeature />
        )}

        {/* VISTA: Lotes */}
        {currentView === 'lotes' && (
          <LotesFeature />
        )}

        {/* 💡 CORREGIDO: Ahora sí asignamos PredialPagos a su vista correspondiente ('pagos') */}
        {currentView === 'pagos' && (
          <PredialPagos />
        )}

        {/* OTRAS VISTAS EN CONSTRUCCIÓN */}
        {/* 💡 CORREGIDO: Agregamos 'pagos' a la lista de excluidos para que cargue limpio */}
        {!['dashboard', 'comuneros', 'parcelas', 'lotes', 'pagos'].includes(currentView) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium capitalize animate-fade-in">
            Sección de <span className="font-bold text-gray-700">{currentView.replace('-', ' ')}</span> en desarrollo.
          </div>
        )}

      </main>
    </div>
  );
};

export default PreviewPage;
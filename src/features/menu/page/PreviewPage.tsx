"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardView from '../components/DashboardView';
import { ComunerosFeature } from '../../comuneros/page/ComunerosFeature';
import { ParcelasFeature } from '../../parcelas/page/ParcelasFeature';
import { LotesFeature } from '../../lotes/page/LotesFeature';
import MultasAsistenciasFeature from '../../multas-asistencias/page/MultasAsistenciasFeature';
import KioscoQRFeature from '../../kiosco-qr/page/KioscoQRFeature';
import ReportesFeature from '../../reportes/page/ReportesFeature';
import { PredialPagos } from '../../pagos/page/PredialPagos';
import { BarriosFeature } from '../../barrios/page/BarriosFeature';

const VISTAS_CONOCIDAS = [
  'dashboard',
  'comuneros',
  'parcelas',
  'lotes',
  'pagos',
  'multas-asistencias',
  'kiosco-qr',
  'reportes',
  'barrios',
];

export const PreviewPage: React.FC = () => {
  const [currentView, setView] = useState<string>('dashboard');

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased">

      <Sidebar currentView={currentView} setView={setView} />

      <main className="flex-1 min-w-0 p-4 sm:p-8 pt-20 lg:pt-8 space-y-8 overflow-y-auto h-screen">

        {currentView === 'dashboard' && (
          <div className="animate-fade-in">
            <DashboardView />
          </div>
        )}

        {currentView === 'comuneros' && (
          <ComunerosFeature onIrABarrios={() => setView('barrios')} />
        )}

        {currentView === 'barrios' && (
          <BarriosFeature onVolver={() => setView('comuneros')} />
        )}

        {currentView === 'parcelas' && (
          <ParcelasFeature />
        )}

        {currentView === 'lotes' && (
          <LotesFeature />
        )}

        {currentView === 'pagos' && (
          <PredialPagos />
        )}

        {currentView === 'multas-asistencias' && (
          <MultasAsistenciasFeature />
        )}

        {currentView === 'kiosco-qr' && (
          <KioscoQRFeature />
        )}

        {currentView === 'reportes' && (
          <ReportesFeature />
        )}

        {!VISTAS_CONOCIDAS.includes(currentView) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium capitalize animate-fade-in">
            Sección de <span className="font-bold text-gray-700">{currentView.replace('-', ' ')}</span> en desarrollo.
          </div>
        )}

      </main>
    </div>
  );
};

export default PreviewPage;
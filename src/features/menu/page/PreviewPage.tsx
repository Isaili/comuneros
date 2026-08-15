"use client";

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DashboardView from '../components/DashboardView';
import { ComunerosFeature } from '../../comuneros/page/ComunerosFeature';
import { ParcelasFeature } from '../../parcelas/page/ParcelasFeature';
import LotesFeature from '../../lotes/page/LotesFeature';
import MultasAsistenciasFeature from '../../multas-asistencias/page/MultasAsistenciasFeature';
import KioscoQRFeature from '../../kiosco-qr/page/KioscoQRFeature';
import BienvenidaComuneroFeature from '../../bienvenida-comunero/page/BienvenidaComuneroFeature';
import ReportesFeature from '../../reportes/page/ReportesFeature';
import { PredialPagos } from '../../pagos/page/PredialPagos';
import ConfiguracionPage from '../../configure/page/page';

export const PreviewPage: React.FC = () => {
  const [currentView, setView] = useState<string>('dashboard');

  // Arreglo centralizado de vistas activas/válidas
  const vistasValidas = [
    'dashboard',
    'comuneros',
    'parcelas',
    'lotes',
    'pagos',
    'multas-asistencias',
    'reportes',
    'kiosco-qr',
    'Pantalla de Asistencia',
    'configuracion',
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased">
      {/* Sidebar con control de estado */}
      <Sidebar currentView={currentView} setView={setView} />

      <main className="flex-1 min-w-0 p-4 sm:p-8 pt-20 lg:pt-8 space-y-8 overflow-y-auto h-screen">
        {/* VISTA: Dashboard */}
        {currentView === 'dashboard' && (
          <div className="animate-fade-in">
            <DashboardView />
          </div>
        )}

        {/* VISTA: Comuneros */}
        {currentView === 'comuneros' && <ComunerosFeature />}

        {/* VISTA: Parcelas */}
        {currentView === 'parcelas' && <ParcelasFeature />}

        {/* VISTA: Lotes */}
        {currentView === 'lotes' && <LotesFeature />}

        {/* VISTA: Pagos */}
        {currentView === 'pagos' && <PredialPagos />}

        {/* VISTA: Multas y Asistencias */}
        {currentView === 'multas-asistencias' && <MultasAsistenciasFeature />}

        {/* VISTA: Reportes */}
        {currentView === 'reportes' && (
          <div className="animate-fade-in">
            <ReportesFeature />
          </div>
        )}

        {/* VISTA: Kiosco QR */}
        {currentView === 'kiosco-qr' && <KioscoQRFeature />}

        {/* VISTA: Pantalla de Asistencia */}
        {currentView === 'Pantalla de Asistencia' && <BienvenidaComuneroFeature />}

        {/* VISTA: Configuración */}
        {currentView === 'configuracion' && <ConfiguracionPage />}

        {/* VISTAS EN DESARROLLO */}
        {!vistasValidas.includes(currentView) && (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center text-gray-400 font-medium capitalize animate-fade-in">
            Sección de{' '}
            <span className="font-bold text-gray-700">
              {currentView.replace('-', ' ')}
            </span>{' '}
            en desarrollo.
          </div>
        )}
      </main>
    </div>
  );
};

export default PreviewPage;
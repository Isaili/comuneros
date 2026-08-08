"use client";

import React, { useState } from 'react';
import { PagosPredialHeader } from '../components/PagosPredialHeader';
import { PagosPredialSection } from '../components/PagosPredialSection';

export const PredialPagos: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Encabezado: título, fecha actual y buscador */}
        <PagosPredialHeader onSearchChange={setSearchQuery} />

        {/* Renderizado del módulo de pagos unificado */}
        <PagosPredialSection searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default PredialPagos;
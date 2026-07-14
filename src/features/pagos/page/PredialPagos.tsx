import React from 'react';
import { PagosPredialSection } from '../components/PagosPredialSection';

export const PredialPagos: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Renderizado del módulo de pagos unificado */}
        <PagosPredialSection />
        
      </div>
    </div>
  );
};

export default PredialPagos;
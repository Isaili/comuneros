import Link from 'next/link';
import { ArrowLeft, Plus, MapPin } from 'lucide-react';

interface Props {
  onAddClick: () => void;
}

export const BarriosHeader: React.FC<Props> = ({ onAddClick }) => {
  return (
    <div className="space-y-4">
      <Link
        href="/comuneros"
        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors w-fit"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Volver a Comuneros
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight font-serif flex items-center gap-2">
            <span className="p-1.5 bg-slate-100 rounded-lg text-slate-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </span>
            Barrios
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-medium tracking-wide mt-1">
            Administra los barrios o colonias registrados en el padrón.
          </p>
        </div>

        <button
          onClick={onAddClick}
          className="bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 transform hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Agregar barrio
        </button>
      </div>
    </div>
  );
};
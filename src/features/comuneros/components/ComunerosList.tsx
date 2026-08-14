import React, { useState } from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, UserCheck, UserPlus, Users } from 'lucide-react';
import { Comunero } from '@/features/comuneros/types/types';

interface ListProps {
  comuneros: Comunero[];
  selectedId: string;
  onSelect: (comunero: Comunero) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Avatar: React.FC<{ nombre: string; apellidoPaterno: string; foto?: string }> = ({
  nombre,
  apellidoPaterno,
  foto,
}) => {
  const [error, setError] = useState(false);
  const iniciales = `${nombre?.[0] ?? ''}${apellidoPaterno?.[0] ?? ''}`.toUpperCase();

  if (!foto || error) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#006837]/10 text-[#006837] flex items-center justify-center font-bold text-xs shrink-0">
        {iniciales || '?'}
      </div>
    );
  }

  return (
    <img
      src={foto}
      alt={`${nombre} ${apellidoPaterno}`}
      onError={() => setError(true)}
      className="w-10 h-10 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"
    />
  );
};

const TipoBadge: React.FC<{ tipo: string }> = ({ tipo }) => {
  const esComunero = tipo === 'comunero' || tipo === 'COMMUNER';

  return esComunero ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
      <UserCheck className="w-3 h-3" aria-hidden="true" />
      Comunero
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-700 border border-amber-100">
      <UserPlus className="w-3 h-3" aria-hidden="true" />
      Avecindado
    </span>
  );
};

function getNumerosPagina(totalPages: number, paginaActual: number): (number | '...')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (paginaActual <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
  if (paginaActual >= totalPages - 3)
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, '...', paginaActual - 1, paginaActual, paginaActual + 1, '...', totalPages];
}

function getFechaFormateada(c: any): string {
  const rawValue =
    c?.fechaRegistro ??
    c?.communityMemberSince ??
    c?.miembroDesde ??
    null;

  if (!rawValue) return '—';

  try {
    const cleanStr = String(rawValue).trim().split('T')[0];
    const parts = cleanStr.split('-');

    if (parts.length === 3) {
      const [year, month, day] = parts;
      if (year.length === 4 && month && day) {
        return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
      }
    }
    return cleanStr;
  } catch (e) {
    return '—';
  }
}

export const ComunerosList: React.FC<ListProps> = ({
  comuneros,
  selectedId,
  onSelect,
  onEdit,
  onDelete,
  page,
  totalPages,
  onPageChange,
}) => {
  const numerosPagina = getNumerosPagina(totalPages, page);

  if (comuneros.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-gray-300" aria-hidden="true" />
        </div>
        <p className="text-gray-500 font-semibold text-sm">Sin comuneros registrados</p>
        <p className="text-gray-400 text-xs mt-1">Los registros que agregues aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 flex flex-col justify-between min-h-[600px]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-base">
            Lista de comuneros ({comuneros.length})
          </h3>
        </div>

        {/* Vista Escritorio */}
        <div className="hidden sm:block overflow-x-auto">
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
            <tbody className="divide-y divide-gray-50">
              {comuneros.map((c: any) => {
                const nombre = c.nombre ?? c.firstName ?? '';
                const apellidoPaterno = c.apellidoPaterno ?? c.paternalLastName ?? '';
                const apellidoMaterno = c.apellidoMaterno ?? c.maternalLastName ?? '';
                const foto = c.fotografia ?? c.photo ?? null;
                const tipo = c.tipo ?? c.personType ?? 'COMMUNER';
                const vecindario = c.vecindario ?? c.neighborhood ?? '—';
                const miembroDesde = getFechaFormateada(c);

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelect(c)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Ver expediente de ${nombre} ${apellidoPaterno}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect(c);
                      }
                    }}
                    className={`cursor-pointer transition-colors group focus:outline-none focus:bg-[#006837]/5 ${
                      selectedId === c.id ? 'bg-[#006837]/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="py-3 px-2 flex items-center gap-3">
                      <Avatar nombre={nombre} apellidoPaterno={apellidoPaterno} foto={foto} />
                      <div className="min-w-0">
                        <p
                          className={`font-bold leading-tight truncate ${
                            selectedId === c.id ? 'text-[#006837]' : 'text-gray-900'
                          }`}
                        >
                          {nombre}
                        </p>
                        <p className="text-xs text-gray-500 font-medium truncate">
                          {apellidoPaterno} {apellidoMaterno}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <TipoBadge tipo={tipo} />
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-medium whitespace-nowrap">
                      {miembroDesde}
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-medium truncate max-w-[160px]">
                      {vecindario}
                    </td>
                    <td className="py-3 px-2 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEdit(c.id)}
                          aria-label={`Editar a ${nombre} ${apellidoPaterno}`}
                          className="p-2 border border-gray-100 rounded-lg hover:border-emerald-200 hover:bg-emerald-50 text-emerald-600 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(c.id)}
                          aria-label={`Eliminar a ${nombre} ${apellidoPaterno}`}
                          className="p-2 border border-gray-100 rounded-lg hover:border-red-200 hover:bg-red-50 text-red-500 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Vista Móvil */}
        <div className="sm:hidden space-y-2">
          {comuneros.map((c: any) => {
            const nombre = c.nombre ?? c.firstName ?? '';
            const apellidoPaterno = c.apellidoPaterno ?? c.paternalLastName ?? '';
            const apellidoMaterno = c.apellidoMaterno ?? c.maternalLastName ?? '';
            const foto = c.fotografia ?? c.photo ?? null;
            const tipo = c.tipo ?? c.personType ?? 'COMMUNER';
            const vecindario = c.vecindario ?? c.neighborhood ?? '—';
            const miembroDesde = getFechaFormateada(c);

            return (
              <div
                key={c.id}
                onClick={() => onSelect(c)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(c);
                  }
                }}
                className={`border rounded-xl p-3 cursor-pointer transition-colors ${
                  selectedId === c.id ? 'border-[#006837] bg-[#006837]/5' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar nombre={nombre} apellidoPaterno={apellidoPaterno} foto={foto} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      {nombre} {apellidoPaterno} {apellidoMaterno}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <TipoBadge tipo={tipo} />
                      <span className="text-xs text-gray-400 truncate">{vecindario}</span>
                    </div>
                    {miembroDesde !== '—' && (
                      <p className="text-xs text-gray-500 mt-1">
                        Desde: <span className="font-medium text-gray-700">{miembroDesde}</span>
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onEdit(c.id)}
                      aria-label={`Editar a ${nombre} ${apellidoPaterno}`}
                      className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(c.id)}
                      aria-label={`Eliminar a ${nombre} ${apellidoPaterno}`}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-gray-50 text-xs font-bold text-gray-600">
          <button
            type="button"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            aria-label="Página anterior"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {numerosPagina.map((n, idx) =>
            n === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-1 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={n}
                type="button"
                onClick={() => onPageChange(n)}
                aria-current={page === n ? 'page' : undefined}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                  page === n ? 'bg-[#006837] text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {n}
              </button>
            )
          )}

          <button
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            aria-label="Página siguiente"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
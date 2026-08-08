"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Search, Check } from 'lucide-react';

/**
 * Buscador de comunero/avecindado reutilizable.
 * Es genérico (no asume la forma exacta de Comunero) porque en el código
 * original existían DOS formas distintas del tipo Comunero (una con
 * `apellidos`, otra con `apellidoPaterno`/`apellidoMaterno`). Recibe
 * getLabel/getSubtitle para no depender de esa forma.
 */
interface ComuneroPickerProps<T> {
  items: T[];
  selectedId: string;
  onSelect: (item: T) => void;
  getId: (item: T) => string;
  getLabel: (item: T) => string;
  getSubtitle?: (item: T) => string;
  placeholder?: string;
  excludeIds?: string[];
  required?: boolean;
}

export function ComuneroPicker<T>({
  items,
  selectedId,
  onSelect,
  getId,
  getLabel,
  getSubtitle,
  placeholder = 'Buscar por nombre...',
  excludeIds = [],
  required = false,
}: ComuneroPickerProps<T>) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const disponibles = items.filter(item => !excludeIds.includes(getId(item)));
  const filtrados = disponibles
    .filter(item => getLabel(item).toLowerCase().includes(query.toLowerCase()))
    .slice(0, 6);

  const seleccionado = disponibles.find(item => getId(item) === selectedId);

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          required={required}
          placeholder={placeholder}
          value={open ? query : (seleccionado ? getLabel(seleccionado) : query)}
          onFocus={() => { setOpen(true); setQuery(''); }}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 font-bold outline-none focus:border-emerald-600 text-xs"
        />
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
          {filtrados.length > 0 ? (
            filtrados.map((item) => {
              const id = getId(item);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => { onSelect(item); setOpen(false); setQuery(''); }}
                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-gray-700 flex items-center justify-between border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-gray-900 text-xs font-bold">{getLabel(item)}</p>
                    {getSubtitle && <p className="text-[10px] text-gray-400 font-medium">{getSubtitle(item)}</p>}
                  </div>
                  {selectedId === id && <Check className="w-4 h-4 text-emerald-700" />}
                </button>
              );
            })
          ) : (
            <div className="p-3 text-center text-gray-400 text-[11px] font-medium">Ningún comunero coincide.</div>
          )}
        </div>
      )}
    </div>
  );
}
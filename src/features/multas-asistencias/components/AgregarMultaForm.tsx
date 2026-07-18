"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, CircleDollarSign, Calendar, FileText, AlertCircle, Search, Check, UserX, FileWarning } from 'lucide-react';
import * as Yup from 'yup';
import { Multa, TipoMulta } from '../types/types';
import { comunerosSelectMock } from '../mocks/comunerosSelectMock';

interface AgregarMultaFormProps {
  onClose: () => void;
  onGuardar: (multa: Multa) => void;
}

const multaValidationSchema = Yup.object().shape({
  comuneroId: Yup.string().required('Selecciona un comunero'),
  tipo: Yup.string().oneOf(['inasistencia', 'otro']).required(),
  cantidad: Yup.number().typeError('Debe ser un número').positive('Debe ser mayor a 0').required('La cantidad es obligatoria'),
  fechaGeneracion: Yup.string().required('La fecha es obligatoria'),
  descripcion: Yup.string().min(5, 'Describe brevemente el motivo').required('La descripción es obligatoria'),
  asambleaNombre: Yup.string().when('tipo', {
    is: 'inasistencia',
    then: (schema) => schema.required('Indica a qué asamblea no asistió'),
  }),
});

export const AgregarMultaForm: React.FC<AgregarMultaFormProps> = ({ onClose, onGuardar }) => {
  const [comuneroId, setComuneroId] = useState('');
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [tipo, setTipo] = useState<TipoMulta>('inasistencia');
  const [cantidad, setCantidad] = useState('');
  const [fechaGeneracion, setFechaGeneracion] = useState(new Date().toISOString().slice(0, 10));
  const [descripcion, setDescripcion] = useState('');
  const [asambleaNombre, setAsambleaNombre] = useState('');
  const [asambleaFecha, setAsambleaFecha] = useState(new Date().toISOString().slice(0, 10));

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredComuneros = comunerosSelectMock.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { comuneroId, tipo, cantidad, fechaGeneracion, descripcion, asambleaNombre };
    try {
      await multaValidationSchema.validate(formData, { abortEarly: false });
      const comunero = comunerosSelectMock.find((c) => c.id === comuneroId);
      if (!comunero) return;

      const nuevaMulta: Multa = {
        id: Date.now().toString(),
        folio: `MUL-${Date.now().toString().slice(-6)}`,
        comuneroId: comunero.id,
        comuneroNombre: comunero.nombre,
        comuneroFotografia: comunero.fotografia,
        tipo,
        cantidad: Number(cantidad),
        fechaGeneracion,
        descripcion,
        estado: 'pendiente',
        asamblea: tipo === 'inasistencia' ? { id: Date.now().toString(), nombre: asambleaNombre, fecha: asambleaFecha } : undefined,
      };
      onGuardar(nuevaMulta);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) validationErrors[error.path] = error.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] text-gray-700 text-sm font-semibold"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              Registrar multa manual
            </h3>
            <p className="text-sm text-gray-400 font-medium mt-0.5">Captura los datos de la multa a aplicar al comunero.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">

          <div className="space-y-1.5 relative" ref={dropdownRef}>
            <label className="text-gray-500 font-bold block">Comunero *</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Escriba el nombre..."
                value={busqueda}
                onFocus={() => setMenuAbierto(true)}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setMenuAbierto(true);
                  if (!e.target.value) { setComuneroId(''); setNombreCompleto(''); }
                }}
                className={`w-full pl-8 pr-3 py-2.5 bg-white border rounded-xl text-gray-800 font-bold outline-none focus:border-[#1E4D3A] text-sm ${errors.comuneroId ? 'border-red-500' : 'border-gray-200'}`}
              />
            </div>
            {menuAbierto && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                {filteredComuneros.length > 0 ? (
                  filteredComuneros.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setComuneroId(c.id);
                        setNombreCompleto(c.nombre);
                        setBusqueda(c.nombre);
                        setMenuAbierto(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#1E4D3A]/5 text-gray-700 font-semibold flex items-center justify-between border-b border-gray-50 last:border-0"
                    >
                      <p className="text-gray-900 text-sm font-bold">{c.nombre}</p>
                      {comuneroId === c.id && <Check className="w-4 h-4 text-[#1E4D3A]" />}
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-400 text-xs font-medium">Ningún comunero coincide.</div>
                )}
              </div>
            )}
            {errors.comuneroId && <p className="text-red-500 text-xs font-bold mt-1">{errors.comuneroId}</p>}
          </div>


          <div className="space-y-2">
            <label className="text-gray-500 font-bold block">Tipo de multa *</label>
            <div className="grid grid-cols-2 gap-3">
              <label className={`border rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all ${tipo === 'inasistencia' ? 'border-[#1E4D3A] bg-[#1E4D3A]/5 text-[#1E4D3A]' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="tipo" checked={tipo === 'inasistencia'} onChange={() => setTipo('inasistencia')} className="sr-only" />
                <UserX className="w-4 h-4 shrink-0" />
                <p className="font-bold text-sm">Inasistencia</p>
              </label>
              <label className={`border rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all ${tipo === 'otro' ? 'border-[#1E4D3A] bg-[#1E4D3A]/5 text-[#1E4D3A]' : 'border-gray-200 bg-white'}`}>
                <input type="radio" name="tipo" checked={tipo === 'otro'} onChange={() => setTipo('otro')} className="sr-only" />
                <FileWarning className="w-4 h-4 shrink-0" />
                <p className="font-bold text-sm">Otro</p>
              </label>
            </div>
          </div>

          {tipo === 'inasistencia' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-amber-50/50 border border-amber-100 rounded-xl p-3.5">
              <div className="space-y-1.5">
                <label className="text-gray-500 font-bold block">Asamblea *</label>
                <input
                  type="text"
                  value={asambleaNombre}
                  onChange={(e) => setAsambleaNombre(e.target.value)}
                  placeholder="Ej. Asamblea ordinaria mayo 2026"
                  className={`w-full px-2.5 py-2 bg-white border rounded-lg outline-none text-sm ${errors.asambleaNombre ? 'border-red-500' : 'border-gray-200'}`}
                />
                {errors.asambleaNombre && <p className="text-red-500 text-xs font-bold mt-1">{errors.asambleaNombre}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-500 font-bold block">Fecha de la asamblea</label>
                <input
                  type="date"
                  value={asambleaFecha}
                  onChange={(e) => setAsambleaFecha(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm"
                />
              </div>
            </div>
          )}


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Cantidad *</label>
              <div className="relative">
                <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="0.00"
                  className={`w-full pl-9 pr-3 py-2.5 border rounded-xl outline-none focus:border-[#1E4D3A] ${errors.cantidad ? 'border-red-500' : 'border-gray-200'}`}
                />
              </div>
              {errors.cantidad && <p className="text-red-500 text-xs font-bold mt-1">{errors.cantidad}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-gray-500 font-bold block">Fecha *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={fechaGeneracion}
                  onChange={(e) => setFechaGeneracion(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl outline-none focus:border-[#1E4D3A]"
                />
              </div>
            </div>
          </div>


          <div className="space-y-1.5">
            <label className="text-gray-500 font-bold block">Descripción *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Detalle breve del motivo..."
                className={`w-full pl-9 pr-3 py-2.5 border rounded-xl outline-none resize-none focus:border-[#1E4D3A] ${errors.descripcion ? 'border-red-500' : 'border-gray-200'}`}
              />
            </div>
            {errors.descripcion && <p className="text-red-500 text-xs font-bold mt-1">{errors.descripcion}</p>}
          </div>

          <div className="flex items-start gap-2.5 bg-[#F5F3F3] border border-[#E6E8EB] p-3.5 rounded-xl">
            <AlertCircle className="w-4 h-4 text-[#5F5E5E] shrink-0 mt-0.5" />
            <p className="text-sm text-[#5F5E5E] leading-relaxed font-medium">
              La multa se registrará como pendiente. El pago se liquida después desde el detalle.
            </p>
          </div>
        </div>


        <div className="p-4 border-t border-gray-100 bg-slate-50/50 flex items-center justify-end gap-2 shrink-0">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-sm font-bold text-gray-600 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-[#1E4D3A] hover:bg-[#153629] text-white rounded-lg text-sm font-bold transition-colors shadow-sm">
            Registrar multa
          </button>
        </div>
      </form>
    </div>
  );
};
"use client";

import React from 'react';

function formatearComoFecha(valor: string): string {
  const digitos = valor.replace(/\D/g, '').slice(0, 8);
  const dia = digitos.slice(0, 2);
  const mes = digitos.slice(2, 4);
  const anio = digitos.slice(4, 8);

  let resultado = dia;
  if (mes) resultado += `/${mes}`;
  if (anio) resultado += `/${anio}`;
  return resultado;
}

interface FechaTextInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export const FechaTextInput: React.FC<FechaTextInputProps> = ({
  value,
  onChange,
  required = false,
  placeholder = 'DD/MM/YYYY',
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(formatearComoFecha(e.target.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const teclasPermitidas = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End',
    ];
    if (teclasPermitidas.includes(e.key) || e.metaKey || e.ctrlKey) return;
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      maxLength={10}
      className={className}
    />
  );
};
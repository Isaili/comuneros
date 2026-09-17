import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, required, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-gray-500 font-bold block">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-red-500 text-[10px] font-bold mt-1">{error}</p>}
  </div>
);

export const inputClass = (hasError?: boolean) =>
  `w-full px-3 py-2.5 border rounded-xl focus:outline-none focus:ring-2 ${
    hasError ? 'border-red-500' : 'border-gray-200'
  }`;

export const selectClass = (hasError?: boolean) =>
  `w-full px-3 py-2.5 border rounded-xl bg-white ${hasError ? 'border-red-500' : 'border-gray-200'}`;
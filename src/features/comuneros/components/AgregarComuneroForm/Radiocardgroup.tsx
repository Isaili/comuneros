import React from 'react';

export interface RadioCardOption {
  value: string;
  label: string;
  desc: string;
}

interface RadioCardGroupProps {
  name: string;
  value: string;
  options: RadioCardOption[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Clase activa por valor de opción; si no se especifica, se usa el color por defecto (verde esmeralda tenue). */
  activeClassNameByValue?: Record<string, string>;
}

const DEFAULT_ACTIVE = 'border-emerald-600 bg-emerald-50/25 text-emerald-800';


export const RadioCardGroup: React.FC<RadioCardGroupProps> = ({
  name,
  value,
  options,
  onChange,
  activeClassNameByValue = {},
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {options.map((option) => {
        const isActive = value === option.value;
        const activeClass = activeClassNameByValue[option.value] ?? DEFAULT_ACTIVE;
        return (
          <label
            key={option.value}
            className={`border rounded-xl px-2 py-2 flex flex-col items-center text-center gap-1 cursor-pointer ${
              isActive ? activeClass : 'border-gray-200 bg-white'
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isActive}
              onChange={onChange}
              className="sr-only"
            />
            <div className="min-w-0">
              <p className="font-bold text-[10px] leading-tight">{option.label}</p>
              <p className="text-[8px] text-gray-400 font-medium leading-tight">{option.desc}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
};
'use client';

import React, { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Leaf 
} from 'lucide-react';

// --- Esquema de validación ---
const loginSchema = yup.object({
  usuario: yup
    .string()
    .required('El usuario o correo es obligatorio')
    .test(
      'usuario-o-correo',
      'Ingresa un usuario válido o un correo electrónico válido',
      (value) => {
        if (!value) return false;
        if (value.includes('@')) {
          return yup.string().email().isValidSync(value);
        }
        return value.length >= 3;
      }
    ),
  password: yup
    .string()
    .required('La contraseña es obligatoria')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  recordar: yup.boolean().default(true),
});

// Tipo definido manualmente (en vez de yup.InferType) para evitar
// el desajuste de "optional vs required" entre Yup y react-hook-form
interface LoginFormData {
  usuario: string;
  password: string;
  recordar: boolean;
}

export default function LoginCopainala() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema) as Resolver<LoginFormData>,
    defaultValues: {
      recordar: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    try {
      console.log('Datos del formulario:', data);
    } catch (err) {
      setLoginError('Usuario o contraseña incorrectos. Intenta de nuevo.');
    }
  };

  return (
    <div className="h-full w-full bg-[#FAFAFA] flex flex-col items-center justify-start p-4 pt-6 sm:pt-10 relative overflow-hidden font-sans">
      
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 bg-[url('https://www.transparenttextures.com/patterns/topography.png')]"></div>

      <div className="w-full max-w-sm z-10 h-full flex flex-col justify-between gap-6">
        
        {/* --- HEADER --- */}
        <header className="flex items-center justify-between gap-2 mb-2 shrink-0">
          {/* Escudo México */}
          <div className="w-14 sm:w-16 shrink-0">
            <img 
              src="https://th.bing.com/th/id/R.1ec4f3cefeefdc9c8463c6fca2da4e63?rik=POmiAu2hUvchEQ&pid=ImgRaw&r=0" 
              alt="Escudo de México" 
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Textos Centrales Ajustados con Precisión */}
          <div className="text-center flex flex-col items-center min-w-0 px-1 flex-1">
            <h1 className="text-[21px] sm:text-[23px] font-serif text-gray-900 leading-tight tracking-tight">
              Casa de Bienes<br />Comunales
            </h1>
           
            <h2 className="text-[40px] sm:text-[40px] text-[#C09E5F] mt-0 mb-0 font-[family-name:var(--font-dancing-script)] leading-none select-none tracking-normal">
              "Copainalá"
            </h2>
            
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-600 tracking-widest uppercase leading-snug mt-3">
              CLAVE: 07-021-20001-9
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold text-gray-600 tracking-widest uppercase leading-snug mt-0.5">
              PERIODO 2026-2029
            </p>
            <div className="w-12 h-[1.5px] bg-[#C09E5F] mt-2 rounded-full"></div>
          </div>

          {/* Escudo Chiapas */}
          <div className="w-10 sm:w-12 shrink-0">
            <img 
              src="https://tse1.explicit.bing.net/th/id/OIP.8C8vXyoLrLsLUNeSI1cX2gAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" 
              alt="Escudo de Chiapas" 
              className="w-full h-auto object-contain"
            />
          </div>
        </header>

        {/* --- CUERPO PRINCIPAL --- */}
        <div className="w-full flex-1 flex flex-col justify-center min-h-0">
          
          <div className="space-y-6 my-auto py-4">
            {/* Títulos */}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Leaf className="w-5 h-5 text-[#C09E5F]" />
                <h2 className="text-xl font-bold font-serif text-gray-900">Bienvenido</h2>
              </div>
              <p className="text-gray-500 text-sm">
                Inicia sesión en tu cuenta o <a href="#" className="font-bold text-green-800 hover:text-[#C09E5F] transition-colors">solicita acceso</a>
              </p>

              {loginError && (
                <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                  {loginError}
                </div>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
              
              {/* Input Usuario */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-green-900 " >
                  Usuario o correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('usuario')}
                    className={`block w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:ring-[#C09E5F] focus:border-[#C09E5F] bg-white transition-colors ${
                      errors.usuario ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="ej. capturista@comisaria.gob.mx"
                  />
                </div>
                {errors.usuario && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.usuario.message}
                  </p>
                )}
              </div>

              {/* Input Contraseña */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-green-900">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className={`block w-full pl-10 pr-10 py-3 border rounded-xl text-sm focus:ring-[#C09E5F] focus:border-[#C09E5F] bg-white transition-colors ${
                      errors.password ? 'border-red-400' : 'border-gray-200'
                    }`}
                    placeholder="ingresa tu contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Opciones extra */}
              <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    {...register('recordar')}
                    className="w-4 h-4 rounded border-gray-300 text-[#304033] focus:ring-[#304033] accent-[#304033]"
                  />
                  <span className="text-gray-600 font-medium">Recordar sesión</span>
                </label>
                <a href="#" className="text-green-600 font-medium hover:text-[#C09E5F] transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón Principal */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#213326] to-[#36493A] hover:from-[#1b2a1f] hover:to-[#2b3c2f] disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 px-4 rounded-xl font-medium flex items-center justify-between group transition-all pt-3 text-sm sm:text-base mt-2"
              >
                <span className="w-full text-center pl-6">
                  {isSubmitting ? 'Ingresando...' : 'Ingresar al sistema'}
                </span>
                <ArrowRight className="h-5 w-5 text-[#C09E5F] group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Footer de Seguridad y Créditos */}
          <div className="text-center space-y-2 mt-auto shrink-0 pb-2">
            <div className="flex flex-col items-center justify-center gap-0.5">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C09E5F]" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Conexión segura</span>
              </div>
              <span className="text-[10px] text-gray-400">Tus datos están protegidos</span>
            </div>

            <div className="w-full border-t border-gray-200 pt-2">
              <p className="text-[10px] font-medium text-gray-400">
                Software desarrollado por <span className="font-bold text-[#C09E5F]">Softvana</span>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
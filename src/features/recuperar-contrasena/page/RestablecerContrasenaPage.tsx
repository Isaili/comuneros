import { Suspense } from 'react';
import RestablecerContrasena from '@/features/recuperar-contrasena/components/RestablecerContrasena';

export default function RestablecerContrasenaPage() {
  return (
    <Suspense fallback={null}>
      <RestablecerContrasena />
    </Suspense>
  );
}

import LoginCopainala from '@/features/login/components/LoginCopainala';
import DashboardHero from '@/features/login/components/DashboardHero';

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Panel izquierdo: Login */}
      <div className="w-full lg:w-[42%] h-full">
        <LoginCopainala />
      </div>

      {/* Panel derecho: Dashboard (oculto en móvil/tablet) */}
      <div className="hidden lg:block lg:w-[58%] h-full">
        <DashboardHero />
      </div>
    </div>
  );
}
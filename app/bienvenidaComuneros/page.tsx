import BienvenidaComuneroFeature from "@/features/bienvenida-comunero/page/BienvenidaComuneroFeature";
import Sidebar from "@/features/menu/components/Sidebar";

export default function BienvenidaComuneroPage() {
  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans antialiased">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-8 pt-20 lg:pt-8 space-y-8 overflow-y-auto h-screen">
        <BienvenidaComuneroFeature />
      </main>
    </div>
  );
}
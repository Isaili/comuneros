import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg text-center p-8">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-6">
          Lo sentimos, el recurso que buscas no existe o fue movido.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ir al inicio</Link>
          <Link href="/menu" className="inline-block border border-gray-300 px-4 py-2 rounded hover:bg-gray-100">Volver</Link>
        </div>
      </div>
    </div>
  );
}

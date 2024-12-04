'use client'

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <main className="min-h-screen bg-gray-100 py-16">
        <section className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-center">
              Simulación de Teoría de Colas
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-center text-gray-600">
              Modela y simula sistemas de colas con parámetros personalizables.
            </p>
            <div className="text-center">
              <button
                onClick={() => router.push('/mmc-simulate')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded shadow-md transition duration-300 ease-in-out"
              >
                Iniciar Simulación
              </button>
            </div>
          </div>
          {/* About Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Acerca de QueueSim
            </h2>
            <p className="text-lg text-gray-600">
              QueueSim es una herramienta de simulación que te permite explorar y entender la teoría de colas de manera interactiva. Con parámetros personalizables, puedes modelar diversos escenarios y observar su comportamiento en tiempo real.
            </p>
          </section>
          {/* Features Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Características Principales
            </h2>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Simulación en tiempo real</li>
              <li>Parámetros personalizables</li>
              <li>Representación gráfica</li>
              <li>Resultados detallados</li>
            </ul>
          </section>
          {/* How It Works Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Cómo Funciona
            </h2>
            <ol className="list-decimal pl-6 text-gray-600">
              <li>Ingresa tus parámetros de simulación.</li>
              <li>Inicia la simulación y observa el proceso.</li>
              <li>Analiza los resultados obtenidos.</li>
            </ol>
          </section>
        </section>
      </main>
    </>
  );
}
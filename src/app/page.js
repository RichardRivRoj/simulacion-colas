import Link from "next/link";
import {
  ArrowRight,
  Users,
  ClipboardList,
  BarChart3,
  Activity,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center content-center text-center">
          <img src="logo_white.svg" alt="Logo" className="w-48" />
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Simulador de Colas
          </h1>
          <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Sistema de simulación de colas basado en el método Monte Carlo para
            optimizar la gestión de servicios y tiempos de espera.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols lg:grid-cols">
            {[
              {
                title: "Simulación",
                description: "Configura los parámetros de la simulación",
                icon: ClipboardList,
                href: "/form",
                color: "bg-green-500",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="relative p-6 transition-all duration-300 bg-white rounded-lg shadow-lg group hover:shadow-xl"
              >
                <div
                  className={`${item.color} inline-flex p-3 rounded-lg text-white mb-4`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{item.description}</p>
                <div className="flex items-center mt-4 text-blue-500 group-hover:text-blue-600">
                  Explorar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="p-8 mt-16 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            Sobre el Modelo de Colas
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-600">
              Un sistema de colas es un conjunto de clientes que llegan a un
              sistema buscando un servicio, esperan si este no es inmediato, y
              abandonan el sistema una vez han sido atendidos. En este
              simulador, implementamos:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
              <li>Distribución de llegadas según proceso de Poisson (λ)</li>
              <li>Tiempos de servicio exponenciales (μ)</li>
              <li>Sistema flexible de 4 a 10 mesas de servicio</li>
              <li>Opciones de cola limitada o ilimitada</li>
              <li>Simulación basada en el método Monte Carlo</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

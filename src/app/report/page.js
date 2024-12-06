'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const [results, setResults] = useState(null);

  createSimulationResults();

  useEffect(() => {
    const savedResults = localStorage.getItem('simulationResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  if (!results) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              No hay resultados disponibles
            </h1>
            <Link
              href="/form"
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600"
            >
              <ArrowLeft className="mr-2" />
              Volver al formulario
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const chartOptions = {
    title: {
      text: 'Clientes Totales, Atendidos y En Cola',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      bottom: 0,
    },
    xAxis: {
      type: 'category',
      data: ['Clientes'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Total',
        type: 'bar',
        data: [results.totalCustomers],
        itemStyle: { color: '#4caf50' }, // Verde
      },
      {
        name: 'Atendidos',
        type: 'bar',
        data: [results.servedCustomers],
        itemStyle: { color: '#2196f3' }, // Azul
      },
      {
        name: 'En Cola',
        type: 'bar',
        data: [results.finalQueueLength],
        itemStyle: { color: '#ffc107' }, // Amarillo
      },
    ],
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <h1 className="mb-6 text-3xl font-bold text-gray-900">Resultados de la Simulación</h1>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Estadísticas Generales */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Estadísticas Generales</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Tiempo total de simulación
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {Math.floor(results.totalTime)} minutos
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Clientes totales</dt>
                  <dd className="text-lg font-semibold text-gray-900">{results.totalCustomers}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Clientes atendidos</dt>
                  <dd className="text-lg font-semibold text-gray-900">{results.servedCustomers}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Longitud máxima de cola</dt>
                  <dd className="text-lg font-semibold text-gray-900">{results.maxQueueLength}</dd>
                </div>
              </dl>
            </div>

            {/* Gráfico */}
            <div className="p-6 bg-gray-50 rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Gráfico de Clientes</h2>
              <p>En desarrollo</p>
              /* <ReactECharts option={chartOptions} style={{ height: '300px', width: '100%' }} /> */
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/form"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nueva Simulación
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

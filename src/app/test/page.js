'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReportsPage() {
  const [results, setResults] = useState(null);

  useEffect(() => {
    const savedResults = localStorage.getItem('simulationResults');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">No hay resultados disponibles</h1>
          <Link
            href="/form"
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft className="mr-2" />
            Volver al formulario
          </Link>
        </div>
      </div>
    );
  }

  // Configuración del gráfico
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
        itemStyle: { color: '#8884d8' },
      },
      {
        name: 'Atendidos',
        type: 'bar',
        data: [results.servedCustomers],
        itemStyle: { color: '#82ca9d' },
      },
      {
        name: 'En Cola',
        type: 'bar',
        data: [results.finalQueueLength],
        itemStyle: { color: '#ffc658' },
      },
    ],
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">Resultados de la Simulación</h1>

          <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
            <div className="p-6 rounded-lg bg-gray-50">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Estadísticas Generales</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tiempo total de simulación</dt>
                  <dd className="text-lg font-semibold text-gray-900">{Math.floor(results.totalTime)} minutos</dd>
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

            <div className="p-6 rounded-lg bg-gray-50">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Gráfico de Clientes</h2>
              <div className="w-full h-64">
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Link
              href="/form"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nueva Simulación
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


return (
  <div className="min-h-screen py-12 bg-gray-100">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Simulación de Cola</h1>
      <div className="mt-8">
        {formData && (
          <div>
            <p className="text-lg text-gray-700">
              Configuración: {formData.numberOfTables} mesas, Tasa de Llegada
              λ = {formData.arrivalRate}, Tasa de Servicio μ ={" "}
              {formData.serviceRate}
            </p>
            <button
              className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
              onClick={runSimulation}
            >
              Iniciar Simulación
            </button>
          </div>
        )}
        {loading && <p>Simulando...</p>}
        {simulationData.length > 0 && (
          <div className="mt-6">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2 border">Cliente</th>
                  <th className="px-4 py-2 border">Tiempo de Llegada</th>
                  <th className="px-4 py-2 border">Tiempo de Servicio</th>
                  <th className="px-4 py-2 border">Inicio de Servicio</th>
                  <th className="px-4 py-2 border">Tiempo de Espera</th>
                  <th className="px-4 py-2 border">Tiempo de Salida</th>
                  <th className="px-4 py-2 border">Tiempo en el Sistema</th>
                  <th className="px-4 py-2 border">Servidor Asignado</th>
                </tr>
              </thead>
              <tbody>
                {simulationData.map((client, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{client.client}</td>
                    <td className="px-4 py-2 border">
                      {formatValue(client.arrivalTime)}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatValue(client.serviceTime)}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatValue(client.startTimeService)}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatValue(client.waitingTime)}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatValue(client.departureTime)}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatValue(client.timeInSystem)}
                    </td>
                    <td className="px-4 py-2 border">
                      {client.serverAssigned}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </div>
);
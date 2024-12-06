'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Users, 
  Clock,
  AlertCircle 
} from 'lucide-react';

export default function FormPage() {
  const [queueLimitEnabled, setQueueLimitEnabled] = useState(false);
  const [formData, setFormData] = useState({
    numberOfTables: '',
    queueLimit: '',
    arrivalRate: '',
    serviceRate: ''
  });
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir los valores a números si es necesario
    const numericData = {
      numberOfTables: parseFloat(formData.numberOfTables),
      arrivalRate: parseFloat(formData.arrivalRate),
      serviceRate: parseFloat(formData.serviceRate)
    };
    if (queueLimitEnabled) {
      numericData.queueLimit = parseFloat(formData.queueLimit);
    }
    localStorage.setItem('simulationConfig', JSON.stringify(numericData));
    router.push('/simulation');
  };

  // Agregar un manejador de cambio para cada input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-b from-gray-50 to-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="p-8 bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center mb-8">
            <Settings className="w-8 h-8 mr-3 text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-900">
              Configuración de la Simulación
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Número de Mesas
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    name="numberOfTables"
                    type="number"
                    min="4"
                    max="10"
                    required
                    className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    title="Debe ser un número entero mayor a 0."
                    onChange={handleInputChange}
                    value={formData.numberOfTables}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center">
                  <input
                    name="hasQueueLimit"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    onChange={(e) => setQueueLimitEnabled(e.target.checked)}
                  />
                  <label className="block ml-2 text-sm text-gray-700">
                    Límite en Cola
                  </label>
                </div>
              </div>

              {queueLimitEnabled && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tamaño Límite de Cola
                  </label>
                  <div className="mt-1">
                    <input
                      name="queueLimit"
                      type="number"
                      min="1"
                      required={queueLimitEnabled}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      title="Debe ser un número mayor al número de mesas."
                      onChange={handleInputChange}
                      value={formData.queueLimit}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tasa de Llegada (λ)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    name="arrivalRate"
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    title="Debe ser un número mayor a 0."
                    onChange={handleInputChange}
                    value={formData.arrivalRate}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tasa de Servicio (μ)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    name="serviceRate"
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    title="Debe ser un número mayor a 0."
                    onChange={handleInputChange}
                    value={formData.serviceRate}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-l-4 border-blue-400 bg-blue-50">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    La simulación se ejecutará con una escala de tiempo donde 1 minuto equivale a 1 hora en tiempo real.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Iniciar Simulación
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
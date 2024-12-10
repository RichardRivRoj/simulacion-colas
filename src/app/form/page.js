"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Clock, AlertCircle, Ruler, HandPlatter } from "lucide-react";

export default function FormPage() {
  const [queueLimitEnabled, setQueueLimitEnabled] = useState(false);
  const [formData, setFormData] = useState({
    numberOfTables: "",
    queueLimit: "",
    arrivalRate: "",
    serviceRate: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir los valores a números si es necesario
    const numericData = {
      numberOfTables: parseFloat(formData.numberOfTables),
      arrivalRate: parseFloat(formData.arrivalRate),
      serviceRate: parseFloat(formData.serviceRate),
    };
    if (queueLimitEnabled) {
      numericData.queueLimit = parseFloat(formData.queueLimit);
    }
    localStorage.setItem("simulationConfig", JSON.stringify(numericData));

    const { numberOfTables: c, queueLimit: limit, arrivalRate: lambda, serviceRate: mu } = formData;

    let validationErrors = {};

    // Validaciones
    if (!c || c <= 0)
      validationErrors.numberOfTables =
        "El número de mesas debe ser mayor a 0.";
    if (!lambda || lambda <= 0)
      validationErrors.arrivalRate =
        "La tasa de llegada (λ) debe ser mayor a 0.";
    if (!mu || mu <= 0)
      validationErrors.serviceRate =
        "La tasa de servicio (μ) debe ser mayor a 0.";
    if (lambda && mu && c && lambda > c * mu) {
      validationErrors.arrivalRate =
        "La tasa de llegada (λ) debe ser menor que la capacidad total (c × μ).";
    }
    if (queueLimitEnabled && (!limit || limit >= c)) {
      validationErrors.queueLimit =
        "El tamaño límite de la cola debe ser mayor que el número de mesas (servidores).";
    }

    // Si hay errores, establecerlos y no enviar el formulario
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Si no hay errores
    console.log("Formulario válido. Procesando simulación...");
    router.push("/simulation");
  };

  // Agregar un manejador de cambio para cada input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
                    <HandPlatter className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    name="numberOfTables"
                    type="number"
                    min="4"
                    max="10"
                    step="1"
                    required
                    className="block w-full py-2 pl-10 pr-3 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    title="Debe ser un número entero mayor a 0."
                    onChange={handleInputChange}
                    value={formData.numberOfTables}
                  />
                  {errors.numberOfTables && (
                    <p className="text-sm text-red-500">
                      {errors.numberOfTables}
                    </p>
                  )}
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
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Ruler className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      name="queueLimit"
                      type="number"
                      min="1"
                      required={queueLimitEnabled}
                      placeholder="0"
                      className="block w-full py-2 pl-10 pr-3 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      title="Debe ser un número mayor al número de mesas."
                      onChange={handleInputChange}
                      value={formData.queueLimit}
                    />
                    {errors.queueLimit && (
                      <p className="absolute text-sm text-red-500">
                        {errors.queueLimit}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block pt-1 text-sm font-medium text-gray-700">
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
                    placeholder="0"
                    className="block w-full py-2 pl-10 pr-3 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    title="Debe ser un número mayor a 0."
                    onChange={handleInputChange}
                    value={formData.arrivalRate}
                  />
                  {errors.arrivalRate && (
                    <p className="absolute text-sm text-red-500">{errors.arrivalRate}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block pt-1 text-sm font-medium text-gray-700">
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
                    placeholder="0"
                    className="block w-full py-2 pl-10 pr-3 text-gray-700 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    title="Debe ser un número mayor a 0."
                    onChange={handleInputChange}
                    value={formData.serviceRate}
                  />
                  {errors.serviceRate && (
                    <p className="text-sm text-red-500">{errors.serviceRate}</p>
                  )}
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
                    La simulación se ejecutará con una escala de tiempo donde 1
                    minuto equivale a 1 hora en tiempo real.
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

"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const [results, setResults] = useState(null);
  const [calculatedData, setCalculatedData] = useState(null);

  createSimulationResults();

  useEffect(() => {
    const savedResults = localStorage.getItem("simulationReport");
    if (savedResults) {
      const data = JSON.parse(savedResults);
      setResults(data);
      calculateMetrics(data);
    }
  }, []);

  const factorial = (num) => (num <= 1 ? 1 : num * factorial(num - 1));

  const calculateMetrics = ({ numberOfTables, queueLimit, arrivalRate, serviceRate }) => {
    const v_c = numberOfTables;
    const v_k = queueLimit;
    const v_lambda = arrivalRate;
    const v_mu = serviceRate;

    const v_rho = v_lambda / v_mu; // Utilización por servidor
    const v_rc = v_rho / v_c; // Utilización global del sistema

    // Calcular P₀
    let v_po;
    if (v_rc === 1) {
      const sumatoria = Array.from({ length: v_c }, (_, i) => i).reduce(
        (acc, n) => acc + Math.pow(v_rc, n) / factorial(n),
        0
      );
      v_po =
        1 /
        (sumatoria + (Math.pow(v_rho, v_c) / factorial(v_c)) * (v_k - v_c + 1));
    } else {
      const sumatoria = Array.from({ length: v_c }, (_, i) => i).reduce(
        (acc, n) => acc + Math.pow(v_rho, n) / factorial(n),
        0
      );
      v_po =
        1 /
        (sumatoria +
          (Math.pow(v_rho, v_c) * (1 - Math.pow(v_rc, v_k - v_c + 1))) /
            (factorial(v_c) * (1 - v_rc)));
    }

    // Tabla de n, Pn, Fn
    let n = 0;
    let v_pn_temp = 1;
    let fn_acumulado = 0;
    const resultados = [];

    while (n <= v_k) {
      if (0 <= n && n <= v_c) {
        v_pn_temp = parseFloat(
          ((Math.pow(v_rho, n) / factorial(n)) * v_po).toFixed(4)
        );
      } else if (v_c <= n && n <= v_k) {
        v_pn_temp = parseFloat(
          (
            (Math.pow(v_rho, n) / (factorial(v_c) * Math.pow(v_c, n - v_c))) *
            v_po
          ).toFixed(4)
        );
      }

      fn_acumulado += v_pn_temp;

      resultados.push({
        n,
        Pn: v_pn_temp,
        Fn: parseFloat(fn_acumulado.toFixed(4)),
      });

      n++;
    }

    // Calcular métricas
    const Lq =
      (Math.pow(v_rho, v_c) * v_rc * (1 - Math.pow(v_rc, v_k - v_c + 1))) /
      (factorial(v_c) * Math.pow(1 - v_rc, 2)) *
      v_po;
    const Ls = Lq + v_rho;
    const Wq = Lq / v_lambda;
    const Ws = Wq + 1 / v_mu;
    const lambdaEffective = v_lambda * (1 - resultados[v_k].Fn); // Clientes efectivamente atendidos
    const lambdaLost = v_lambda - lambdaEffective; // Clientes perdidos

    setCalculatedData({
      rho: v_rho.toFixed(4),
      po: v_po.toFixed(4),
      Ls: Ls.toFixed(4),
      Lq: Lq.toFixed(4),
      Ws: Ws.toFixed(4),
      Wq: Wq.toFixed(4),
      lambdaEffective: lambdaEffective.toFixed(4),
      lambdaLost: lambdaLost.toFixed(4),
      resultados,
    });
  };

  if (!results || !calculatedData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="p-6 text-center bg-white rounded-lg shadow-lg">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            No hay resultados disponibles
          </h1>
          <p className="mb-6 text-gray-600">Por favor, vuelve al formulario para completar la simulación.</p>
          <Link
            href="/form"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al formulario
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen px-6 py-12 bg-gradient-to-b from-gray-50 to-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="p-8 bg-white rounded-lg shadow-xl">
          <h1 className="mb-8 text-4xl font-bold text-center text-gray-900">
            Resultados de la Simulación
          </h1>
  
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Estadísticas Generales</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">ρ (Utilización):</p>
                <p className="text-xl font-bold text-gray-900">{calculatedData.rho}</p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">P₀:</p>
                <p className="text-xl font-bold text-gray-900">{calculatedData.po}</p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">Lq (Clientes en cola):</p>
                <p className="text-xl font-bold text-gray-900">{calculatedData.Lq}</p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">Ls (Clientes en el sistema):</p>
                <p className="text-xl font-bold text-gray-900">{calculatedData.Ls}</p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">Wq (Tiempo en cola):</p>
                <p className="text-xl font-bold text-gray-900">{calculatedData.Wq}</p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">Ws (Tiempo en el sistema):</p>
                <p className="text-xl font-bold text-gray-900">{calculatedData.Ws}</p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">λ efectivo:</p>
                <p className="text-xl font-bold text-gray-900">{calculatedData.lambdaEffective}</p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">λ perdido:</p>
                <p className="text-xl font-bold text-gray-900">{calculatedData.lambdaLost}</p>
              </div>
            </div>
          </div>
  
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Tabla de n, Pn, Fn</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse table-auto">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 font-medium text-left text-gray-600">n</th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600">Pn</th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600">Fn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {calculatedData.resultados.map(({ n, Pn, Fn }) => (
                    <tr key={n} className="hover:bg-blue-50">
                      <td className="px-6 py-2 text-center text-gray-800">{n}</td>
                      <td className="px-6 py-2 text-center text-gray-800">{Pn}</td>
                      <td className="px-6 py-2 text-center text-gray-800">{Fn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  
          <div className="text-center">
            <Link
              href="/form"
              className="inline-flex items-center px-5 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Nueva Simulación
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}  

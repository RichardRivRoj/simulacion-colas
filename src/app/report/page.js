"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ServerLoadChart from "./components/ServerLoadChart";

export default function ReportsPage() {
  const [results, setResults] = useState(null);
  const [calculatedData, setCalculatedData] = useState(null);
  const [queueSimulationData, setQueueSimulationData] = useState(null);

  useEffect(() => {
    const savedResults = localStorage.getItem("simulationReport");
    if (savedResults) {
      const data = JSON.parse(savedResults);
      setResults(data);
      calculateMetrics(data);
    }

    const savedQueueData = localStorage.getItem("simulationData");
    if (savedQueueData) {
      const queueData = JSON.parse(savedQueueData);
      console.log(queueData);
      setQueueSimulationData(queueData);
    }
  }, []);

  const factorial = (num) => (num <= 1 ? 1 : num * factorial(num - 1));

  const calculateMetrics = ({
    numberOfTables,
    queueLimit,
    arrivalRate,
    serviceRate,
  }) => {
    const v_c = numberOfTables;
    const v_lambda = arrivalRate;
    const v_mu = serviceRate;
    const v_rho = v_lambda / v_mu; // Utilización por servidor
    const v_rc = v_rho / v_c; // Utilización global del sistema

    if (queueLimit == null) {
      // Calcular P0
      const sumatoria = Array.from({ length: v_c }, (_, i) => i).reduce(
        (acc, n) => acc + Math.pow(v_lambda / v_mu, n) / factorial(n),
        0
      );

      const v_po =
        1 /
        (sumatoria +
          Math.pow(v_lambda / v_mu, v_c) /
            (factorial(v_c) * (1 - v_rho / v_c)));

      // Tabla de n, Pn, Fn
      let n = 0;
      let v_pn_temp = 1;
      let fn_acumulado = 0;
      const resultados = [];

      // Calcular n y almacenar los resultados
      while (v_pn_temp > 0) {
        if (0 <= n && n <= v_c) {
          v_pn_temp = parseFloat(
            ((Math.pow(v_lambda / v_mu, n) / factorial(n)) * v_po).toFixed(4)
          );
        } else {
          v_pn_temp = parseFloat(
            (
              (Math.pow(v_lambda / v_mu, n) /
                (factorial(v_c) * Math.pow(v_c, n - v_c))) *
              v_po
            ).toFixed(4)
          );
        }

        if (v_pn_temp > 0) {
          fn_acumulado += v_pn_temp;
          resultados.push({
            n,
            Pn: v_pn_temp,
            Fn: parseFloat(fn_acumulado.toFixed(4)),
          });
          n++;
        }
      }

      const Lq =
        (Math.pow(v_rho, v_c + 1) /
          (factorial(v_c - 1) * Math.pow(v_c - v_rho, 2))) *
        v_po;
      const Ls = Lq + v_rho;
      const Wq = Lq / v_lambda;
      const Ws = Wq + 1 / v_mu;
      const v_lambdae = v_lambda;
      const v_lambdap = v_lambda - v_lambdae;

      const U = Math.random();
      const t_llegada = -Math.log(U) / v_lambda;
      const t_servicio = -Math.log(U) / v_mu;
      const v_sa = v_rc * v_c;
      const v_si = v_c - v_sa;

      setCalculatedData({
        rho: v_rho.toFixed(4),
        rhoc: v_rc.toFixed(4),
        po: v_po.toFixed(4),
        Ls: Ls.toFixed(4),
        Lq: Lq.toFixed(4),
        Ws: Ws.toFixed(4),
        Wq: Wq.toFixed(4),
        lambdaEffective: v_lambdae.toFixed(4),
        lambdaLost: v_lambdap.toFixed(4),
        tl: t_llegada.toFixed(4),
        ts: t_servicio.toFixed(4),
        sa: v_sa.toFixed(4),
        si: v_si.toFixed(4),
        resultados,
      });
    } else {
      const v_k = queueLimit;

      const v_rc = v_rho / v_c;
      // Calcular P₀
      let v_po;
      if (v_rc !== 1) {
        // Caso cuando rho / c ≠ 1
        const sumatoria = Array.from(
          { length: v_c },
          (_, n) => Math.pow(v_rho, n) / factorial(n)
        ).reduce((acc, val) => acc + val, 0);

        const terminoExtra =
          (Math.pow(v_rho, v_c) / factorial(v_c)) *
          ((1 - Math.pow(v_rc, v_k - v_c + 1)) / (1 - v_rc));

        v_po = 1 / (sumatoria + terminoExtra);
      } else {
        // Caso especial cuando rho / c = 1
        const sumatoria = Array.from(
          { length: v_c },
          (_, n) => Math.pow(v_rho, n) / factorial(n)
        ).reduce((acc, val) => acc + val, 0);

        const terminoExtra =
          (Math.pow(v_rho, v_c) / factorial(v_c)) * (v_k - v_c + 1);

        v_po = 1 / (sumatoria + terminoExtra);
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
      let Lq;

      // Caso 1: ρ / c = 1
      if (v_rho / v_c === 1) {
        Lq =
          ((Math.pow(v_rho, v_c) * (v_k - v_c) * (v_k - v_c + 1)) /
            (2 * factorial(v_c))) *
          v_po;
      }
      // Caso 2: ρ / c ≠ 1
      else {
        const term1 =
          Math.pow(v_rho, v_c + 1) /
          (factorial(v_c - 1) * Math.pow(v_c - v_rho, 2));
        const term2 = 1 - Math.pow(v_rho / v_c, v_k - v_c);
        const term3 =
          (v_k - v_c) * Math.pow(v_rho / v_c, v_k - v_c) * (1 - v_rho / v_c);
        Lq = term1 * (term2 - term3) * v_po;
      }

      const lambdaEffective = v_lambda * (1 - resultados.at(-1).Pn); // Clientes efectivamente atendidos
      const lambdaLost = v_lambda - lambdaEffective; // Clientes perdidos
      const Ls = Lq + lambdaEffective / v_mu;
      const Wq = Lq / lambdaEffective;
      const Ws = Wq + 1 / v_mu;
      const t_llegada = 1 / lambdaEffective;
      const t_servicio = 1 / v_mu;
      const v_sa = lambdaEffective / v_mu;
      const v_si = v_c - v_sa;

      setCalculatedData({
        rho: v_rho.toFixed(4),
        rhoc: v_rc.toFixed(4),
        po: v_po.toFixed(4),
        Ls: Ls.toFixed(4),
        Lq: Lq.toFixed(4),
        Ws: Ws.toFixed(4),
        Wq: Wq.toFixed(4),
        lambdaEffective: lambdaEffective.toFixed(4),
        lambdaLost: lambdaLost.toFixed(4),
        tl: t_llegada.toFixed(4),
        ts: t_servicio.toFixed(4),
        sa: v_sa.toFixed(0),
        si: v_si.toFixed(0),
        resultados,
      });
    }
  };

  if (!results || !calculatedData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="p-6 text-center bg-white rounded-lg shadow-lg">
          <h1 className="mb-4 text-3xl font-bold text-gray-800">
            No hay resultados disponibles
          </h1>
          <p className="mb-6 text-gray-600">
            Por favor, vuelve al formulario para completar la simulación.
          </p>
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
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
              Estadísticas Generales
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">ρ (Utilización):</p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.rho}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">ρ/c (Utilización):</p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.rhoc}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">P₀:</p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.po}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">
                  Lq (Clientes en cola):
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.Lq}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">
                  Ls (Clientes en el sistema):
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.Ls}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">
                  Wq (Tiempo en cola):
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.Wq}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">
                  Ws (Tiempo en el sistema):
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.Ws}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">λ efectivo:</p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.lambdaEffective}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">λ perdido:</p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.lambdaLost}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">
                  Tiempo entre usuarios:
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.tl}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">
                  Tiempo de servicio individual:
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.ts}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">
                  Número de servidores activos:
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.sa}
                </p>
              </div>
              <div className="p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-medium text-gray-700">
                  Número de servidores inactivos:
                </p>
                <p className="text-xl font-bold text-gray-900">
                  {calculatedData.si}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
              Tabla de n, Pn, Fn
            </h2>
            {/* Contenedor para scroll vertical */}
            <div className="overflow-y-auto border border-gray-200 rounded-lg shadow-lg max-h-64">
              <table className="w-full border-collapse table-auto">
                {/* Encabezado de la tabla */}
                <thead className="sticky top-0 z-10 bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      n
                    </th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      Pn
                    </th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      Fn
                    </th>
                  </tr>
                </thead>
                {/* Cuerpo de la tabla */}
                <tbody className="divide-y divide-gray-200">
                  {calculatedData.resultados.map(({ n, Pn, Fn }) => (
                    <tr key={n} className="hover:bg-blue-50">
                      <td className="px-6 py-2 text-center text-gray-800">
                        {n}
                      </td>
                      <td className="px-6 py-2 text-center text-gray-800">
                        {Pn}
                      </td>
                      <td className="px-6 py-2 text-center text-gray-800">
                        {Fn}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
              Resumen de la simulacion
            </h2>
            {/* Contenedor para scroll vertical */}
            <div className="overflow-y-auto border border-gray-200 rounded-lg shadow-lg max-h-64">
              <table className="w-full border-collapse table-auto">
                {/* Encabezado de la tabla */}
                <thead className="sticky top-0 z-10 bg-blue-100">
                  <tr>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      Cliente
                    </th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      Hora de llegada
                    </th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      Tiempo de servicio
                    </th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      Hora de inicio del servicio
                    </th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      Tiempo de espera
                    </th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      Hora de salida
                    </th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      Hora en el sistema
                    </th>
                    <th className="px-6 py-3 font-medium text-left text-gray-600 bg-blue-100">
                      Servidor asignado
                    </th>
                  </tr>
                </thead>
                {/* Cuerpo de la tabla */}
                <tbody className="divide-y divide-gray-200">
                  {queueSimulationData.arrivalTimes.map((_, index) => (
                    <tr key={index} className="hover:bg-blue-50">
                      <td className="px-6 py-2 text-center text-gray-800">
                        {index + 1}
                      </td>
                      <td className="px-6 py-2 text-center text-gray-800">
                        {queueSimulationData.arrivalTimes[index].toFixed(2)}
                      </td>
                      <td className="px-6 py-2 text-center text-gray-800">
                        {queueSimulationData.serviceTimes[index].toFixed(2)}
                      </td>
                      <td className="px-6 py-2 text-center text-gray-800">
                        {queueSimulationData.startTimeService[index]?.toFixed(
                          2
                        ) || "Waiting"}
                      </td>
                      <td className="px-6 py-2 text-center text-gray-800">
                        {queueSimulationData.waitingTimes[index].toFixed(2)}
                      </td>
                      <td className="px-6 py-2 text-center text-gray-800">
                        {queueSimulationData.departureTimes[index]?.toFixed(
                          2
                        ) || "Waiting"}
                      </td>
                      <td className="px-6 py-2 text-center text-gray-800">
                        {queueSimulationData.timeInSystem[index]?.toFixed(2) ||
                          "N/A"}
                      </td>
                      <td className="px-6 py-2 text-center text-gray-800">
                        {queueSimulationData.serverAssigned[index] !== undefined
                          ? queueSimulationData.serverAssigned[index] + 1
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h1>Reporte de Simulación</h1>
            <div>
              <ServerLoadChart queueSimulationData={queueSimulationData} /> //
              Pasar los datos al gráfico
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/form"
              className="inline-flex items-center px-5 py-3 mr-2 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Nueva Simulación
            </Link>
            <Link
              href="/"
              className="inline-flex items-center px-5 py-3 mr-2 text-white bg-red-600 rounded-lg shadow-lg hover:bg-red-700"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Ir a Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Bar } from "react-chartjs-2";
  
  // Registrar elementos necesarios
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
  const ServerLoadChart = ({ queueSimulationData }) => {
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      if (queueSimulationData && Array.isArray(queueSimulationData.arrivalTimes) && queueSimulationData.arrivalTimes.length > 0) {
        // Número máximo de servidores
        const num_servidores = Math.max(...queueSimulationData.serverAssigned);
  
        // Crear datos agrupados por cliente
        const clientes = queueSimulationData.arrivalTimes.map((_, index) => `Cliente ${index + 1}`);
  
        // Crear un dataset para cada servidor
        const datasets = [];
        for (let s = 0; s <= num_servidores; s++) {
          const tiemposPorServidor = queueSimulationData.serverAssigned.map((servidor, index) =>
            servidor === s ? queueSimulationData.timeInSystem[index] : 0
          );
  
          datasets.push({
            label: `Servidor ${s}`, // Aquí el índice del servidor empieza en 1
            data: tiemposPorServidor,
            backgroundColor: `rgba(${(s * 50) % 255}, ${(s * 100) % 255}, ${(s * 150) % 255}, 0.7)`,
            borderColor: `rgba(${(s * 50) % 255}, ${(s * 100) % 255}, ${(s * 150) % 255}, 1)`,
            borderWidth: 1,
          });
        }
  
        setChartData({
          labels: clientes,
          datasets,
        });
      }
    }, [queueSimulationData]);
  
    if (!chartData) {
      return <p>No hay datos disponibles para mostrar la carga del servidor.</p>;
    }
  
    return (
      <div>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Carga de los Servidores por Cliente",
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Cliente",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Tiempo en Sistema (minutos)",
                },
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    );
  };
  
  export default ServerLoadChart;
'use client'
class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(element) {
    this.heap.push(element);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex].time > this.heap[index].time) {
        [this.heap[parentIndex], this.heap[index]] = [
          this.heap[index],
          this.heap[parentIndex],
        ];
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  extractMin() {
    if (this.heap.length === 0) return null;
    const min = this.heap[0];
    const lastElement = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = lastElement;
      this.sinkDown(0);
    }
    return min;
  }

  sinkDown(index) {
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallest = index;
      if (
        leftChildIndex < this.heap.length &&
        this.heap[leftChildIndex].time < this.heap[smallest].time
      ) {
        smallest = leftChildIndex;
      }
      if (
        rightChildIndex < this.heap.length &&
        this.heap[rightChildIndex].time < this.heap[smallest].time
      ) {
        smallest = rightChildIndex;
      }
      if (smallest !== index) {
        [this.heap[index], this.heap[smallest]] = [
          this.heap[smallest],
          this.heap[index],
        ];
        index = smallest;
      } else {
        break;
      }
    }
  }
}

function exponential(rate) {
  return -Math.log(1 - Math.random()) / rate;
}

function simulateQueue(formData) {
  const {
    numberOfTables,
    queueLimit,
    arrivalRate,
    serviceRate,
    queueLimitEnabled,
  } = formData;
  const lambda = arrivalRate / 60; // Convert to per minute
  const mu = serviceRate / 60; // Convert to per minute
  const numServers = numberOfTables;
  const numClients = 100; // Number of clients to simulate

  // Initialize arrays to store simulation data
  const arrivalTimes = [];
  const serviceTimes = [];
  const startTimeService = [];
  const waitingTimes = [];
  const departureTimes = [];
  const timeInSystem = [];
  const serverAssigned = [];

  // Generate inter-arrival and service times
  for (let i = 0; i < numClients; i++) {
    arrivalTimes.push(
      i === 0
        ? exponential(1 / lambda)
        : arrivalTimes[i - 1] + exponential(1 / lambda)
    );
    serviceTimes.push(exponential(1 / mu));
  }

  // Initialize priority queue with server availability times
  const serverHeap = new MinHeap();
  for (let i = 0; i < numServers; i++) {
    serverHeap.insert({ time: 0, id: i });
  }

  // Simulate client processing
  for (let i = 0; i < numClients; i++) {
    const arrival = arrivalTimes[i];
    const server = serverHeap.extractMin();
    if (server === null) {
      // No server available and queue is full
      continue;
    }
    const serviceStart = Math.max(arrival, server.time);
    const waiting = serviceStart - arrival;
    const departure = serviceStart + serviceTimes[i];
    startTimeService.push(serviceStart);
    waitingTimes.push(waiting);
    departureTimes.push(departure);
    timeInSystem.push(departure - arrival);
    serverAssigned.push(server.id);
    serverHeap.insert({ time: departure, id: server.id });
  }

  // Prepare data for table
  const simulationData = [];
  for (let i = 0; i < numClients; i++) {
    simulationData.push({
      client: i + 1,
      arrivalTime: arrivalTimes[i].toFixed(2),
      serviceTime: serviceTimes[i].toFixed(2),
      startTimeService: startTimeService[i]
        ? startTimeService[i].toFixed(2)
        : "Waiting",
      waitingTime: waitingTimes[i].toFixed(2),
      departureTime: departureTimes[i]
        ? departureTimes[i].toFixed(2)
        : "Waiting",
      timeInSystem: timeInSystem[i] ? timeInSystem[i].toFixed(2) : "N/A",
      serverAssigned:
        serverAssigned[i] !== undefined ? serverAssigned[i] + 1 : "N/A",
    });
  }

  return simulationData;
}

function formatValue(value) {
  return typeof value === "number" ? value.toFixed(2) : value;
}

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Bath from './components/bath';
import Piano from './components/Piano';
import Kitchen from './components/Kitchen';
import WaitingArea from './components/WaitingArea';
import renderTables from './components/Table';

export default function SimulationPage() {
  const [config, setConfig] = useState(null); // Para almacenar la configuración cargada
  const router = useRouter();

  useEffect(() => {
    // Recuperar la configuración guardada en localStorage
    const data = localStorage.getItem('simulationConfig');
    if (data) {
      const parsedData = JSON.parse(data);
      setConfig(parsedData);
    }
  }, []);

  const handleFinish = () => {
    // Verifica que config tenga los datos necesarios antes de continuar
    if (!config) {
      alert('Error: Configuración no cargada');
      return;
    }

    // Guarda la configuración en localStorage para la vista `/report`
    localStorage.setItem('simulationReport', JSON.stringify(config));
    router.push('/report');
  };

  return (
    <div className="grid w-screen h-screen grid-cols-4 grid-rows-7">
      {/* Fila 1 */}
      <div className="items-center content-center col-span-3 row-span-1 border-t-4 border-l-4 border-gray-800">
        <Piano />
      </div>
      <div className="col-span-1 row-span-2 border-t-4 border-r-4 border-gray-800 bg-amber-50">
        <Kitchen />
      </div>
      
      {/* Fila 2 - Contenedor de las imágenes */}
      <div className="col-span-3 row-span-5 overflow-hidden bg-white border-l-4 border-gray-800">
        {/* Configuración interna para las imágenes */}
        <div className="grid w-[95%] h-auto gap-4 p-2 place-items-center md:grid-cols-3 lg:grid-cols-3">
          {/* Renderiza las imágenes aquí */}
          {config && renderTables({ numberOfTables: config.numberOfTables })}
        </div>
      </div>
      
      <div className="col-span-1 row-span-2 border-t-2 border-l-2 border-r-4 border-gray-800 bg-blue-50">
        <Bath />
      </div>
      
      {/* Fila 3 */}
      <div className="content-end col-span-1 row-span-4 p-2 border-r-4 border-gray-800">
        <WaitingArea />
      </div>
      
      {/* Fila 4 */}
      <div className="col-span-2 row-span-2 bg-red-100"></div>
      <div className="col-span-1 row-span-1 border-t-2 border-l-2 border-gray-800 bg-green-50"></div>
      
      {/* Botón en la esquina superior derecha */}
      <button 
        className="absolute px-4 py-2 text-white bg-blue-500 rounded top-4 right-4 hover:bg-blue-600" 
        onClick={handleFinish} 
        aria-label="Finalizar Simulación"
      >
        Finalizar Simulación
      </button>
    </div>
  );
}

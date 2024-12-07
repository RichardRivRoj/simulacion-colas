"use client";
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

function simulateQueueIndefinitely(formData, setSimulationData, stopFlag) {
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

  // Initialize arrays to store simulation data
  const arrivalTimes = [];
  const serviceTimes = [];
  const startTimeService = [];
  const waitingTimes = [];
  const departureTimes = [];
  const timeInSystem = [];
  const serverAssigned = [];

  // Initialize priority queue with server availability times
  const serverHeap = new MinHeap();
  for (let i = 0; i < numServers; i++) {
    serverHeap.insert({ time: 0, id: i });
  }

  // Initialize client counter
  let clientIndex = 0;

  // Function to generate inter-arrival and service times
  function generateTimes() {
    return {
      arrival: clientIndex === 0 ? exponential(1 / lambda) : arrivalTimes[clientIndex - 1] + exponential(1 / lambda),
      service: exponential(1 / mu),
    };
  }

  // Simulation loop
  const simulationInterval = setInterval(() => {
    if (stopFlag.current) {
      clearInterval(simulationInterval);
      return;
    }

    // Generate times for the current client
    const { arrival, service } = generateTimes();

    // Process the current client
    const server = serverHeap.extractMin();
    if (server !== null) {
      const serviceStart = Math.max(arrival, server.time);
      const waiting = serviceStart - arrival;
      const departure = serviceStart + service;
      startTimeService.push(serviceStart);
      waitingTimes.push(waiting);
      departureTimes.push(departure);
      timeInSystem.push(departure - arrival);
      serverAssigned.push(server.id);
      serverHeap.insert({ time: departure, id: server.id });
    } else {
      // No server available and queue is full, client is lost
      // Handle client loss if necessary
    }

    // Update arrival and service times arrays
    arrivalTimes.push(arrival);
    serviceTimes.push(service);

    // Update simulation data state
    setSimulationData({
      arrivalTimes,
      serviceTimes,
      startTimeService,
      waitingTimes,
      departureTimes,
      timeInSystem,
      serverAssigned,
    });

    // Increment client counter
    clientIndex++;
  }, 1000 / lambda); // Adjust the interval based on arrival rate
}

// In SimulationPage component
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Bath from "./components/bath";
import Piano from "./components/Piano";
import Kitchen from "./components/Kitchen";
import WaitingArea from "./components/WaitingArea";
import renderTables from "./components/Table";

export default function SimulationPage() {
  const [config, setConfig] = useState(null); // To store the loaded configuration
  const router = useRouter();
  const [simulationData, setSimulationData] = useState({
    arrivalTimes: [],
    serviceTimes: [],
    startTimeService: [],
    waitingTimes: [],
    departureTimes: [],
    timeInSystem: [],
    serverAssigned: [],
  });
  const stopFlag = useRef(false);

  useEffect(() => {
    // Retrieve the saved configuration from localStorage
    const data = localStorage.getItem("simulationConfig");
    if (data) {
      const parsedData = JSON.parse(data);
      setConfig(parsedData);
    }
  }, []);

  useEffect(() => {
    if (config) {
      // Start the simulation indefinitely
      simulateQueueIndefinitely(config, setSimulationData, stopFlag);
    }
  }, [config]);

  const handleFinish = () => {
    // Set the stop flag to true to stop the simulation loop
    stopFlag.current = true;

    // Guardar el reporte en localStorage
    localStorage.setItem("simulationReport", JSON.stringify(config));

    // Save the current simulation data to localStorage
    localStorage.setItem("simulationData", JSON.stringify(simulationData));

    // Navigate to the report page
    router.push("/report");
  };

  return (
    <>
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
          className="absolute px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 top-4 right-[17%]"
          onClick={handleFinish}
          aria-label="Finalizar Simulación"
        >
          Iniciar Simulación
        </button>
        <button
          className="absolute px-4 py-2 text-white bg-red-500 rounded top-4 right-4 hover:bg-red-600"
          onClick={handleFinish}
          aria-label="Finalizar Simulación"
        >
          Finalizar Simulación
        </button>
      </div>
    </>
  );
}

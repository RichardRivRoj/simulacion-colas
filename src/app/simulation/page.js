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
import { gsap } from "gsap";
import { useRouter } from "next/navigation";
import Bath from "./components/bath";
import Piano from "./components/Piano";
import Kitchen from "./components/Kitchen";
import WaitingArea from "./components/WaitingArea";
import Person from "./components/Person";
import { CirclePlay, CircleStop, Play, Square } from "lucide-react";

export default function SimulationPage() {
  const [config, setConfig] = useState(null);
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

  const [personPosition, setPersonPosition] = useState({ top: 50, left: 50 });

  useEffect(() => {
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
    stopFlag.current = true;

    localStorage.setItem("simulationReport", JSON.stringify(config));
    localStorage.setItem("simulationData", JSON.stringify(simulationData));
    router.push("/report");
  };

  const moveToTable = async (tableId) => {
    const person = document.getElementById("Person-1");
    const table = document.getElementById(`table-${tableId}`); // Usamos el mismo id

    if (person && table) {
      // Obtener posiciones actuales de la persona y la mesa
      const personRect = person.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();

      const currentTop = personRect.top + window.scrollY;
      const currentLeft = personRect.left + window.scrollX;

      const targetTop = tableRect.top + window.scrollY;
      const targetLeft = tableRect.left + window.scrollX;

      // Crear la animación en forma de L con gsap.timeline()
      const timeline = gsap.timeline();

      // 1. Movimiento horizontal (solo si las posiciones no coinciden)
      if (currentLeft !== targetLeft) {
        timeline.to(person, {
          x: targetLeft - currentLeft,
          duration: 0.7, // Duración del movimiento
          ease: "power1.inOut", // Suavizado
        });
      }

      // 2. Movimiento vertical (solo si las posiciones no coinciden)
      if (currentTop !== targetTop) {
        timeline.to(person, {
          y: targetTop - currentTop,
          duration: 0.7, // Duración del movimiento
          ease: "power1.inOut", // Suavizado
        });
      }

      // Esperar a que la animación se complete
      await timeline;
    }
  };

  const handleTableClick = (tableId) => {
    moveToTable(tableId);
  };

  const renderTables = ({ numberOfTables }) => {
    const tables = [];
    for (let i = 0; i < numberOfTables; i++) {
      tables.push(
        <div key={i} className="flex items-center justify-center text-center">
          <p className="text-[10px]">
            {i}
            <img
              id={`table-${i}`}
              src="/table.svg"
              alt={`Table-${i}`}
              className="w-16 h-auto cursor-pointer"
              onClick={() => handleTableClick(i)}
            />
          </p>
        </div>
      );
    }
    return tables;
  };

  return (
    <>
      <div className="grid w-screen h-screen grid-cols-4 grid-rows-8">
        {/* Waiting Area */}
        <div
          id="WaitingArea"
          className="col-span-2 row-span-2 bg-red-100 border-2 border-black"
        >
          <div className="flex flex-row-reverse justify-end w-[95%] h-auto gap-2 grid-cols-5">
            <Person position={personPosition} />
          </div>
        </div>
        <div className="col-span-1 row-span-2 border-2 border-black bg-green-50"></div>
        <div className="col-span-1 row-span-2 p-2 border-2 border-black">
          <WaitingArea />
        </div>

        {/* Tables */}
        <div className="col-span-3 row-span-4 overflow-hidden bg-white border-2 border-black">
          <div className="grid w-[95%] h-auto gap-4 p-2 place-items-center grid-cols-5">
            {config && renderTables({ numberOfTables: config.numberOfTables })}
          </div>
        </div>
        <div className="col-span-1 row-span-4 border-2 border-black bg-amber-50">
          <Kitchen />
        </div>

        {/* Other Sections */}
        <div className="col-span-3 row-span-2 border-2 border-black">
          <Piano />
        </div>
        <div className="col-span-1 row-span-2 border-2 border-black bg-blue-50">
          <Bath />
        </div>

        {/* Buttons */}
        <button
          className="absolute px-4 py-2 text-white bg-blue-500 rounded top-4 right-4 hover:bg-blue-600"
          onClick={handleFinish}
        >
          <CirclePlay />
        </button>
        <button
          className="absolute px-4 py-2 text-white bg-red-500 rounded top-16 right-4 hover:bg-red-600"
          onClick={handleFinish}
        >
          <CircleStop />
        </button>
      </div>
    </>
  );
}

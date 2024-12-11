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
  const [people, setPeople] = useState([]); // Personas en el área de espera

  useEffect(() => {
    const data = localStorage.getItem("simulationConfig");
    if (data) {
      const parsedData = JSON.parse(data);
      setConfig(parsedData);
    }
  }, []);

  const moveTo = (personId) => {
    const personElement = document.getElementById(`person-${personId}`);
    const peopleArea = document.getElementById("PeopleArea");
    if (!personElement || !peopleArea) return;

    if (personElement && peopleArea) {
      let personRect = personElement.getBoundingClientRect();
      const peopleAreaRect = peopleArea.getBoundingClientRect();
      let currentTop = personRect.top + window.scrollY;
      let currentLeft = personRect.left + window.scrollX;

      const targetTop = peopleAreaRect.top + window.scrollY;
      const targetLeft = peopleAreaRect.left + window.scrollX;

      // Crear animación con gsap.timeline()
      const timeline = gsap.timeline();

      // 1. Movimiento
      if (currentTop !== targetTop || currentLeft !== targetLeft) {
        timeline.to(personElement, {
          x: targetLeft - currentLeft,
          y: targetTop - currentTop,
          duration: 0.5,
          ease: "power1.inOut",
        });
      }
    }
  };

  let personCounter = 0; // Contador global para IDs únicos

  const addPersonToWaitingArea = (arrivalTime, serviceTime) => {
    // Calcular la posición de la nueva persona en la WaitingArea
    const waitingArea = document.getElementById("PeopleArea");
    const personCount = people.length;
    console.log("hola");

    const personWidth = 50;
    const personHeight = 80;
    const waitingAreaWidth = waitingArea.getBoundingClientRect().width;
    const padding = 10;

    const personsInRow = Math.floor(waitingAreaWidth / (personWidth + padding));
    const row = Math.floor(personCount / personsInRow);
    const column = personCount % personsInRow;

    const left = 50;
    const top = 50

    // Crear la nueva persona
    const newPerson = {
      id: ++personCounter,
      arrivalTime,
      serviceTime,
      position: { top, left },
      status: "waiting",
    };

    // Actualizar el estado
    setPeople([...people, newPerson]);
    return newPerson.id;
  };

  const markAsAttended = (personId) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === personId ? { ...person, status: "attended" } : person
      )
    );
  };

  const moveToTable = (personId, tableId) => {
    const personElement = document.getElementById(`person-${personId}`);
    const tableElement = document.getElementById(`table-${tableId}`);
    const entrance = document.getElementById("entrance");
    if (!personElement || !tableElement) return;

    if (personElement && tableElement && entrance) {
      let personRect = personElement.getBoundingClientRect();
      const tableRect = tableElement.getBoundingClientRect();
      const entranceRect = entrance.getBoundingClientRect();

      const entranceTop = entranceRect.top + window.scrollY + entranceRect.height / 2;
      const entranceLeft = entranceRect.left + window.scrollX + entranceRect.width / 2;

      let currentTop = personRect.top + window.scrollY;
      let currentLeft = personRect.left + window.scrollX;

      const targetTop = tableRect.top + window.scrollY;
      const targetLeft = tableRect.left + window.scrollX;

      // Crear animación con gsap.timeline()
      const timeline = gsap.timeline();

      // 1. Movimiento hacia la entrada
      if (currentTop !== entranceTop || currentLeft !== entranceLeft) {
        timeline.to(personElement, {
          x: entranceLeft - currentLeft,
          y: entranceTop - currentTop,
          duration: 0.7,
          ease: "power1.inOut",
        });
      }

      personRect = personElement.getBoundingClientRect();
      currentTop = personRect.top + window.scrollY;
      currentLeft = personRect.left + window.scrollX;

      // 2. Movimiento vertical (solo si las posiciones no coinciden)
      if (currentTop !== targetTop) {
        timeline.to(personElement, {
          y: targetTop - currentTop,
          duration: 0.7, // Duración del movimiento
          ease: "power1.inOut", // Suavizado
        });
      }

      // 1. Movimiento horizontal (solo si las posiciones no coinciden)
      if (currentLeft !== targetLeft) {
        timeline.to(personElement, {
          x: targetLeft - currentLeft,
          duration: 0.7, // Duración del movimiento
          ease: "power1.inOut", // Suavizado
        });
      }

      markAsAttended(personId);
    }
  };

  const removeAttendedPersons = () => {
    setPeople((prevPeople) => {
      const updatedPeople = prevPeople.filter((person) => {
        if (person.status === "attended") {
          // Animar salida de la persona (opcional)
          const personElement = document.getElementById(`person-${person.id}`);
          if (personElement) {
            gsap.to(personElement, {
              opacity: 0,
              duration: 0.5,
              onComplete: () => {
                personElement.remove(); // Eliminar elemento del DOM
              },
            });
          }
          return false; // Filtrar persona
        }
        return true; // Mantener persona
      });

      return updatedPeople; // Retornar lista actualizada
    });
  };


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

      // Agregar nueva persona al área de espera
      const personId = addPersonToWaitingArea(arrival, service);

      // Mover persona a la mesa asignada
      setTimeout(() => moveToTable(personId, server.id), 0);

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

  const handleStart = () => {
    stopFlag.current = false;
    simulateQueueIndefinitely(config, setSimulationData, stopFlag);
    setTimeout(() => {
      removeAttendedPersons(); // Limpiar área de espera
    }, 500); // Llamar con un retraso
  };

  const handleStop = () => {
    stopFlag.current = true;

    localStorage.setItem("simulationReport", JSON.stringify(config));
    localStorage.setItem("simulationData", JSON.stringify(simulationData));
    router.push("/report");
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
              className="w-16 h-auto"
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
          className="flex justify-end col-span-2 row-span-2 bg-red-100 border-b-2 border-black"
        >
          <div id="PeopleArea" className="flex flex-row-reverse w-[95%] h-auto gap-4 p-2 justify-end items-center">
            {people.map((person) => (
              <Person
                key={person.id}
                id={person.id}
                position={person.position}
                status={person.status}
              />
            ))}
          </div>
        </div>

        <div id="entrance" className="col-span-1 row-span-2 bg-green-50"></div>
        <div className="col-span-1 row-span-2 p-2 border-2 border-black">
          <WaitingArea />
        </div>

        {/* Tables */}
        <div className="col-span-3 row-span-4 overflow-hidden bg-white">
          <div className="grid w-[95%] h-auto gap-4 p-2 place-items-center grid-cols-5">
            {config && renderTables({ numberOfTables: config.numberOfTables })}
          </div>
        </div>
        <div className="col-span-1 row-span-4 border-2 border-black bg-amber-50">
          <Kitchen />
        </div>

        {/* Other Sections */}
        <div className="col-span-3 row-span-">
          <Piano />
        </div>
        <div className="col-span-1 row-span-2 border-2 bg-blue-50">
          <Bath />
        </div>

        {/* Buttons */}
        // * Import: El boton de play no funciona a la primera
        <button
          className="absolute px-4 py-2 text-white bg-blue-500 rounded top-4 right-4 hover:bg-blue-600"
          onClick={handleStart}
        >
          <CirclePlay />
        </button>
        <button
          className="absolute px-4 py-2 text-white bg-red-500 rounded top-16 right-4 hover:bg-red-600"
          onClick={handleStop}
        >
          <CircleStop />
        </button>
      </div>
    </>
  );
}

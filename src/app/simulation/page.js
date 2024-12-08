"use client";
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
          className="col-span-2 row-span-2 border-2 border-black bg-red-100"
        >
          <div className="flex flex-row-reverse justify-end w-[95%] h-auto gap-2 grid-cols-5">
            <Person position={personPosition} />
          </div>
        </div>
        <div className="col-span-1 row-span-2 border-2 border-black bg-green-50"></div>
        <div className="col-span-1 row-span-2 border-2 border-black p-2">
          <WaitingArea />
        </div>

        {/* Tables */}
        <div className="col-span-3 row-span-4 border-2 border-black overflow-hidden bg-white">
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

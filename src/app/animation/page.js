'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function MoveToTables() {
  const characterRef = useRef(null);

  useEffect(() => {
    const moveToTableById = (id, onComplete) => {
      const tableElement = document.getElementById(id);
      if (tableElement) {
        const rect = tableElement.getBoundingClientRect();

        // Calcula la posición relativa al contenedor
        const container = document.querySelector('.board');
        const containerRect = container.getBoundingClientRect();

        const tableX =
          rect.left - containerRect.left + rect.width / 2 - 24; // Centra el personaje en la mesa
        const tableY =
          rect.top - containerRect.top + rect.height / 2 - 24; // Centra el personaje en la mesa

        // Posición central superior del tablero
        const topCenterX = containerRect.width / 2 - 24; // Centro horizontal
        const topCenterY = 20; // Justo debajo del borde superior

        // Animación GSAP en 3 etapas
        gsap
          .timeline({ onComplete })
          .to(characterRef.current, {
            x: topCenterX,
            y: topCenterY,
            duration: 1,
            ease: 'power1.inOut',
          }) // Paso 1: Mover a la parte superior central
          .to(characterRef.current, {
            x: topCenterX,
            y: tableY,
            duration: 1,
            ease: 'power1.inOut',
          }) // Paso 2: Bajar en línea recta hacia la altura de la mesa
          .to(characterRef.current, {
            x: tableX,
            duration: 1,
            ease: 'power1.inOut',
          }); // Paso 3: Movimiento horizontal hacia la mesa
      }
    };

    // Secuencia automática: Mesa 1 -> Mesa 3 -> Mesa 4
    const sequence = ['mesa-1', 'mesa-3', 'mesa-4'];
    let index = 0;

    const moveNext = () => {
      if (index < sequence.length) {
        moveToTableById(sequence[index], moveNext);
        index++;
      }
    };

    // Inicia el movimiento automático
    moveNext();
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Contenedor del tablero */}
      <div className="relative w-full h-screen board">
        {/* Mesas */}
        {[1, 2, 3, 4].map((id, index) => (
          <div
            key={id}
            id={`mesa-${id}`}
            className="absolute w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center text-white"
            style={{
              top: `100px`, // Mesas posicionadas en la parte superior
              left: `${200 + index * 150}px`, // Distribuidas horizontalmente
            }}
          >
            Mesa {id}
          </div>
        ))}

        {/* Personaje */}
        <div
          ref={characterRef}
          className="absolute w-12 h-12 bg-yellow-400 rounded-full"
          style={{
            left: '20px', // Posición inicial (esquina superior izquierda)
            top: '20px',
            transform: 'translate(0, 0)', // Inicializa en (0, 0)
          }}
        ></div>
      </div>
    </div>
  );
}

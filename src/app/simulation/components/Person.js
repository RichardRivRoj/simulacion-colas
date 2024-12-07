'use client';

import { useEffect, useRef } from 'react';
import { User } from 'lucide-react';

export default function Person({ position, status}) {
  const personRef = useRef(null);
  const { top, left } = position;

  return (
    <div
      ref={personRef}
      className={`absolute ${status === 'waiting' ? 'text-yellow-500' :
          status === 'served' ? 'text-green-500' : 'text-blue-500'
        }`}
      style={{
        left: `${left}px`, // Posición inicial (esquina superior izquierda)
        top: `${top}px`,
        transform: 'translate(0, 0)', // Inicializa en (0, 0)
      }}
    >
      {/* Personaje */}
      <User className="w-6 h-6" id='Person-1'/>
    </div>

  );

  // return (
  //   <div
  //     ref={personRef}
  //     className={`absolute ${
  //       status === 'waiting' ? 'text-yellow-500' :
  //       status === 'served' ? 'text-green-500' : 'text-blue-500'
  //     }`}
  //     style={{ transform: `translate(${position.initial.x}px, ${position.initial.y}px)` }}
  //   >
  //     <User className="w-6 h-6" />
  //   </div>
  // );
}

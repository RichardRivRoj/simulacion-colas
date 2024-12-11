'use client';

import { useEffect, useRef } from 'react';
import { User } from 'lucide-react';

export default function Person({ position, status, id}) {
  const personRef = useRef(null);
  const { top, left } = position;

  return (
    <div
      id={`person-${id}`}
      ref={personRef}
      className={`person absolute ${status === 'waiting' ? 'text-yellow-500' :
          status === 'attended' ? 'text-green-500' : 'text-blue-500'
        }`}
      style={{
        left: `${left}px`, // Posición inicial (esquina superior izquierda)
        top: `${top}px`,
        transform: 'translate(0, 0)', // Inicializa en (0, 0)
      }}
    >
      {/* Personaje */}
      <img src={`${status === 'waiting' ? 'person1.png' :
          status === 'attended' ? 'person1.png' : 'text-blue-500'
        }`} className="w-6 h-8"></img>
    </div>

  );
}

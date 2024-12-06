'use client';

import { useEffect, useRef } from 'react';
import { animateArea } from '@/lib/animation';

export default function WaitingArea({ queue }) {
  const areaRef = useRef(null);

  useEffect(() => {
    if (areaRef.current) {
      animateArea(areaRef.current, 'left');
    }
  }, []);

  return (
    <div
      ref={areaRef}
      className="absolute w-32 h-48 p-4 transform -translate-y-1/2 bg-gray-100 rounded-lg opacity-0 left-10 top-1/2"
    >
      <h3 className="mb-2 text-sm font-medium text-gray-700">Sala de Espera</h3>
      <div className="text-xs text-gray-500">
        En cola: {queue.length}
      </div>
    </div>
  );
}
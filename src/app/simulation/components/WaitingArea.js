'use client';

import { useEffect, useRef } from 'react';
import { animateArea } from '@/lib/animation';

const WaitingArea = ({ className }) => {
  const areaRef = useRef(null);

  useEffect(() => {
    if (areaRef.current) {
      animateArea(areaRef.current, 'left');
    }
  }, []);

  return (
    <div className={className}>
      <img src="waitingArea.svg" alt="Área de Espera" className="h-full w-[75%] ml-20"/>
    </div>
  );
}

export default WaitingArea;

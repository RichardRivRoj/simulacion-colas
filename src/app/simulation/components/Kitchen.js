'use client';

import { useEffect, useRef } from 'react';
import { ChefHat } from 'lucide-react';
import { animateArea } from '@/lib/animation';

const Kitchen = ({ className }) => {
  const kitchenRef = useRef(null);

  useEffect(() => {
    if (kitchenRef.current) {
      animateArea(kitchenRef.current, 'right');
    }
  }, []);

  return (
    <div className={className}>
      <img src="kitchen.svg" alt="Cocina" className="w-[289px] ml-3"/>
    </div>
  );
}

export default Kitchen;
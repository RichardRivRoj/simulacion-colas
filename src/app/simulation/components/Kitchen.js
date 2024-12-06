'use client';

import { useEffect, useRef } from 'react';
import { ChefHat } from 'lucide-react';
import { animateArea } from '@/lib/animation';

export default function Kitchen() {
  const kitchenRef = useRef(null);

  useEffect(() => {
    if (kitchenRef.current) {
      animateArea(kitchenRef.current, 'right');
    }
  }, []);

  return (
    <div
      ref={kitchenRef}
      className="absolute flex flex-col items-center justify-center w-32 h-48 transform -translate-y-1/2 bg-gray-200 rounded-lg opacity-0 right-10 top-1/2"
    >
      <ChefHat className="w-12 h-12 mb-2 text-gray-700" />
      <span className="text-sm font-medium text-gray-700">Cocina</span>
    </div>
  );
}
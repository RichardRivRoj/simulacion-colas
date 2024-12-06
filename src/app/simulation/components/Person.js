'use client';

import { useEffect, useRef } from 'react';
import { User } from 'lucide-react';
import { animateCustomer } from '@/lib/animation';

export default function Person({ position, status, onAnimationComplete }) {
  const personRef = useRef(null);

  useEffect(() => {
    if (personRef.current) {
      const animation = animateCustomer(personRef.current, position);
      if (onAnimationComplete) {
        animation.then(onAnimationComplete);
      }
    }
  }, [position, onAnimationComplete]);

  return (
    <div
      ref={personRef}
      className={`absolute ${
        status === 'waiting' ? 'text-yellow-500' : 
        status === 'served' ? 'text-green-500' : 'text-blue-500'
      }`}
      style={{ transform: `translate(${position.initial.x}px, ${position.initial.y}px)` }}
    >
      <User className="w-6 h-6" />
    </div>
  );
}
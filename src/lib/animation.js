import gsap from 'gsap';

export const animateCustomer = (element, { x, y, duration = 1, delay = 0 }) => {
  return gsap.to(element, {
    x,
    y,
    duration,
    delay,
    ease: 'power2.inOut'
  });
};

export const animateTable = (element) => {
  return gsap.from(element, {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    ease: 'back.out(1.7)'
  });
};

export const animateArea = (element, direction) => {
  const xValue = direction === 'left' ? -50 : 50;
  
  return gsap.fromTo(element, 
    { 
      opacity: 0, 
      x: xValue 
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: 'power2.out'
    }
  );
};
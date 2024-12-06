export function generatePoissonArrival(lambda) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
  
    do {
      k++;
      p *= Math.random();
    } while (p > L);
  
    return k - 1;
  }
  
  export function generateExponentialService(mu) {
    return -Math.log(1 - Math.random()) / mu;
  }
  
  export function calculateNextEvent(currentTime, arrivalRate, serviceRate) {
    const nextArrival = currentTime + generatePoissonArrival(arrivalRate);
    const serviceTime = generateExponentialService(serviceRate);
    
    return {
      nextArrival,
      serviceTime,
    };
  }
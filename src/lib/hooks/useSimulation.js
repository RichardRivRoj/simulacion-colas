'use client';

import { useState, useEffect, useCallback } from 'react';
import { calculateNextEvent } from '@/lib/monte-carlo';

export function useSimulation(config) {
  const [tables, setTables] = useState([]);
  const [queue, setQueue] = useState([]);
  const [people, setPeople] = useState([]);
  const [simulationTime, setSimulationTime] = useState(0);
  const [simulationStats, setSimulationStats] = useState({
    totalCustomers: 0,
    servedCustomers: 0,
    averageWaitTime: 0,
    maxQueueLength: 0
  });

  const initializeTables = useCallback(() => {
    if (!config) return;
    
    const initialTables = Array(config.numberOfTables).fill().map((_, i) => ({
      id: i,
      isOccupied: false,
      position: {
        x: 200 + (i % 2) * 100,
        y: 100 + Math.floor(i / 2) * 100
      }
    }));
    setTables(initialTables);
  }, [config]);

  const processNewCustomer = useCallback((time) => {
    const newPerson = {
      id: Date.now(),
      status: 'waiting',
      arrivalTime: time,
      position: {
        initial: { x: 0, y: 300 },
        x: 50,
        y: 300,
        duration: 1
      }
    };

    setPeople(current => [...current, newPerson]);
    setQueue(current => [...current, newPerson.id]);
    setSimulationStats(stats => ({
      ...stats,
      totalCustomers: stats.totalCustomers + 1,
      maxQueueLength: Math.max(stats.maxQueueLength, queue.length + 1)
    }));

    return newPerson;
  }, [queue.length]);

  useEffect(() => {
    if (!config) return;
    initializeTables();
  }, [config, initializeTables]);

  useEffect(() => {
    if (!config) return;

    const simulationInterval = setInterval(() => {
      setSimulationTime(time => {
        const { nextArrival } = calculateNextEvent(
          time,
          config.arrivalRate,
          config.serviceRate
        );

        if (config.hasQueueLimit && queue.length >= config.queueLimit) {
          return time;
        }

        if (nextArrival > time) {
          processNewCustomer(nextArrival);
        }

        return nextArrival;
      });
    }, 1000);

    return () => clearInterval(simulationInterval);
  }, [config, queue.length, processNewCustomer]);

  return {
    tables,
    queue,
    people,
    simulationTime,
    simulationStats,
    setSimulationStats
  };
}
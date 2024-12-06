'use client';

import { useSimulation } from '@/lib/hooks/useSimulation';
import Person from './Person';
import Table from './Table';
import Kitchen from './Kitchen';
import WaitingArea from './WaitingArea';

export default function SimulationArea({ config }) {
  const {
    tables,
    queue,
    people,
    simulationTime,
    simulationStats
  } = useSimulation(config);

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="absolute text-sm font-medium text-gray-700 top-4 left-4">
        Tiempo de simulación: {Math.floor(simulationTime)} minutos
      </div>

      <WaitingArea queue={queue} />
      
      {tables.map(table => (
        <Table key={table.id} position={table.position} isOccupied={table.isOccupied} />
      ))}

      {people.map(person => (
        <Person
          key={person.id}
          position={person.position}
          status={person.status}
        />
      ))}

      <Kitchen />
    </div>
  );
}
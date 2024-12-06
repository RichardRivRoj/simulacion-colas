import { useEffect } from 'react';

import { useRouter } from "next/router";
const router = useRouter();

export default function TestPage() {


    useEffect(() => {
        const fakeResults = {
            totalTime: 180,
            totalCustomers: 100,
            servedCustomers: 85,
            finalQueueLength: 15,
            maxQueueLength: 20,
        };

        localStorage.setItem('simulationResults', JSON.stringify(fakeResults));
        console.log('Resultados de simulación falsos creados.');
        // Redirigir a la página de informes

    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-xl font-bold">Creando datos de simulación...</h1>
        </div>
    );
}

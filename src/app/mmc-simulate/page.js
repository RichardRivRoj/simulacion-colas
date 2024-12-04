"use client"

import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function RestaurantSimulation({ realTimeData }) {
    useEffect(() => {
        if (realTimeData && realTimeData.length > 0) {
            realTimeData.forEach(data => {
                handleNewData(data);
            });
        }
    }, [realTimeData]);

    function handleNewData(data) {
        const personElement = document.createElement('div');
        personElement.className = 'person';
        document.body.appendChild(personElement);

        gsap.to(personElement, {
            duration: 1,
            x: data.arrivalX,
            y: data.arrivalY,
            onComplete: function() {
                gsap.to(personElement, {
                    duration: 1,
                    delay: data.serviceTime,
                    x: data.exitX,
                    y: data.exitY,
                    onComplete: function() {
                        personElement.remove();
                    }
                });
            }
        });
    }

    return <div>Restaurant Simulation</div>;
}


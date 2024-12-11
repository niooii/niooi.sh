"use client"
import { useEffect } from 'react';

export default function AnimationTest() {
    console.log('component rendered');

    useEffect(() => {
        let id: number | undefined;
        
        function step() {
            console.log('rdfhdf world');
            id = window.requestAnimationFrame(step);
        }

        step();

        return () => {
            console.log('cleanup called'); 
            if (id !== undefined) {
                window.cancelAnimationFrame(id);
            }
        };
    }, []);

    return <div>Animation Test Running</div>;
}
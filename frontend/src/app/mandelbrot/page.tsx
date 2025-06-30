"use client"

import { useEffect, useState } from "react";
import Mandelbrot from "@/components/vfx/mandelbrot";
import Link from "next/link";

export default function MandelbrotPage() {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [parameters, setParameters] = useState({
        powerReal: 1.7,
        powerImag: 0.1,
        centerReal: 0.14,
        centerImag: 0.725,
        zoom: 2,
        maxIterations: 400
    });

    useEffect(() => {
        const updateDimensions = () => {
            const size = Math.min(window.innerWidth, window.innerHeight) - 40; // Account for padding
            setDimensions({
                width: size,
                height: size
            });
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const handleParameterChange = (param: string, value: number) => {
        setParameters(prev => ({
            ...prev,
            [param]: value
        }));
    };

    return (
        <div className="relative w-screen h-screen bg-black overflow-hidden flex items-center justify-center">
            {/* Parameter Controls */}
            <div className="absolute top-4 left-4 z-50 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm border border-white/20 max-w-xs">
                <h3 className="text-sm font-bold mb-3">Parameters</h3>
                
                <div className="space-y-3">
                    <div>
                        <label className="text-xs block mb-1">Power Real: {parameters.powerReal.toFixed(2)}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="4"
                            step="0.1"
                            value={parameters.powerReal}
                            onChange={(e) => handleParameterChange('powerReal', parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs block mb-1">Power Imaginary: {parameters.powerImag.toFixed(2)}</label>
                        <input
                            type="range"
                            min="-2"
                            max="2"
                            step="0.1"
                            value={parameters.powerImag}
                            onChange={(e) => handleParameterChange('powerImag', parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs block mb-1">Center Real: {parameters.centerReal.toFixed(3)}</label>
                        <input
                            type="range"
                            min="-2"
                            max="2"
                            step="0.01"
                            value={parameters.centerReal}
                            onChange={(e) => handleParameterChange('centerReal', parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs block mb-1">Center Imaginary: {parameters.centerImag.toFixed(3)}</label>
                        <input
                            type="range"
                            min="-2"
                            max="2"
                            step="0.01"
                            value={parameters.centerImag}
                            onChange={(e) => handleParameterChange('centerImag', parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs block mb-1">Zoom: {parameters.zoom.toFixed(1)}</label>
                        <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={parameters.zoom}
                            onChange={(e) => handleParameterChange('zoom', parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs block mb-1">Max Iters: {parameters.maxIterations}</label>
                        <input
                            type="range"
                            min="50"
                            max="1000"
                            step="50"
                            value={parameters.maxIterations}
                            onChange={(e) => handleParameterChange('maxIterations', parseInt(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 right-4 z-50 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20 max-w-xs">
                <p className="text-sm">
                    <strong>Hey move your mouse and stuff</strong><br/>
                </p>
            </div>

            {/* Mandelbrot Component */}
            <div className="w-full h-full flex items-center justify-center">
                <Mandelbrot 
                    width={dimensions.width} 
                    height={dimensions.height}
                    powerReal={parameters.powerReal}
                    powerImag={parameters.powerImag}
                    centerReal={parameters.centerReal}
                    centerImag={parameters.centerImag}
                    zoom={parameters.zoom}
                    maxIterations={parameters.maxIterations}
                />
            </div>
        </div>
    );
} 
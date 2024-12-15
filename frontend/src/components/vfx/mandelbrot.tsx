"use client"
import React, { RefObject, useEffect, useRef, useState } from 'react';

type MandelbrotProps = {
    
};

const Mandelbrot = ({ }: MandelbrotProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | undefined>(undefined);
    const previousTime = useRef<number | undefined>(undefined);
    const timeSinceSpawn = useRef<number>(0);

    // GL related stuff
    const programRef = useRef<WebGLProgram | null>(null);
    const vaoRef = useRef<WebGLVertexArrayObject | null>(null);
    const instanceBufferRef = useRef<WebGLBuffer | null>(null);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-50"
            style={{ touchAction: 'none' }}
        />
    );
}

export default Mandelbrot;
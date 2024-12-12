"use client"
import React, { useEffect, useRef, useState } from 'react';

function image(): HTMLImageElement {

}

class SnowParticle 
{
    x: number;
    y: number;
    speed: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    img: HTMLImageElement;

    constructor(x: number, y: number, img: HTMLImageElement, options: Partial<SnowParticle> = {}) {
        this.x = x;
        this.y = y;
        this.speed = options.speed || 0.5 + Math.random() * 1;
        this.size = options.size || 8 + Math.random() * 8;
        this.rotation = options.rotation || Math.random() * Math.PI * 2;
        this.rotationSpeed = options.rotationSpeed || (Math.random() - 0.5) * 0.02;
        this.opacity = options.opacity || 0.3 + Math.random() * 0.7;
        this.img = img; 
    }

    public update(delta_time: number) {

    }

    public draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.img, this.x, this.y)
    }
}

type WinterProps = {};

const Winter = ({  }: WinterProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<SnowParticle[]>([]);
    const imageRef = useRef<HTMLImageElement | undefined>(undefined);
    const animationFrameId = useRef<number | undefined>(undefined);
    const previousTime = useRef<number | undefined>(undefined);
    const yRef = useRef<number>(0);

    useEffect(() => {
        const img = new Image();
        img.src = "/snow.png";
        // Add error handling
        img.onerror = (e) => {
            console.error('Failed to load snowflake image:', e);
        };
        
        img.onload = () => {
            console.log('Snowflake image loaded successfully');
            imageRef.current = img;
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas?.getContext('2d')!;
        let isActive = true; 
        const animate = (time: number) => {
            if (!isActive) return;
            
            if (previousTime.current != undefined)
            {
                const deltaTime = (time - previousTime.current!)/1000;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                yRef.current += deltaTime;
                ctx.font = "30px Arial";
                ctx.fillText("" + (Math.random() * 500).toFixed(0), 10, 50);
                ctx.fillText("y: " + yRef.current, 10, 90);
                if (imageRef.current === undefined)
                {
                    console.log("UNDEF");
                }
                else
                {
                    ctx.drawImage(imageRef.current, 20, yRef.current * 100)
                }

                console.log("hi chat");
            }

            previousTime.current = time;

            animationFrameId.current = requestAnimationFrame(animate);
        };
        
        const resizeCanvas = () => {
            canvas!.width = window.innerWidth;
            canvas!.height = window.innerHeight;
        };
        
        resizeCanvas();
        
        animate();
        
        return () => {
            console.log('Cleaning up animation');
            isActive = false;
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50"
        style={{ touchAction: 'none' }}
        />
    );
};

export default Winter;
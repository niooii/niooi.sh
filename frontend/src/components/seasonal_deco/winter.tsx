"use client"
import React, { RefObject, useEffect, useRef, useState } from 'react';

type MousePosition = {
    x: number;
    y: number;
    prevX: number;
    prevY: number;
};

class SnowParticle {
    x: number;
    y: number;
    speed: number;
    size: number;
    rotation: number;
    xSpeed: number;
    opacity: number;
    img: RefObject<HTMLImageElement | undefined>;

    constructor(x: number, y: number, img: RefObject<HTMLImageElement | undefined>, options: Partial<SnowParticle> = {}) {
        this.x = x;
        this.y = y;
        this.speed = options.speed || 0.5 + Math.random() * 1;
        this.size = options.size || 0.2 + Math.random() * 0.8;
        this.rotation = options.rotation || Math.random() * Math.PI * 2;
        this.xSpeed = options.xSpeed || (Math.random() * 2 - 1);
        this.opacity = options.opacity || + Math.random() * 0.4 + 0.1;
        this.img = img;
    }

    public updateWithMouseInfo(deltaMouseX: number) {
        // make mouse impact horizontal speed
        this.xSpeed += deltaMouseX;
        const maxXSpeed = 5;
        // Clamp to max and min xspeed respectively
        this.xSpeed = Math.min(maxXSpeed, this.xSpeed);
        this.xSpeed = Math.max(-maxXSpeed, this.xSpeed);
    }

    public update(deltaTime: number) {
        // all snowflakes fall down at constant rate
        this.y += deltaTime * 60;
        // snowflakes will move left or right proportional to their rotation
        this.x += this.xSpeed * deltaTime * 50;
        this.rotation += this.xSpeed * deltaTime;
    }

    public draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        if (this.img.current == undefined)
            return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;
        ctx.rotate(this.rotation);
        ctx.scale(this.size, this.size);
        ctx.drawImage(
            this.img.current,
            -this.img.current.width / 2,
            -this.img.current.height / 2,
            this.img.current.width,
            this.img.current.height
        );
        ctx.restore();
    }
}

type WinterProps = {
    spawnRate: number
};

const Winter = ({ spawnRate }: WinterProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<SnowParticle[]>([]);
    const imageRef = useRef<HTMLImageElement | undefined>(undefined);
    const animationFrameId = useRef<number | undefined>(undefined);
    const previousTime = useRef<number | undefined>(undefined);
    const timeSinceSpawn = useRef<number>(0);
    const mousePos = useRef<MousePosition>({
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0
    });

    useEffect(() => {
        const img = new Image();
        img.src = "/snow.png";
        img.onerror = (e) => {
            console.error('Failed to load snowflake image:', e);
        };

        img.onload = () => {
            console.log('Snowflake image loaded successfully');
            imageRef.current = img;
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            particles.current.forEach(p => {
                p.updateWithMouseInfo(e.movementX * 0.01);
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);


    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas?.getContext('2d')!;
        let isActive = true;
        const animate = (time: number) => {
            if (!isActive) return;

            if (previousTime.current != undefined) {
                const deltaTime = (time - previousTime.current!) / 1000;

                // add snow particles
                timeSinceSpawn.current += deltaTime;

                const amountToSpawn = Math.floor(timeSinceSpawn.current) * spawnRate;

                timeSinceSpawn.current -= Math.floor(timeSinceSpawn.current);
                for (let i = 0; i < amountToSpawn; i++) {
                    particles.current.push(new SnowParticle(Math.random() * canvas.width, -100, imageRef));
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                ctx.font = "30px Arial";
                ctx.fillText("" + (Math.random() * 500).toFixed(0), 10, 50);
                particles.current.forEach(p => {
                    p.draw(canvas, ctx);
                    p.update(deltaTime);
                });
            }

            previousTime.current = time;

            animationFrameId.current = requestAnimationFrame(animate);
        };

        const resizeCanvas = () => {
            canvas!.width = window.innerWidth;
            canvas!.height = window.innerHeight;
        };

        resizeCanvas();

        animate(0);

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
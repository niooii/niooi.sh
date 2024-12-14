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

    constructor(x: number, img: RefObject<HTMLImageElement | undefined>, options: Partial<SnowParticle> = {}) {
        this.x = x;
        this.speed = options.speed || 0.5 + Math.random() * 1;
        this.size = options.size || 0.3 + Math.random() * 0.7;
        this.y = (-img.current!.height + img.current!.height/2) * this.size;
        this.rotation = options.rotation || Math.random() * Math.PI * 2;
        this.xSpeed = options.xSpeed || (Math.random() * 2 - 1);
        this.opacity = options.opacity || Math.random() * 0.2 + 0.2;
        this.img = img;
    }

    public updateWithMouseInfo(deltaMouseX: number) {
        // make mouse impact horizontal speed
        this.xSpeed += deltaMouseX * 0.2;
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
        ctx.translate(this.x, this.y);
        ctx.globalAlpha = this.opacity;
        ctx.rotate(this.rotation);
        ctx.scale(this.size, this.size);
        ctx.filter = "brightness(300)"
        ctx.drawImage(
            this.img.current,
            -this.img.current.width / 2,
            -this.img.current.height / 2,
            this.img.current.width,
            this.img.current.height
        );
        ctx.setTransform(1, 0, 0, 1, 0, 0);
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
            console.error('failed to load snowflake image:', e);
        };

        img.onload = () => {
            console.log('snowflake image loaded successfully');
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
        ctx.globalCompositeOperation = "lighter";

        // set canvas width and height to maximum available
        canvas.width = window.screen.availWidth * window.devicePixelRatio;
        canvas.height = window.screen.availHeight * window.devicePixelRatio;
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
                    particles.current.push(new SnowParticle(Math.random() * canvas.width, imageRef));
                }

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                for (let i = particles.current.length - 1; i >= 0; i--)
                {
                    let p: SnowParticle = particles.current[i];
                    if (p === undefined)
                        continue;
                    if (p.y > canvas.height)
                    {
                        delete particles.current[i];
                        continue;
                    }
                    p.draw(canvas, ctx);
                    p.update(deltaTime);
                }
            }

            previousTime.current = time;

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animate(0);

        return () => {
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
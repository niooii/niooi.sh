"use client"
import React, { useEffect, useRef } from 'react';

type Particle = {
    x: number;
    y: number;
    speed: number;
    size: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
};

export enum Season {
    WINTER,
    SPRING,
    SUMMER,
    AUTUMN
}

type SeasonalEffectsProps = {
    season: Season;
    particleCount?: number;
};

const SeasonalEffects = ({ season, particleCount = 50 }: SeasonalEffectsProps) => {
const canvasRef = useRef<HTMLCanvasElement>(null);
const particles = useRef<Particle[]>([]);
const imageRef = useRef<HTMLImageElement | undefined>(undefined)
const animationFrameId = useRef<number | undefined>(undefined)

const initParticles = (width: number, height: number) => {
    particles.current = Array.from({ length: particleCount }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    speed: 0.5 + Math.random() * 1,
    size: 8 + Math.random() * 8, 
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    opacity: 0.3 + Math.random() * 0.7
    }));
};

  const drawParticle = (
        ctx: CanvasRenderingContext2D,
        particle: Particle,
        season: Season
    ) => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);

        switch (season) {
        case Season.WINTER:
            if (imageRef.current) {
                ctx.drawImage(
                    imageRef.current,
                    -particle.size / 2,
                    -particle.size / 2,
                    particle.size,
                    particle.size
                );
            }
            break;
        case Season.SPRING:
            ctx.fillStyle = 'rgba(255, 192, 203, 0.6)';
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5;
            const x = Math.cos(angle) * particle.size;
            const y = Math.sin(angle) * particle.size;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.fill();
            break;
        case Season.SUMMER:
            ctx.fillStyle = 'rgba(255, 255, 150, 0.3)';
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            break;
        case Season.AUTUMN:
            ctx.fillStyle = `rgba(${Math.floor(200 + Math.random() * 55)}, 
                                ${Math.floor(100 + Math.random() * 50)}, 
                                0, 0.6)`;
            ctx.beginPath();
            ctx.ellipse(0, 0, particle.size, particle.size / 2, 0, 0, Math.PI * 2);
            ctx.fill();
            break;
        }
        ctx.restore();
    };

    const animate = () => {
        console.log("hi chat")
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');

        if (!canvas || !ctx) 
        {
            console.log("Animation stopped - missing canvas or context");
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.current.forEach(particle => {
        particle.y += particle.speed;
        particle.x += Math.sin(particle.y / 50) * 0.5; 
        particle.rotation += particle.rotationSpeed;

        if (particle.y > canvas.height) {
            particle.y = -10;
            particle.x = Math.random() * canvas.width;
            particle.opacity = 0.3 + Math.random() * 0.7;
        }

        drawParticle(ctx, particle, season);
        });

        animationFrameId.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (season === Season.WINTER && imageRef.current === undefined) {
            console.log("Making snow image")
            const img = new Image();
            img.src = '/snow.png';
            img.onload = () => {
                imageRef.current = img;
            };
        }

        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles(canvas.width, canvas.height);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [season, particleCount]);

    return (
        <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50"
        style={{ touchAction: 'none' }}
        />
    );
    };

    export default SeasonalEffects;
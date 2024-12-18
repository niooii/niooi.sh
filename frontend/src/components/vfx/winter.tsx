"use client"
import React, { RefObject, useEffect, useRef, useState } from "react";

const vertSrc = `#version 300 es
in vec4 pos;
in vec2 texCoord;

// instance vars (per snow particle)
in vec2 ipos;
in float irotation;
in float iscale;
in float iopacity;

uniform vec2 canvasDimensions;

out vec2 vTexCoord;
out float vOpacity;

void main() {
    float cosR = -cos(irotation);
    float sinR = sin(irotation);
    
    mat2 rotation = mat2(
        cosR, -sinR,
        sinR, cosR
    );
    
    vec2 transformedPos = rotation * (pos.xy * iscale) + ipos;
    
    vec2 clipSpace = (transformedPos / canvasDimensions) * 2.0 - 1.0;
    
    gl_Position = vec4(clipSpace.x, -clipSpace.y, 0.0, 1.0);
    vTexCoord = texCoord;
    vOpacity = iopacity;
}
`;
 
const fragmentSrc = `#version 300 es
precision highp float;

uniform sampler2D uTexture;

in vec2 vTexCoord;
in float vOpacity;

out vec4 outColor;

void main() {
    // make snow texture white
    vec4 texColor = texture(uTexture, vTexCoord) * 2.0;
    outColor = vec4(texColor.rgb, texColor.a * vOpacity);
}
`;

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
        this.xSpeed = options.xSpeed || (Math.random() - 0.5);
        this.opacity = options.opacity || Math.random() * 0.1 + 0.05;
        this.img = img;
    }

    public updateWithMouseInfo(deltaMouseX: number) {
        // make mouse impact horizontal speed
        this.xSpeed += deltaMouseX * 0.2;
    }

    public update(deltaTime: number) {
        // all snowflakes fall down at constant rate
        this.y += deltaTime * 75;
        // snowflakes will move left or right proportional to the mouse movement
        this.x += this.xSpeed * deltaTime * 50;
        // TODO! FIND BETTER FUNCTION that feels better
        const f = (x: number) => {
            return x * 1.5;
        };
        this.rotation += f(this.xSpeed) * deltaTime;
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

    // GL related stuff
    const programRef = useRef<WebGLProgram | null>(null);
    const instanceBufferRef = useRef<WebGLBuffer | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            particles.current.forEach(p => {
                p.updateWithMouseInfo(e.movementX * 0.01);
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);


    useEffect(() => {
        const canvas = canvasRef.current!;
        const gl = canvas?.getContext("webgl2")!;

        // set canvas width and height to maximum available
        canvas.width = window.screen.availWidth * window.devicePixelRatio;
        canvas.height = window.screen.availHeight * window.devicePixelRatio;

        // init webgl
        const vertexShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vertexShader, vertSrc);
        gl.compileShader(vertexShader);

        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fragmentShader, fragmentSrc);
        gl.compileShader(fragmentShader);

        const program = gl.createProgram()!;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);
        programRef.current = program;

        const resLocation = gl.getUniformLocation(program, "canvasDimensions");
        gl.uniform2f(resLocation, canvas.width, canvas.height);

        // Create quad vertices
        const positions = new Float32Array([
            -0.5, -0.5,  0.0, 0.0,
             0.5, -0.5,  1.0, 0.0,
             0.5,  0.5,  1.0, 1.0,
            -0.5,  0.5,  0.0, 1.0,
        ]);

        const indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
        ]);

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        
        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        
        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const vertexLoc = gl.getAttribLocation(program, "pos");
        gl.vertexAttribPointer(vertexLoc, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(vertexLoc);

        const texCoordLoc = gl.getAttribLocation(program, "texCoord");
        gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 16, 8);
        gl.enableVertexAttribArray(texCoordLoc);

        const instanceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
        instanceBufferRef.current = instanceBuffer;

        // setup instancing data
        const stride = 20;
        const pposLoc = gl.getAttribLocation(program, "ipos");
        gl.vertexAttribPointer(pposLoc, 2, gl.FLOAT, false, stride, 0);
        gl.vertexAttribDivisor(pposLoc, 1);
        gl.enableVertexAttribArray(pposLoc);

        const rotLoc = gl.getAttribLocation(program, "irotation");
        gl.vertexAttribPointer(rotLoc, 1, gl.FLOAT, false, stride, 8);
        gl.vertexAttribDivisor(rotLoc, 1);
        gl.enableVertexAttribArray(rotLoc);

        const scaleLoc = gl.getAttribLocation(program, "iscale");
        gl.vertexAttribPointer(scaleLoc, 1, gl.FLOAT, false, stride, 12);
        gl.vertexAttribDivisor(scaleLoc, 1);
        gl.enableVertexAttribArray(scaleLoc);

        const opacityLoc = gl.getAttribLocation(program, "iopacity");
        gl.vertexAttribPointer(opacityLoc, 1, gl.FLOAT, false, stride, 16);
        gl.vertexAttribDivisor(opacityLoc, 1);
        gl.enableVertexAttribArray(opacityLoc);

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // load snowflake img
        const img = new Image();
        img.src = "/sprites/snow.png";
        img.onerror = (e) => {
            console.error("failed to load snowflake image:", e);
            imageRef.current = undefined;
        };

        img.onload = () => {
            console.log("snowflake image loaded successfully");
            imageRef.current = img;
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageRef.current!);
            gl.generateMipmap(gl.TEXTURE_2D);
        };

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
                
                const instanceData = new Float32Array(particles.current.length * 5);
                let offset = 0;

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
                    // update instancing data
                    instanceData[offset++] = p.x;
                    instanceData[offset++] = p.y;
                    instanceData[offset++] = p.rotation;
                    if (imageRef.current === undefined)
                    {
                        offset++;
                    }
                    else
                    {
                        instanceData[offset++] = p.size * imageRef.current.height;
                    }
                    instanceData[offset++] = p.opacity;

                    p.update(deltaTime);
                }

                // update instance buffer
                gl.bufferData(gl.ARRAY_BUFFER, instanceData, gl.DYNAMIC_DRAW);

                if (imageRef.current != undefined)
                {
                    // opengl draw instanced
                    gl.useProgram(programRef.current);
                    gl.viewport(0, 0, canvas.width, canvas.height);
                    gl.clearColor(0, 0, 0, 0);
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.enable(gl.BLEND);
                    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                    gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, particles.current.length);
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
        <>
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-50"
            style={{ touchAction: "none" }}
        />
        </>
    );
};

export default Winter;
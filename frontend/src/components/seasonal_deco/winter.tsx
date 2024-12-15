"use client"
import React, { RefObject, useEffect, useRef, useState } from 'react';

const vertSrc = `#version 300 es
in vec4 pos;
in vec2 texCoord;
// x, y, rotation
in vec3 instancePosition;  
// size, opacity
in vec2 instanceScale;     
uniform vec2 canvasDimensions;

out vec2 vTexCoord;
out float vOpacity;

void main() {
    float cosR = cos(instancePosition.z);
    float sinR = sin(instancePosition.z);
    
    mat2 rotation = mat2(
        cosR, -sinR,
        sinR, cosR
    );
    
    vec2 transformedPos = rotation * (pos.xy * instanceScale.x) + instancePosition.xy;
    
    vec2 clipSpace = (transformedPos / canvasDimensions) * 2.0 - 1.0;
    
    gl_Position = vec4(clipSpace.x, -clipSpace.y, 0.0, 1.0);
    vTexCoord = texCoord;
    vOpacity = instanceScale.y;
}
`;
 
const fragmentSrc = `#version 300 es
precision highp float;

uniform sampler2D uTexture;

in vec2 vTexCoord;
in float vOpacity;

out vec4 outColor;

void main() {
    vec4 texColor = texture(uTexture, vTexCoord);
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
        this.xSpeed = options.xSpeed || (Math.random() * 2 - 1);
        this.opacity = options.opacity || Math.random() * 0.2 + 0.1;
        this.img = img;
    }

    public updateWithMouseInfo(deltaMouseX: number) {
        // make mouse impact horizontal speed
        this.xSpeed += deltaMouseX * 0.2;
    }

    public update(deltaTime: number) {
        // all snowflakes fall down at constant rate
        this.y += deltaTime * 75;
        // snowflakes will move left or right proportional to their rotation
        this.x += this.xSpeed * deltaTime * 50;
        this.rotation += this.xSpeed * deltaTime;
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
    const vaoRef = useRef<WebGLVertexArrayObject | null>(null);
    const instanceBufferRef = useRef<WebGLBuffer | null>(null);

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

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        vaoRef.current = vao;

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

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(program, 'pos');
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);
        gl.enableVertexAttribArray(posLoc);

        const texCoordLoc = gl.getAttribLocation(program, 'texCoord');
        gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 16, 8);
        gl.enableVertexAttribArray(texCoordLoc);

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        const instanceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
        instanceBufferRef.current = instanceBuffer;

        const positionLoc = gl.getAttribLocation(program, 'instancePosition');
        gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 20, 0);
        gl.vertexAttribDivisor(positionLoc, 1);
        gl.enableVertexAttribArray(positionLoc);

        const scaleLoc = gl.getAttribLocation(program, 'instanceScale');
        gl.vertexAttribPointer(scaleLoc, 2, gl.FLOAT, false, 20, 12);
        gl.vertexAttribDivisor(scaleLoc, 1);
        gl.enableVertexAttribArray(scaleLoc);

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        // load snowflake img
        const img = new Image();
        img.src = "/snow.png";
        img.onerror = (e) => {
            console.error('failed to load snowflake image:', e);
            imageRef.current = undefined;
        };

        img.onload = () => {
            console.log('snowflake image loaded successfully');
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
                    console.log("DRAWING...");
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
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-50"
            style={{ touchAction: 'none' }}
        />
    );
};

export default Winter;
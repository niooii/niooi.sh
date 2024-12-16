"use client"
import React, { RefObject, useEffect, useRef, useState } from "react";

const vertexShader = `#version 300 es
in vec2 pos;
void main() {
    gl_Position = vec4(pos, 0.0, 1.0);
}`;

const fragmentShader = `#version 300 es
precision highp float;
out vec4 outColor;
uniform vec2 canvasDimensions;
uniform vec2 siteDimensions;
uniform vec2 mousePos;
uniform float time;

vec4 map_to_color(float t) {
    float r = 9.0 * (1.0 - t) * t * t * t;
    float g = 15.0 * (1.0 - t) * (1.0 - t) * t * t;
    float b = 8.5 * (1.0 - t) * (1.0 - t) * (1.0 - t) * t;
    vec4 col = vec4(r, g, b, 1.0);
    return col * 1.f;
}

vec2 complexPow(vec2 z, vec2 w) {
    // z = a + bi, w = c + di
    float a = z.x;
    float b = z.y;
    float c = w.x;
    float d = w.y;
    
    // small epsilon so atan isnt undefined
    float r = sqrt(a * a + b * b) + 1e-9;
    float theta = atan(b, a);
    
    float modulus = pow(r, c) * exp(-d * theta);
    float angle = d * log(r) + c * theta;
    
    return modulus * vec2(cos(angle), sin(angle));
}

vec2 f(vec2 z, vec2 c, vec2 x) {
    return complexPow(z, x) + c;
}

void main() {
    const float zoom = 1.5f;

    vec2 uv = gl_FragCoord.xy / canvasDimensions;
    vec2 pixel = (uv * 2.0 - 1.0) * zoom;

    // a vector from [-1, 1] for x and y
    vec2 normMousePos = vec2((mousePos.x / siteDimensions.x) * 2.0 - 1.0, (mousePos.y / siteDimensions.y) * 2.0 - 1.0);
   
    const int maxIter = 500;
    bool escaped = false;
    
    // mandelbrot parameterized
    vec2 z = pixel;
    // to [-0.125, 0.125] -> ~[0.75, 0.9]
    vec2 c = vec2(normMousePos.x / 8.0 + 0.14, normMousePos.y / 10.0 + 0.735);
    // exponent
    vec2 x = vec2(normMousePos.x / 4.0 + 1.7, 0.1);

    int i = 0;
    for(; i < maxIter; i++) {
        z = f(z, c, x);
        if (length(z) > 2.0) {
            escaped = true;
            break;
        }
    }
   
    vec4 color = map_to_color(float(i) / float(maxIter));
    outColor = color;
}`;

type MandelbrotProps = {
    width: number;
    height: number;
};

const Mandelbrot = ({width, height}: MandelbrotProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const zoomRef = useRef<number>(1.0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = width;
        canvas.height = height;

        const gl = canvas.getContext("webgl2")!;

        const vertShader = gl.createShader(gl.VERTEX_SHADER)!;
        gl.shaderSource(vertShader, vertexShader);
        gl.compileShader(vertShader);

        const fragShader = gl.createShader(gl.FRAGMENT_SHADER)!;
        gl.shaderSource(fragShader, fragmentShader);
        gl.compileShader(fragShader);

        const program = gl.createProgram()!;
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        gl.useProgram(program);
        programRef.current = program;

        const canvasDimensionsLoc = gl.getUniformLocation(program, "canvasDimensions");
        gl.uniform2f(canvasDimensionsLoc, canvas.width, canvas.height);
        const siteDimensionsLoc = gl.getUniformLocation(programRef.current!, "siteDimensions");
        gl.uniform2f(siteDimensionsLoc, window.innerWidth, window.innerHeight);

        const positions = new Float32Array([
            -1, -1,
            1, -1,
            -1, 1,
            1, 1
        ]);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        const positionLoc = gl.getAttribLocation(program, "pos");
        gl.enableVertexAttribArray(positionLoc);
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

        const render = (time: number) => {
            if (!gl || !program) return;

            gl.viewport(0, 0, canvas.width, canvas.height);
            
            gl.useProgram(program);
            
            const timeLoc = gl.getUniformLocation(program, "time");
            gl.uniform1f(timeLoc, time/1000.0);
            
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            requestAnimationFrame(render);
        };

        render(0);

        const handleWheel = (e: WheelEvent) => {
            // e.preventDefault();
            const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
            zoomRef.current *= zoomFactor;
        };

        canvas.addEventListener("wheel", handleWheel);

        const handleResize = (_: UIEvent) => {
            const siteDimensionsLoc = gl.getUniformLocation(programRef.current!, "siteDimensions");
            gl.uniform2f(siteDimensionsLoc, window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            canvas.removeEventListener("wheel", handleWheel);
            window.removeEventListener("resize", handleResize);
            gl.deleteProgram(program);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext("webgl2")!;

        const handleMouseMove = (e: MouseEvent) => {
            const mousePosLoc = gl.getUniformLocation(programRef.current!, "mousePos");
            gl.uniform2fv(mousePosLoc, [e.x, e.y]);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="z-20"
            style={{ touchAction: "none" }}
            width={width}
            height={height}
        />
    );
};

export default Mandelbrot;
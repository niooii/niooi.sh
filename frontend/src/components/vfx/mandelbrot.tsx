"use client"
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useSmoothMouse } from "@/hooks/smooth_mouse";

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
uniform float zoom;

vec4 map_to_color(float t) {
    float r = 9.0 * (1.0 - t) * t * t * t;
    float g = 15.0 * (1.0 - t) * (1.0 - t) * t * t;
    float b = 8.5 * (1.0 - t) * (1.0 - t) * (1.0 - t) * t;
    vec4 col = vec4(r, g, b, 1.0);
    return col * 1.0;
}

vec2 complexPow(vec2 z, vec2 w) {
    float a2 = z.x * z.x;
    float b2 = z.y * z.y;
    float r = sqrt(a2 + b2) + 1e-9;
    float theta = atan(z.y, z.x);
    float logr = log(r);
    float modulus = exp(w.x * logr - w.y * theta);
    float angle = w.y * logr + w.x * theta;
    return modulus * vec2(cos(angle), sin(angle));
}

vec2 f(vec2 z, vec2 c, vec2 x) {
    return complexPow(z, x) + c;
}

void main() {
    vec2 uv = gl_FragCoord.xy / canvasDimensions;
    vec2 pixel = (uv * 2.0 - 1.0) * zoom;
    
    float timeScale = 1.0;
    vec2 normMousePos = vec2(
        (mousePos.x / siteDimensions.x) * 2.0 - 1.0,
        (mousePos.y / siteDimensions.y) * 2.0 - 1.0
    );
    
    vec2 c = vec2(
        normMousePos.x / 8.0 + 0.14 + 0.02 * sin(time * timeScale),
        (-normMousePos.y / 10.0 + 0.725) + 0.02 * cos(time * timeScale)
    );
    
    vec2 x = vec2(
        normMousePos.x / 4.0 + 1.7 + 0.01 * sin(time * timeScale * 0.7),
        0.1 + 0.01 * cos(time * timeScale * 0.5)
    );
    
    vec2 z = pixel;
    const int maxIter = 800;
    int i = 0;
    
    for(; i < maxIter; i++) {
        z = f(z, c, x);
        if (dot(z, z) > float(maxIter) / 2.0)
            break;
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
    const zoomRef = useRef<number>(1.5);
    const mouse = useSmoothMouse(0.06);

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
        const zoomLoc = gl.getUniformLocation(programRef.current!, "zoom");
        gl.uniform1f(zoomLoc, zoomRef.current);

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

            const mousePosLoc = gl.getUniformLocation(program, "mousePos");
            gl.uniform2fv(mousePosLoc, [mouse.current.x, mouse.current.y]);
            
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            // console.log(mouseRef.current);
            requestAnimationFrame(render);
        };

        render(0);

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const zoomFactor = e.deltaY < 0 ? 0.9 : 1.1;
            zoomRef.current *= zoomFactor;
            const zoomLoc = gl.getUniformLocation(programRef.current!, "zoom");
            gl.uniform1f(zoomLoc, zoomRef.current);
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
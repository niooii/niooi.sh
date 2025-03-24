import { useSmoothMouse } from '@/hooks/smooth_mouse';
import { useRef, useEffect } from 'react';

// Vertex shader - kept simple
const vertexShader = `#version 300 es
in vec2 pos;
void main() {
  gl_Position = vec4(pos, 0.0, 1.0);
}`;

// Optimized fragment shader
const fragmentShader = `#version 300 es
precision mediump float; // Lower precision for better performance

out vec4 outColor;

// Uniforms
uniform vec2 canvasDimensions;
uniform vec2 siteDimensions;
uniform vec2 mousePos;
uniform float time;
uniform float zoom;

// Color mapping function - kept the same
vec4 map_to_color(float t) {
  vec3 color = vec3(
    3.0 * (1.0 - t) * t * t * t, // Very minimal red component
    5.0 * (1.0 - t) * (1.0 - t) * t * t, // Reduced green for some cyan tints
    15.0 * (1.0 - t) * (1.0 - t) * (1.0 - t) * t // Enhanced blue component
  );
  color.b = pow(color.b, 0.7);
  float intensity = smoothstep(0.0, 0.3, t) * smoothstep(1.0, 0.7, t);
  color *= intensity * 1.5;
  return vec4(color, 1.0);
}

// Optimized complex power function with fast paths for common cases
vec2 complexPow(vec2 z, vec2 w) {
  float lenSquared = dot(z, z);
  
  // Early bailout for tiny numbers to avoid precision issues
  if (lenSquared < 1e-10) return vec2(0.0);
  
  // Fast path for integer powers (most common cases)
  if (abs(w.y) < 1e-6) {
    // Integer power optimization
    if (abs(w.x - 2.0) < 1e-6) {
      // z² - very common case, direct formula is much faster
      return vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
    }
    else if (abs(w.x - 3.0) < 1e-6) {
      // z³ - compute z² then multiply by z
      vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      return vec2(z2.x * z.x - z2.y * z.y, z2.x * z.y + z2.y * z.x);
    }
    else if (abs(w.x - 4.0) < 1e-6) {
      // z⁴ - compute z² then square it
      vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y);
      return vec2(z2.x * z2.x - z2.y * z2.y, 2.0 * z2.x * z2.y);
    }
  }
  
  // Fall back to standard implementation for non-integer powers
  // Using optimized algorithm to reduce trig operations
  float len = sqrt(lenSquared);
  float theta = atan(z.y, z.x);
  float logr = 0.5 * log(lenSquared); // faster than log(len)
  float modulus = exp(w.x * logr - w.y * theta);
  float angle = w.y * logr + w.x * theta;
  
  // Using sin/cos is more efficient than separate operations
  return modulus * vec2(cos(angle), sin(angle));
}

// Complex function we're iterating
vec2 f(vec2 z, vec2 c, vec2 x) {
  return complexPow(z, x) + c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / canvasDimensions;
  vec2 pixel = (uv * 2.0 - 1.0) * zoom;
  
  // Time-based animation
  float timeScale = 1.0;
  float sinTime = sin(time * timeScale);
  float cosTime = cos(time * timeScale);
  float sinTime2 = sin(time * timeScale * 0.7);
  float cosTime2 = cos(time * timeScale * 0.5);
  
  // Mouse position calculation
  vec2 normMousePos = vec2(
    (mousePos.x / siteDimensions.x) * 2.0 - 1.0,
    (mousePos.y / siteDimensions.y) * 2.0 - 1.0
  );
  
  // Fractal parameters
  vec2 c = vec2(
    normMousePos.x / 8.0 + 0.14 + 0.02 * sinTime,
    (-normMousePos.y / 10.0 + 0.725) + 0.02 * cosTime
  );
  
  vec2 x = vec2(
    normMousePos.x / 4.0 + 1.7 + 0.01 * sinTime2,
    0.1 + 0.01 * cosTime2
  );
  
  vec2 z = pixel;
  
  // Performance optimization - vary iteration count based on distance from center
  vec2 center = vec2(0.5) * canvasDimensions;
  float distFromCenter = length(gl_FragCoord.xy - center) / length(center);
  
  int maxIter = 400;
  if (distFromCenter > 0.7) {
    maxIter = int(float(maxIter) * (1.0 - (distFromCenter - 0.7) * 0.6));
    maxIter = max(maxIter, 50); // Don't go below 50 iterations
  }
  
  // Escape threshold (squared bailout radius)
  const float bailoutSquared = 160000.0; // 400²
  
  // Iteration
  int i = 0;
  
  // Early bailout phase
  for(int n = 0; n < 12 && i < maxIter; n++, i++) {
    z = f(z, c, x);
    if (dot(z, z) > bailoutSquared) {
      outColor = map_to_color(float(i) / float(maxIter));
      return;
    }
  }
  
  // Main iteration phase
  if (i < maxIter) {
    if (length(z) < 2.0) {
      // For areas close to the set, we need detailed iteration
      for(; i < maxIter; i++) {
        z = f(z, c, x);
        if (dot(z, z) > bailoutSquared) {
          outColor = map_to_color(float(i) / float(maxIter));
          return;
        }
      }
    } else {
      // For areas likely to escape, use unrolled iterations
      for(; i < maxIter; i += 4) {
        z = f(z, c, x);
        if (dot(z, z) > bailoutSquared) {
          outColor = map_to_color(float(i) / float(maxIter));
          return;
        }
        
        z = f(z, c, x);
        if (dot(z, z) > bailoutSquared) {
          outColor = map_to_color(float(i + 1) / float(maxIter));
          return;
        }
        
        z = f(z, c, x);
        if (dot(z, z) > bailoutSquared) {
          outColor = map_to_color(float(i + 2) / float(maxIter));
          return;
        }
        
        z = f(z, c, x);
        if (dot(z, z) > bailoutSquared) {
          outColor = map_to_color(float(i + 3) / float(maxIter));
          return;
        }
      }
    }
  }
  
  // If we reach here, point is in the set
  outColor = map_to_color(1.0);
}`;

// WebGL resource manager for proper cleanup
class WebGLResources {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram | null = null;
  private vao: WebGLVertexArrayObject | null = null;
  private buffer: WebGLBuffer | null = null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  createShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;
    
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    // Check compilation status
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }

  createProgram(vertexSource: string, fragmentSource: string): boolean {
    const vertShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);
    
    if (!vertShader || !fragShader) return false;
    
    this.program = this.gl.createProgram();
    if (!this.program) return false;
    
    this.gl.attachShader(this.program, vertShader);
    this.gl.attachShader(this.program, fragShader);
    this.gl.linkProgram(this.program);
    
    // Check link status
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program linking error:', this.gl.getProgramInfoLog(this.program));
      this.cleanup();
      return false;
    }
    
    // Clean up shaders - they're linked to the program now
    this.gl.deleteShader(vertShader);
    this.gl.deleteShader(fragShader);
    
    return true;
  }

  setupGeometry(): boolean {
    // Create and bind VAO
    this.vao = this.gl.createVertexArray();
    if (!this.vao) return false;
    this.gl.bindVertexArray(this.vao);
    
    // Create buffer
    this.buffer = this.gl.createBuffer();
    if (!this.buffer) return false;
    
    // Full-screen quad (triangle strip)
    const positions = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      1, 1
    ]);
    
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    
    if (!this.program) return false;
    
    // Set up attribute
    const positionLoc = this.gl.getAttribLocation(this.program, "pos");
    this.gl.enableVertexAttribArray(positionLoc);
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0);
    
    return true;
  }

  getProgram(): WebGLProgram | null {
    return this.program;
  }

  cleanup(): void {
    const gl = this.gl;
    
    // Clean up VAO
    if (this.vao) {
      gl.deleteVertexArray(this.vao);
      this.vao = null;
    }
    
    // Clean up buffer
    if (this.buffer) {
      gl.deleteBuffer(this.buffer);
      this.buffer = null;
    }
    
    // Clean up program (this also detaches shaders)
    if (this.program) {
      gl.deleteProgram(this.program);
      this.program = null;
    }
  }
  
  isValid(): boolean {
    return !!this.program && !!this.vao && !!this.buffer;
  }
}

type MandelbrotProps = {
  width: number;
  height: number;
};

const Mandelbrot = ({ width, height }: MandelbrotProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const resourcesRef = useRef<WebGLResources | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mouse = useSmoothMouse(0.03);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = width;
    canvas.height = height;
    
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL 2 not supported');
      return;
    }
    glRef.current = gl;
    
    const resources = new WebGLResources(gl);
    resourcesRef.current = resources;
    
    if (!resources.createProgram(vertexShader, fragmentShader)) {
      console.error('Failed to create WebGL program');
      return;
    }
    
    if (!resources.setupGeometry()) {
      console.error('Failed to set up geometry');
      return;
    }
    
    const program = resources.getProgram();
    if (!program) return;
    
    gl.useProgram(program);
    
    const canvasDimensionsLoc = gl.getUniformLocation(program, "canvasDimensions");
    gl.uniform2f(canvasDimensionsLoc, canvas.width, canvas.height);
    
    const siteDimensionsLoc = gl.getUniformLocation(program, "siteDimensions");
    gl.uniform2f(siteDimensionsLoc, window.innerWidth, window.innerHeight);
    
    const zoomLoc = gl.getUniformLocation(program, "zoom");
    gl.uniform1f(zoomLoc, 2);
    
    const render = (time: number) => {
      const gl = glRef.current;
      const resources = resourcesRef.current;
      
      if (!gl || !resources || !resources.isValid()) {
        animationFrameRef.current = null;
        return;
      }
      
      const program = resources.getProgram();
      if (!program) return;
      
      // Clear and set viewport
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      gl.useProgram(program);
      
      const timeLoc = gl.getUniformLocation(program, "time");
      gl.uniform1f(timeLoc, time / 1000.0);
      
      const mousePosLoc = gl.getUniformLocation(program, "mousePos");
      gl.uniform2fv(mousePosLoc, [mouse.current.x, mouse.current.y]);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      
      animationFrameRef.current = requestAnimationFrame(render);
    };
    
    animationFrameRef.current = requestAnimationFrame(render);
    
    const handleResize = () => {
      const gl = glRef.current;
      const resources = resourcesRef.current;
      
      if (!gl || !resources || !resources.isValid()) return;
      
      const program = resources.getProgram();
      if (!program) return;
      
      const siteDimensionsLoc = gl.getUniformLocation(program, "siteDimensions");
      gl.uniform2f(siteDimensionsLoc, window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener("resize", handleResize);
    
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      if (resourcesRef.current) {
        resourcesRef.current.cleanup();
        resourcesRef.current = null;
      }
      
      window.removeEventListener("resize", handleResize);
    };
  }, [width, height]); 
  
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
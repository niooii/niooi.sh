"use client"

import Shell from "@/components/shell";
import Mandelbrot from "@/components/vfx/mandelbrot";
import Winter from "@/components/vfx/winter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <pre>
        wah wah wah
      </pre>
      <Shell/>
      <Winter spawnRate={10}></Winter>
      <Mandelbrot width={1440} height={1440}></Mandelbrot>
      <h1>MOVE MOUSE</h1>
      <h1 className="text-center text-7xl">HI CHAT</h1>
    </div>
  );
}

"use client"

import AnimationTest from "@/components/animation_test";
import Winter from "@/components/vfx/winter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <pre>
        wah wah wah
        </pre>
      <Winter spawnRate={10}></Winter>
      <h1>MOVE MOUSE</h1>
      <h1 className="text-center text-7xl">HI CHAT</h1>
    </div>
  );
}

"use client"

import AnimationTest from "@/components/animation_test";
import Winter from "@/components/seasonal_deco/winter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Winter spawnRate={10}></Winter>
      <h1>MOVE MOUSE</h1>
    </div>
  );
}

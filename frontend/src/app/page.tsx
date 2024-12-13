"use client"

import AnimationTest from "@/components/animation_test";
import Winter from "@/components/seasonal_deco/winter";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* <Counter></Counter> */}
      {/* <AnimationTest></AnimationTest> */}
      <Winter spawnRate={5}></Winter>
      <h1>MOVE MOUSE</h1>
    </div>
  );
}

"use client"

import AnimationTest from "@/components/animation_test";
import Counter from "@/components/counter";
import SeasonalEffects, { Season } from "@/components/seasonal_effects";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* <Counter></Counter> */}
      {/* <AnimationTest></AnimationTest> */}
      <SeasonalEffects season={Season.WINTER} particleCount={75}></SeasonalEffects>
    </div>
  );
}

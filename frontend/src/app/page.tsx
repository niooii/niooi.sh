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
      <canvas id="myCanvas" width="200" height="100">
      Your browser does not support the HTML canvas tag.</canvas>

      <script>
      var c = document.getElementById("myCanvas");
      var ctx = c.getContext("2d");
      ctx.font = "30px Arial";
      ctx.strokeText("Hello World",10,50);
      </script>
    </div>
  );
}

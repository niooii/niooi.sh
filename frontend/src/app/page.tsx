import SeasonalEffects, { Season } from "@/components/seasonal_effects";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <SeasonalEffects season={Season.WINTER} particleCount={75} />
      <h1>wow chat</h1>
    </div>
  );
}

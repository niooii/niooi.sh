import React from "react";

const ICONS = [
  { src: "/icons/discord.svg", alt: "Discord", link: "https://discord.com/users/381851699763216386" },
  { src: "/icons/google-gmail.svg", alt: "Gmail", link: "mailto:onioniwonpounoin@gmail.com" },
  { src: "/icons/instagram.svg", alt: "Instagram", link: "https://instagram.com/yourprofile" }, // Placeholder, add your real link and icon
];

interface SpinningSocialCircleProps {
  rotation: number; // in degrees
  size?: number; // diameter in px
}

const SpinningSocialCircle: React.FC<SpinningSocialCircleProps> = ({ rotation, size = 120 }) => {
  const radius = size / 2 - 24; // 24px icon offset
  const center = size / 2;
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {ICONS.map((icon, i) => {
        // Offset each icon's angle by the rotation prop
        const baseAngle = (i / ICONS.length) * 2 * Math.PI;
        const angle = baseAngle + (rotation * Math.PI / 180);
        const x = center + radius * Math.cos(angle) - 20;
        const y = center + radius * Math.sin(angle) - 20;
        return (
          <a
            key={icon.alt}
            href={icon.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "rgba(30,30,40,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              transition: "box-shadow 0.2s",
            }}
          >
            <img src={icon.src} alt={icon.alt} style={{ width: 28, height: 28, transform: "rotate(0deg)" }} />
          </a>
        );
      })}
    </div>
  );
};

export default SpinningSocialCircle; 
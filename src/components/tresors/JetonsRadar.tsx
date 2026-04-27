"use client";

import { motion } from "framer-motion";

interface JetonsRadarProps {
  conscience: number;
  confiance: number;
  connaissance: number;
  competence: number;
}

export function JetonsRadar({ conscience, confiance, connaissance, competence }: JetonsRadarProps) {
  // Simple Radar implementation using SVG
  const size = 200;
  const center = size / 2;
  const radius = size * 0.4;

  const points = [
    { label: "Conscience", value: conscience, angle: 0 },
    { label: "Confiance", value: confiance, angle: 90 },
    { label: "Connaissance", value: connaissance, angle: 180 },
    { label: "Compétence", value: competence, angle: 270 },
  ];

  const getPointCoords = (value: number, angle: number) => {
    const r = (value / 100) * radius;
    const x = center + r * Math.cos((angle * Math.PI) / 180);
    const y = center + r * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  const pathData = points
    .map((p, i) => {
      const coords = getPointCoords(p.value, p.angle);
      return `${i === 0 ? "M" : "L"} ${coords.x} ${coords.y}`;
    })
    .join(" ") + " Z";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[200px] h-[200px]">
        <svg width={size} height={size} className="overflow-visible">
          {/* Circular Grids */}
          {[25, 50, 75, 100].map((r) => (
            <circle
              key={r}
              cx={center}
              cy={center}
              r={(r / 100) * radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="1"
            />
          ))}
          
          {/* Axis */}
          {points.map((p) => {
            const end = getPointCoords(100, p.angle);
            return (
              <line
                key={p.label}
                x1={center}
                y1={center}
                x2={end.x}
                y2={end.y}
                stroke="#F3F4F6"
                strokeWidth="1"
              />
            );
          })}

          {/* Radar Shape */}
          <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d={pathData}
            fill="#008751"
            stroke="#008751"
            strokeWidth="2"
          />
          
          {/* Data Points */}
          {points.map((p) => {
            const coords = getPointCoords(p.value, p.angle);
            return (
              <circle
                key={p.label}
                cx={coords.x}
                cy={coords.y}
                r="3"
                fill="#008751"
              />
            );
          })}
        </svg>

        {/* Labels */}
        {points.map((p) => {
          const coords = getPointCoords(115, p.angle);
          return (
            <div
              key={p.label}
              className="absolute text-[8px] font-black uppercase tracking-tighter text-gray-400"
              style={{
                left: `${coords.x}px`,
                top: `${coords.y}px`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {p.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

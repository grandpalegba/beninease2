"use client";

import { motion } from "framer-motion";

interface JetonsRadarProps {
  conscience: number;
  confiance: number;
  connaissance: number;
  competence: number;
}

export function JetonsRadar({ conscience, confiance, connaissance, competence }: JetonsRadarProps) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = 100;

  const AXES = [
    { key: "competence", label: "Concordance", color: "#008751", value: competence || 5, icon: "media__1777354591153.png" },
    { key: "conscience", label: "Conscience", color: "#E8112D", value: conscience || 5, icon: "media__1777354591157.png" },
    { key: "connaissance", label: "Connaissance", color: "#1A1A1A", value: connaissance || 5, icon: "media__1777354591130.png" },
    { key: "confiance", label: "Confiance", color: "#FAC710", value: confiance || 5, icon: "media__1777354591136.png" },
  ] as const;

  // 1. Calcul des coordonnées pour chaque point (échelle 5 à 40)
  const points = AXES.map((axis, i) => {
    const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
    // Normalisation : 40 est le rayon max
    const ratio = axis.value / 40; 
    const r = ratio * maxRadius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      label: axis.label,
      value: axis.value,
      angle
    };
  });

  // 2. Création de la chaîne de caractères pour le chemin SVG
  const drawPath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
          {/* Cercles de fond (Grille) */}
          {[10, 20, 30, 40].map((val) => (
            <circle
              key={val}
              cx={cx}
              cy={cy}
              r={(val / 40) * maxRadius}
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />
          ))}
          
          {/* Axes */}
          {AXES.map((_, i) => {
            const angle = (Math.PI * 2 * i) / AXES.length - Math.PI / 2;
            const x2 = cx + maxRadius * Math.cos(angle);
            const y2 = cy + maxRadius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x2}
                y2={y2}
                stroke="#D4AF37"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
            );
          })}

          {/* Polygone Dynamique Animé */}
          <motion.path
            d={drawPath}
            fill="#E2E8F0"
            fillOpacity={0.45}
            stroke="#D4AF37"
            strokeWidth={1}
            strokeLinejoin="round"
            initial={false}
            animate={{ d: drawPath }}
            transition={{ 
              type: "spring", 
              stiffness: 60, 
              damping: 15 
            }}
          />

          {/* Points (Jetons) sur les sommets */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={4.5}
              fill={AXES[i].color}
              initial={false}
              animate={{ cx: p.x, cy: p.y }}
              transition={{ 
                type: "spring", 
                stiffness: 60, 
                damping: 15 
              }}
            />
          ))}
        </svg>

        {/* Labels avec valeurs */}
        {points.map((p, i) => {
          const labelDist = maxRadius + 65; // Augmenté pour laisser de la place à l'icône
          const lx = cx + labelDist * Math.cos(p.angle);
          const ly = cy + labelDist * Math.sin(p.angle);
          
          return (
            <div
              key={p.label}
              className="absolute flex flex-col items-center justify-center text-center leading-tight"
              style={{
                left: `${lx}px`,
                top: `${ly}px`,
                transform: "translate(-50%, -50%)",
                width: "120px"
              }}
            >
              <div className="mb-3 w-16 h-16 relative flex items-center justify-center">
                <img 
                  src={`/${AXES[i].icon}`} 
                  alt={p.label} 
                  className="w-full h-full object-contain drop-shadow-sm transition-transform hover:scale-110 duration-500"
                />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
                {p.label}
              </span>
              <span className="text-[12px] font-bold text-gray-900">
                {p.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

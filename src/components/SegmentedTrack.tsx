'use client';

import { motion } from "framer-motion";

interface Props {
  /** valeur 0-100 */
  value: number;
  /** nombre total de segments (par défaut 12) */
  segments?: number;
  /** label affiché à gauche */
  label: string;
  /** nb d'avis */
  count?: number;
  /** interactif : permet de changer la valeur en cliquant un segment */
  onChange?: (value: number) => void;
  /** question affichée à côté du label */
  question?: string;
}

/**
 * Barre segmentée 3 zones (vert / jaune / rouge) sans curseur.
 * Les segments allumés vont de gauche à droite, leur couleur dépend de leur
 * position : 1ᵉʳ tiers vert, 2ᵉ tiers jaune, 3ᵉ tiers rouge.
 * Sert à représenter une moyenne d'évaluation reçue par un bokônon.
 */
const SegmentedTrack = ({
  value,
  segments = 12,
  label,
  count,
  onChange,
  question,
}: Props) => {
  const filled = Math.max(0, Math.min(segments, Math.round((value / 100) * segments)));
  const interactive = typeof onChange === "function";

  const colorFor = (i: number) => {
    const ratio = i / segments;
    if (ratio < 1 / 3) return "#008751"; // vert Bénin
    if (ratio < 2 / 3) return "#fcd116"; // jaune Bénin
    return "#e8112d"; // rouge Bénin
  };

  const handleSelect = (i: number) => {
    if (!onChange) return;
    // On clique sur le segment i (0-indexed) → on remplit jusqu'à i+1 segments
    const next = Math.round(((i + 1) / segments) * 100);
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5 gap-2">
        <div className="flex items-baseline gap-2 min-w-0">
          <span
            className="font-headline text-sm font-medium shrink-0"
            style={{ color: "#2d2f2f" }}
          >
            {label}
          </span>
          {question && (
            <span
              className="text-[11px] italic truncate hidden sm:inline"
              style={{ color: "#5a5c5c" }}
            >
              {question}
            </span>
          )}
        </div>
        <span
          className="font-headline text-sm font-bold tabular-nums"
          style={{ color: "#2d2f2f" }}
        >
          {value}
          <span
            className="text-[10px] font-normal ml-1"
            style={{ color: "#5a5c5c" }}
          >
            /100
          </span>
        </span>
      </div>
      <div
        className="flex gap-[3px] p-[3px] rounded-md"
        style={{ background: "#f0f1f1" }}
        role={interactive ? "slider" : "img"}
        aria-label={`${label}: ${value} sur 100${count ? `, ${count} avis` : ""}`}
        aria-valuenow={interactive ? value : undefined}
        aria-valuemin={interactive ? 0 : undefined}
        aria-valuemax={interactive ? 100 : undefined}
      >
        {Array.from({ length: segments }).map((_, i) => {
          const isOn = i < filled;
          const Tag = interactive ? (motion.button as any) : (motion.span as any);
          return (
            <Tag
              key={i}
              type={interactive ? "button" : undefined}
              onClick={interactive ? () => handleSelect(i) : undefined}
              initial={{ opacity: 0.2, scaleY: 0.6 }}
              animate={{ opacity: isOn ? 1 : 0.18, scaleY: 1 }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
              whileHover={interactive ? { scaleY: 1.15 } : undefined}
              whileTap={interactive ? { scaleY: 0.85 } : undefined}
              className="flex-1 rounded-[2px]"
              style={{
                height: 16,
                background: isOn ? colorFor(i) : "#cfd1d1",
                cursor: interactive ? "pointer" : "default",
                border: "none",
                padding: 0,
              }}
              aria-label={interactive ? `Régler à ${Math.round(((i + 1) / segments) * 100)}` : undefined}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SegmentedTrack;

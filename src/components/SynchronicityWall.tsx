'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { CONSULTATIONS, type Consultation } from "@/data/consultations";
import WallTile from "./WallTile";
import ConsultationModal from "./ConsultationModal";
import BeninFrame from "./BeninFrame";
import { useLivingOrder } from "@/hooks/useLivingOrder";

/**
 * SynchronicityWall - A living gallery of consultations.
 * Cells periodically swap positions to create a "living" community effect.
 */
const SynchronicityWall = () => {
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const order = useLivingOrder(CONSULTATIONS.length, 6, 2200);

  const handleSelect = (c: Consultation) => {
    setSelected(c);
    setRevealed((prev) => {
      const next = new Set(prev);
      next.add(c.id);
      return next;
    });
  };

  const resetWall = () => setRevealed(new Set());

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <div className="text-center mb-5 px-4">
          <p
            className="font-headline italic text-sm md:text-base text-neutral-500"
          >
            Choisissez une photo pour écouter la guidance proposée par le bokônon.
          </p>
        </div>
        <div className="overflow-x-auto">
          <BeninFrame
            className="mx-auto max-w-[640px] md:max-w-[820px] lg:max-w-[920px]"
            inset={12}
            thickness={6}
          >
            <div
              className="grid gap-[2px] bg-white"
              style={{ gridTemplateColumns: "repeat(16, 1fr)" }}
            >
              {order.map((idx, slot) => {
                const c = CONSULTATIONS[idx];
                if (!c) return null;
                return (
                  <WallTile
                    key={c.id}
                    consultation={c}
                    index={slot}
                    isSelected={revealed.has(c.id)}
                    onClick={handleSelect}
                  />
                );
              })}
            </div>
          </BeninFrame>
        </div>

        {revealed.size > 0 && (
          <div className="flex items-center justify-center mt-4">
            <button
              onClick={resetWall}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-label uppercase tracking-[0.2em] font-bold transition-colors"
              style={{
                background: "#f0f1f1",
                color: "#5a5c5c",
              }}
            >
              <RotateCcw size={12} />
              Réinitialiser le mur ({revealed.size})
            </button>
          </div>
        )}
      </motion.div>

      <ConsultationModal consultation={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default SynchronicityWall;

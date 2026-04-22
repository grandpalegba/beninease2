'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useConsultations } from "@/hooks/useConsultations";
import { useLivingOrder } from "@/hooks/useLivingOrder";
import WallTile from "./WallTile";
import ConsultationModal from "./ConsultationModal";
import BeninFrame from "./BeninFrame";

/**
 * SynchronicityWall - A living gallery of consultations.
 * Cells periodically swap positions to create a "living" community effect.
 */
const SynchronicityWall = () => {
  const { data: consultations = [], isLoading } = useConsultations();
  const [selected, setSelected] = useState<Consultation | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  
  // Le chef d'orchestre du mouvement
  const order = useLivingOrder(256, 6, 2200);

  // Diagnostic visuel
  console.log("Ordre du mur:", order.slice(0, 5), "...");

  // Optimisation du rendu : on crée une Map pour un accès rapide aux consultations par coordonnées
  const consultationMap = new Map<string, Consultation>();
  consultations.forEach(c => {
    consultationMap.set(`${c.rowIndex}-${c.colIndex}`, c);
  });

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
        className={`flex flex-col items-center justify-center py-8 px-4 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
      >
        <div className="w-full flex justify-center mb-12">
          <BeninFrame
            className="w-[90vw] max-w-[550px] aspect-square"
            inset={8}
            thickness={2}
          >
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.005,
                  }
                }
              }}
              initial="hidden"
              animate="visible"
              className="grid w-full h-full bg-background gap-[1px]"
              style={{ gridTemplateColumns: "repeat(16, 1fr)" }}
            >
              {order.map((originalIndex) => {
                const row = Math.floor(originalIndex / 16);
                const col = originalIndex % 16;
                const consultation = consultationMap.get(`${row}-${col}`) || null;

                return (
                  <WallTile
                    key={`tile-${originalIndex}`}
                    consultation={consultation}
                    index={originalIndex}
                    isSelected={consultation ? revealed.has(consultation.id) : false}
                    onClick={consultation ? handleSelect : undefined}
                  />
                );
              })}
            </motion.div>
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

      <ConsultationModal
        consultation={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default SynchronicityWall;

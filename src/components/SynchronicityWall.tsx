'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useConsultations } from "@/hooks/useConsultations";
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

  const handleSelect = (c: Consultation) => {
    setSelected(c);
    setRevealed((prev) => {
      const next = new Set(prev);
      next.add(c.id);
      return next;
    });
  };

  const resetWall = () => setRevealed(new Set());

  // Génération des 256 cases de la matrice 16x16
  const gridCells = Array.from({ length: 256 }, (_, i) => {
    const row = Math.floor(i / 16);
    const col = i % 16;
    // Cherche la consultation correspondante aux coordonnées
    const consultation = consultations.find(
      (c) => c.rowIndex === row && c.colIndex === col
    );
    return { i, row, col, consultation };
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className={`flex flex-col items-center justify-center py-8 px-4 ${isLoading ? "opacity-50 pointer-events-none" : "opacity-100"}`}
      >
        <div className="text-center mb-8 px-4">
          <p className="font-headline italic text-sm md:text-base text-neutral-500">
            Choisissez une photo pour écouter la guidance proposée par le bokônon.
          </p>
        </div>

        <div className="w-full flex justify-center mb-12">
          <BeninFrame
            className="w-[90vw] max-w-[550px] aspect-square"
            inset={6}
            thickness={3}
          >
            <div
              className="grid w-full h-full bg-neutral-900 gap-[1px]"
              style={{ gridTemplateColumns: "repeat(16, 1fr)" }}
            >
              {gridCells.map((cell) => (
                <WallTile
                  key={cell.i}
                  consultation={cell.consultation}
                  index={cell.i}
                  isSelected={cell.consultation ? revealed.has(cell.consultation.id) : false}
                  onClick={cell.consultation ? handleSelect : undefined}
                />
              ))}
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

      <ConsultationModal
        consultation={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default SynchronicityWall;

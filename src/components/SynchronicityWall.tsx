'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useProfiles, type Profile } from "@/hooks/useProfiles";
import { useLivingOrder } from "@/hooks/useLivingOrder";
import WallTile from "./WallTile";
import ConsultationModal from "./ConsultationModal";
import BeninFrame from "./BeninFrame";

/**
 * SynchronicityWall - A living gallery of profiles.
 * Displays profiles in an 8x8 grid.
 */
const SynchronicityWall = () => {
  const { data: profiles = [], isLoading } = useProfiles();
  const [selected, setSelected] = useState<any | null>(null);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  
  // Le chef d'orchestre du mouvement - 256 tiles (16x16)
  const order = useLivingOrder(256, 8, 2200);

  const handleSelect = (data: any) => {
    setSelected(data);
    setRevealed((prev) => {
      const next = new Set(prev);
      next.add(data.id);
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
            className="w-[85vw] max-w-[700px] aspect-square shadow-2xl"
            inset={0}
            thickness={3}
          >
            <div className="relative w-full h-full">
              {/* Fond Drapeau du Bénin */}
              <div className="absolute inset-0 flex overflow-hidden">
                <div className="w-1/2 bg-[#008751]" />
                <div className="w-1/2 flex flex-col">
                  <div className="h-1/2 bg-[#FCD116]" />
                  <div className="h-1/2 bg-[#E8112D]" />
                </div>
              </div>

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
                className="relative z-10 grid w-full h-full gap-0"
                style={{ gridTemplateColumns: "repeat(16, 1fr)" }}
              >
                {order.map((originalIndex) => {
                  // Modulo ensures 256 tiles are filled
                  const profile = profiles.length > 0 ? profiles[originalIndex % profiles.length] : null;

                  return (
                    <WallTile
                      key={`tile-${originalIndex}`}
                      data={profile}
                      index={originalIndex}
                      isSelected={profile ? revealed.has(profile.id) : false}
                      onClick={profile ? handleSelect : undefined}
                    />
                  );
                })}
              </motion.div>
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

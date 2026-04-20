'use client';

import { motion } from "framer-motion";
import type { LifeCase } from "@/features/consultation/useLifeCases";

interface Props {
  lifeCase: LifeCase;
  isActive: boolean; // Pour savoir si on joue l'audio
}

const SUPABASE_PROJECT_ID = "wtjhkqkqmexddroqwawk";
const STORAGE_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public`;

const CaseCard = ({ lifeCase, isActive }: Props) => {
  // Génération des URLs Supabase dynamiques
  const photoUrl = `${STORAGE_BASE_URL}/images_casdevie/cas${lifeCase.id}.jpg`;

  return (
    <div className="relative w-full h-full bg-white">
      {/* Background Cinematic Visual */}
      <img
        alt={lifeCase.persona}
        className="absolute inset-0 w-full h-full object-cover grayscale-[0.1]"
        src={photoUrl}
        draggable={false}
      />

      {/* Overlay dégradé pour la lisibilité du texte en bas */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Infos en bas de l'image (Persona + Thématique) */}
      <div className="absolute bottom-16 left-8 right-8 z-20">
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.7, x: 0 }}
          className="font-label text-[10px] tracking-[0.3em] uppercase font-bold text-[#fcd116]"
        >
          {lifeCase.label || "Consultation"}
        </motion.span>

        <h2 className="font-headline text-4xl text-white mt-1 leading-tight">
          {lifeCase.persona.split(',').slice(0, 2).join(',')}
        </h2>

        {/* Onde sonore dorée animée (s'active si la carte est au centre) */}
        <div className="mt-6 flex items-end gap-1.5 h-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
            <motion.span
              key={bar}
              animate={isActive ? {
                height: [4, 24, 12, 20, 4],
                opacity: [0.4, 1, 0.6, 0.8, 0.4]
              } : { height: 4, opacity: 0.3 }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                delay: bar * 0.1,
                ease: "easeInOut"
              }}
              className="w-1 bg-[#D4AF37] rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Indication visuelle de swipe haut */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-30">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-10 h-1 bg-white rounded-full"
        />
      </div>
    </div>
  );
};

export default CaseCard;
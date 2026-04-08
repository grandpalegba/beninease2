"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CandidateCard from "./CandidateCard";
import VoteSlider from "./VoteSlider";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function DuelCard({
  duel,
  userId,
  isActive,
  onNext
}: {
  duel: any;
  userId: string | null;
  isActive: boolean;
  onNext: () => void;
}) {
  const [sliderValue, setSliderValue] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [points, setPoints] = useState(1250); // À récupérer via le profil utilisateur normalement

  // Extraction des talents
  const leftTalent = duel?.talent_left;
  const rightTalent = duel?.talent_right;

  // Fonction de validation (déclenchée par le clic sur le curseur rouge)
  const handleValidate = async () => {
    if (hasVoted || isSubmitting || !userId) return;
    setIsSubmitting(true);

    try {
      // 1. Enregistrement du vote (Précision 0-100)
      const { error: voteError } = await supabase.from("votes_duels").insert({
        duel_id: duel.id,
        user_id: userId,
        vote_value: sliderValue,
      });

      if (voteError) throw voteError;

      // 2. Incrémentation des points (RPC)
      const { error: pointsError } = await supabase.rpc("increment_user_points", {
        p_user_id: userId,
        p_amount: 50
      });

      if (!pointsError) {
        setPoints(prev => prev + 50);
        setHasVoted(true);

        // Feedback visuel court avant de passer au duel suivant
        setTimeout(onNext, 1200);
      }
    } catch (e) {
      console.error("Erreur vote:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] bg-black flex flex-col items-center justify-center overflow-hidden">

      {/* EFFET DE FOND IMMERSIF : Aura de couleur basée sur la domination */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            backgroundColor: sliderValue < 50 ? "#006b3f" : "#ffd31a",
            opacity: Math.abs(sliderValue - 50) / 200 // L'aura s'intensifie avec le choix
          }}
          className="absolute inset-0 blur-[120px] transition-colors duration-1000"
        />
      </div>

      <div className="relative z-10 w-full h-full max-w-5xl flex flex-col lg:flex-row items-center justify-between p-4 lg:p-12 gap-6">

        {/* BADGE CATÉGORIE - Fixé en haut */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-30">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-2xl border border-white/20 px-6 py-2 rounded-full text-[10px] tracking-[0.4em] text-white font-black uppercase"
          >
            {duel?.category_id?.replace(/_/g, " ") || "Duel d'Excellence"}
          </motion.span>
        </div>

        {/* CANDIDAT GAUCHE (VERT) */}
        <div className="w-full lg:w-[42%] h-[35vh] lg:h-[70vh]">
          <CandidateCard
            name={leftTalent?.full_name || "Talent Vert"}
            prenom_talent={leftTalent?.prenom_talent}
            nom_talent={leftTalent?.nom_talent}
            signature={leftTalent?.signature}
            image={leftTalent?.profile_image}
            video={leftTalent?.video_url}
            color="green"
            isActive={isActive}
            intensity={Math.max(0, 50 - sliderValue)} // Brille si slider à gauche
          />
        </div>

        {/* INTERFACE DE CONTRÔLE CENTRALE */}
        <div className="w-full lg:w-[12%] flex flex-col items-center justify-center gap-8 py-4 z-20">
          <VoteSlider
            value={sliderValue}
            onChange={setSliderValue}
            onValidate={handleValidate}
            disabled={hasVoted || isSubmitting}
          />

          {/* SCORE / FEEDBACK POINTS */}
          <div className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              {hasVoted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[#ffd31a] font-black text-xs tracking-widest uppercase">Vote Scellé</span>
                  <span className="text-white font-manrope text-2xl font-black">+50 XP</span>
                </motion.div>
              ) : (
                <motion.div className="flex flex-col items-center opacity-40">
                  <span className="text-white font-manrope text-xl font-bold">{points}</span>
                  <span className="text-white/50 text-[8px] tracking-widest uppercase font-bold">Points Totaux</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CANDIDAT DROITE (JAUNE) */}
        <div className="w-full lg:w-[42%] h-[35vh] lg:h-[70vh]">
          <CandidateCard
            name={rightTalent?.full_name || "Talent Jaune"}
            prenom_talent={rightTalent?.prenom_talent}
            nom_talent={rightTalent?.nom_talent}
            signature={rightTalent?.signature}
            image={rightTalent?.profile_image}
            video={rightTalent?.video_url}
            color="red" // Ici "red" sert d'ID visuel pour le point, mais on gère le jaune via le slider
            isActive={isActive}
            intensity={Math.max(0, sliderValue - 50)} // Brille si slider à droite
          />
        </div>

      </div>

      {/* OVERLAY DE SUCCÈS (Flash blanc lors de la validation) */}
      <AnimatePresence>
        {hasVoted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
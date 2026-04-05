"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trophy, ShieldAlert, Clock, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { TreasuresService } from "@/lib/treasures-service";

// Game Components
import AwaleHeader from "./AwaleHeader";
import RoyalJar from "./RoyalJar";
import AnswerGrid from "./AnswerGrid";
import TreasureCard from "./TreasureCard";

interface MysteryCardProps {
  mystere: any;
  progress: any;
  onCorrect: () => void;
  onWrong: () => void;
  onUnlock: (word: string) => void;
}

export default function MysteryCard({
  mystere,
  progress,
  onCorrect,
  onWrong,
  onUnlock
}: MysteryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isLocked = TreasuresService.checkCooldown(progress);
  const lives = TreasuresService.getRemainingLives(progress);
  const currentStep = progress?.current_step || 0;
  const lockTimeLeft = progress ? TreasuresService.getTimeRemaining(progress.locked_until) : "";

  // The Teasing View (Card)
  if (!isExpanded) {
    return (
      <motion.div
        layoutId={`card-${mystere.id}`}
        onClick={() => setIsExpanded(true)}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="w-full h-full bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden flex flex-col border border-white relative cursor-pointer"
      >
        {/* Teasing Image */}
        <div className="relative h-[65%] w-full">
           <motion.div 
             layoutId={`image-${mystere.id}`}
             className="w-full h-full"
           >
             <Image 
               src="/images/treasures/image_0.png" 
               alt={mystere.title} 
               fill 
               className="object-cover"
             />
           </motion.div>
           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        {/* Teasing Content */}
        <div className="p-8 flex-1 flex flex-col items-center text-center space-y-4">
           <div className="space-y-1">
             <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">
               {mystere.theme?.name || "Mystère Ancestral"}
             </span>
             <h3 className="text-3xl font-display font-black text-gray-900 leading-tight">
               {mystere.title}
             </h3>
           </div>
           
           <p className="text-sm text-gray-400 font-serif italic leading-relaxed max-w-[250px]">
             "{mystere.questions?.[0]?.question || "L'âme de la nation réside dans la mémoire des ancêtres..."}"
           </p>

           <div className="pt-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Cliquer pour explorer</span>
           </div>
        </div>
      </motion.div>
    );
  }

  // The Expanded View (Full Page)
  return (
    <AnimatePresence>
      <motion.div
        layoutId={`card-${mystere.id}`}
        className="fixed inset-0 z-50 bg-[#F9F9F7] flex flex-col overflow-y-auto overflow-x-hidden custom-scrollbar"
      >
        {/* Fixed Header: Awalé */}
        <div className="sticky top-0 z-50 bg-[#F4F4F2]/80 backdrop-blur-md">
           <AwaleHeader lives={lives} />
           <button 
             onClick={(e) => {
               e.stopPropagation();
               setIsExpanded(false);
             }}
             className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/50 backdrop-blur flex items-center justify-center hover:bg-white transition-all shadow-lg active:scale-95"
           >
             <X className="w-6 h-6 text-gray-900" />
           </button>
        </div>

        <div className="flex-1 w-full max-w-4xl mx-auto px-6 py-10 space-y-12">
           {/* Detailed Hero Section */}
           <div className="relative h-[40vh] w-full rounded-[3rem] overflow-hidden shadow-2xl">
              <motion.div 
                layoutId={`image-${mystere.id}`}
                className="w-full h-full"
              >
                <Image 
                  src="/images/treasures/image_14.png" 
                  alt={mystere.title} 
                  fill 
                  className="object-contain"
                />
              </motion.div>
           </div>

           {/* Game Arena Logic (Victory / Failure / Action) */}
           <div className="space-y-10">
              {currentStep >= 4 ? (
                <VictoryView treasureData={mystere.treasure_info} />
              ) : lives === 0 || isLocked ? (
                <FailureView 
                  lockTimeLeft={lockTimeLeft} 
                  onUnlock={onUnlock} 
                />
              ) : (
                <div className="space-y-16 pb-20">
                   <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900">
                        {mystere.questions?.[currentStep]?.question}
                      </h2>
                      <p className="text-amber-700/50 font-serif italic italic">
                        "Que votre sagesse guide votre main vers le canari"
                      </p>
                   </div>

                   <div className="flex flex-col items-center">
                     <RoyalJar currentStep={currentStep} className="w-80 h-80" />
                   </div>

                   <div className="max-w-2xl mx-auto w-full">
                      <AnswerGrid 
                        options={[
                          mystere.questions?.[currentStep]?.choice_a,
                          mystere.questions?.[currentStep]?.choice_b,
                          mystere.questions?.[currentStep]?.choice_c,
                          mystere.questions?.[currentStep]?.choice_d
                        ]}
                        currentQuestionIndex={currentStep}
                        onDragEnd={(e, info, index) => {
                          const correct = mystere.questions?.[currentStep]?.correct_answer;
                          const letter = String.fromCharCode(65 + index);
                          if (letter === correct) {
                            onCorrect();
                          } else {
                            onWrong();
                          }
                        }}
                        isAnswered={false}
                        onDragStart={() => {}}
                        onDrag={() => {}}
                      />
                   </div>
                </div>
              )}
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Sub-views for cleaner code
function VictoryView({ treasureData }: { treasureData: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center space-y-8 py-10"
    >
      <div className="relative">
        <Image src="/images/treasures/image_15.png" alt="Victoire" width={400} height={400} className="object-contain" />
        <motion.div 
           animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
           transition={{ duration: 4, repeat: Infinity }}
           className="absolute inset-0 bg-amber-400 blur-[100px] pointer-events-none -z-10"
        />
      </div>
      <div className="text-center space-y-4">
         <h2 className="text-5xl font-display font-black text-amber-900 uppercase">Unité Céleste</h2>
         <p className="text-amber-800/60 max-w-sm mx-auto italic font-serif">Le secret est scellé. La nation est unie.</p>
      </div>
      <TreasureCard data={treasureData} className="w-full mt-10" />
    </motion.div>
  );
}

function FailureView({ lockTimeLeft, onUnlock }: { lockTimeLeft: string, onUnlock: (word: string) => void }) {
  const [word, setWord] = useState("");
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#0D0D12] text-white p-12 rounded-[3.5rem] text-center space-y-10 shadow-2xl relative overflow-hidden"
    >
      <div className="relative z-10 flex flex-col items-center space-y-6">
        <Image src="/images/treasures/image_16.png" alt="Silence" width={300} height={300} className="object-contain opacity-80" />
        <h2 className="text-4xl font-display font-black text-red-600 uppercase tracking-widest">Silence Royal</h2>
        
        <div className="flex items-center gap-4 px-8 py-4 bg-white/5 rounded-full border border-white/5">
          <Clock className="w-6 h-6 text-amber-500" />
          <span className="text-2xl font-mono text-amber-500 font-black">{lockTimeLeft || "48:00:00"}</span>
        </div>

        <div className="w-full max-w-sm space-y-4 pt-4">
          <input 
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            placeholder="Mot de pouvoir..."
            className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/20 text-center font-black text-xl uppercase tracking-widest transition-all"
          />
          <button 
            onClick={() => onUnlock(word)}
            className="w-full py-6 bg-gradient-to-r from-amber-700 to-amber-600 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl"
          >
            <RotateCcw className="w-5 h-5" />
            Briser le Silence
          </button>
        </div>
      </div>
      
      {/* Background ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/10 to-transparent pointer-events-none" />
    </motion.div>
  );
}

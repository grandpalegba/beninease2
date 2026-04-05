"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Clock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Sub-components v2.1
import AwaleHeader from "./AwaleHeader";
import RoyalJar from "./RoyalJar";
import AnswerGrid from "./AnswerGrid";
import TreasureCard from "./TreasureCard";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface MysteryGameProps {
  questions: Question[];
  lives: number;
  isLocked: boolean;
  lockTimeLeft?: string;
  treasureData?: any;
  currentStep?: number;
  onCorrect: (questionId: string) => void;
  onWrong: (questionId: string) => void;
  onUnlock: (word: string) => void;
}

export default function MysteryGame({
  questions,
  lives,
  isLocked,
  lockTimeLeft,
  treasureData,
  currentStep,
  onCorrect,
  onWrong,
  onUnlock
}: MysteryGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(currentStep || 0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showTreasureCard, setShowTreasureCard] = useState((currentStep || 0) >= 4);
  const [powerWord, setPowerWord] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isOverJar, setIsOverJar] = useState(false);
  
  const jarRef = useRef<HTMLDivElement>(null);
  const jarControls = useAnimation();
  
  const currentQuestion = questions[currentQuestionIndex];

  const handleDragEnd = async (event: any, info: any, optionIndex: number) => {
    setIsDragging(false);
    setIsOverJar(false);
    
    if (isAnswered || isLocked || !jarRef.current) return;

    const jarRect = jarRef.current.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;

    // Collision detection on Royal Jar
    const collision = 
      dropX >= jarRect.left && 
      dropX <= jarRect.right && 
      dropY >= jarRect.top && 
      dropY <= jarRect.bottom;

    if (collision) {
      validateAnswer(optionIndex);
    }
  };

  const validateAnswer = async (index: number) => {
    if (index === currentQuestion.correct_answer) {
      setIsAnswered(true);
      // Visual feedback on jar
      await jarControls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.3 }
      });
      
      toast.success("Secret scellé avec sagesse.");
      onCorrect(currentQuestion.id);
      
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setIsAnswered(false);
        } else {
          setTimeout(() => setShowTreasureCard(true), 2000);
        }
      }, 1200);
    } else {
      // Shake animation for error
      await jarControls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
      
      toast.error("La jarre rejette cette vérité.");
      onWrong(currentQuestion.id);
    }
  };

  // Rendering logic for Locked state (Masque)
  if (isLocked || lives === 0) {
    return (
       <div className="h-full flex flex-col items-center justify-center bg-[#0D0D12] text-white p-10 text-center relative overflow-hidden rounded-3xl">
          {/* Mask Visual (Placeholder for a more complex SVG) */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-10 relative"
          >
             <div className="text-[120px] filter drop-shadow-[0_0_40px_rgba(255,0,0,0.3)]">🎭</div>
             <motion.div 
               animate={{ opacity: [0.1, 0.4, 0.1] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute inset-0 bg-red-600 blur-[60px] rounded-full"
             />
          </motion.div>

          <h2 className="text-4xl font-display font-black mb-4 uppercase tracking-[0.2em] text-red-600">Silence Royal</h2>
          <p className="text-gray-400 mb-10 max-w-sm font-medium">
            Le Masque est descendu. Le trésor s'est refermé. Vous n'avez plus de graines d'éveil.
          </p>
          
          <div className="flex items-center gap-3 px-8 py-4 bg-white/5 rounded-full mb-12 border border-white/5">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="font-mono text-2xl font-black text-amber-500 tracking-widest">{lockTimeLeft || "48:00:00"}</span>
          </div>

          <div className="w-full max-w-sm space-y-4">
            <input
              type="text"
              value={powerWord}
              onChange={(e) => setPowerWord(e.target.value)}
              placeholder="Invoquez le Mot de Pouvoir..."
              className="w-full px-8 py-5 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-center font-black text-xl text-white placeholder:text-gray-700 transition-all"
            />
            <button
              onClick={() => onUnlock(powerWord)}
              className="w-full py-5 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-[0.3em] text-sm"
            >
              Lever le Secret
            </button>
          </div>
          
          {/* Ancestral particles */}
          {[...Array(10)].map((_, i) => (
             <motion.div
               key={i}
               animate={{
                 y: [Math.random() * 800, -100],
                 opacity: [0, 0.2, 0],
                 scale: [1, 2, 1]
               }}
               transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, delay: Math.random() * 5 }}
               className="absolute w-1 h-1 bg-white rounded-full opacity-0"
               style={{ left: `${Math.random() * 100}%` }}
             />
          ))}
       </div>
    );
  }

  // Rendering logic for completion
  if (showTreasureCard && treasureData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center space-y-8 h-full overflow-y-auto pb-20 custom-scrollbar"
      >
        <div className="relative pt-10">
           <RoyalJar currentStep={4} className="w-32 h-32 md:w-48 md:h-48" />
           <motion.div 
             animate={{ opacity: [0, 0.5, 0], scale: [1, 1.5, 1] }}
             transition={{ duration: 3, repeat: Infinity }}
             className="absolute inset-0 bg-amber-400 blur-3xl pointer-events-none rounded-full"
           />
        </div>
        <TreasureCard data={treasureData} className="w-full max-w-4xl" />
      </motion.div>
    );
  }

  return (
    <div className="h-[90vh] flex flex-col overflow-hidden relative touch-none bg-[#0a0a0f] text-amber-50 shadow-inner rounded-3xl border border-white/5">
      {/* 1. Header Fixe: Awalé (20%) */}
      <AwaleHeader lives={lives} className="z-30 h-[20%]" />

      {/* 2. Zone Centrale: Royal Jar (50%) */}
      <div className="h-[50%] flex flex-col items-center justify-center relative z-10" id="royal-jar-container">
        
        {/* Riddle Poem (Small context) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-4 px-10 text-center max-w-xs pointer-events-none"
        >
           <p className="text-[10px] font-serif italic text-amber-200/40 leading-relaxed line-clamp-3">
             "Dans l'ocre du canari, le temps se fige et le secret murmure. 
             Quatre souffles pour sceller le destin, quatre vérités pour la lumière."
           </p>
        </motion.div>

        <div className="relative group pt-10" ref={jarRef}>
          <motion.div
            animate={jarControls}
            className="relative"
          >
            <RoyalJar 
              currentStep={currentQuestionIndex} 
              isDragging={isDragging}
              className="w-72 h-72 md:w-96 md:h-96"
            />
          </motion.div>

          {/* Glow during drag */}
          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-80 h-80 border border-amber-500/10 rounded-full animate-ping" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Current Question Text overlay */}
        <div className="absolute bottom-4 px-6 text-center w-full bg-gradient-to-t from-[#0a0a0f] to-transparent pt-10 pb-2">
           <AnimatePresence mode="wait">
             <motion.h3 
               key={currentQuestionIndex}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="text-xl md:text-2xl font-display font-black text-amber-50 leading-tight drop-shadow-lg"
             >
               {currentQuestion?.question}
             </motion.h3>
           </AnimatePresence>
        </div>
      </div>

      {/* 3. Bottom Zone: Answer Ribbon Grid (30%) */}
      <div className="h-[30%] px-6 pb-6 pt-2 z-20">
        <AnswerGrid 
          options={currentQuestion?.options || []}
          currentQuestionIndex={currentQuestionIndex}
          isAnswered={isAnswered}
          onDragStart={() => setIsDragging(true)}
          onDrag={(e, info) => {
             if (!jarRef.current) return;
             const rect = jarRef.current.getBoundingClientRect();
             const over = info.point.x > rect.left && info.point.x < rect.right && info.point.y > rect.top && info.point.y < rect.bottom;
             setIsOverJar(over);
          }}
          onDragEnd={handleDragEnd}
        />
      </div>

      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
         <div className="absolute top-1/4 left-1/4 w-[50vw] h-[50vw] bg-amber-900/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] bg-amber-600/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}

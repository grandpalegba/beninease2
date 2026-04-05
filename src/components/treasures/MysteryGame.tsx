"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Clock, ShieldAlert, Trophy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Image from "next/image";

// Sub-components v3.1
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

type GameState = "ARENA" | "VICTORY" | "FAILURE";

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
  const [gameState, setGameState] = useState<GameState>("ARENA");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(currentStep || 0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [powerWord, setPowerWord] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isOverJar, setIsOverJar] = useState(false);
  
  const jarRef = useRef<HTMLDivElement>(null);
  const jarControls = useAnimation();
  
  const currentQuestion = questions[currentQuestionIndex];

  // Update GameState based on props
  useEffect(() => {
    if (isLocked || lives === 0) {
      setGameState("FAILURE");
    } else if ((currentStep || 0) >= 4) {
      setGameState("VICTORY");
    } else {
      setGameState("ARENA");
    }
  }, [isLocked, lives, currentStep]);

  const handleDragEnd = async (event: any, info: any, optionIndex: number) => {
    setIsDragging(false);
    setIsOverJar(false);
    
    if (isAnswered || gameState !== "ARENA" || !jarRef.current) return;

    const jarRect = jarRef.current.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;

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
      await jarControls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.3 }
      });
      
      toast.success("Secret scellé avec sagesse.");
      onCorrect(currentQuestion.id);
      
      // Delay to allow plugged hole animation to finish before potentially moving to next question
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setIsAnswered(false);
        }
        // If it was the last question, useEffect will handle transition to VICTORY
      }, 1200);
    } else {
      await jarControls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
      
      toast.error("La jarre rejette cette vérité.");
      onWrong(currentQuestion.id);
    }
  };

  // 1. VICTORY STATE: La Main du Roi (image_15.png)
  if (gameState === "VICTORY") {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[100vh] w-full flex flex-col items-center justify-center bg-[#F9F9F7] relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/treasures/image_15.png" 
            alt="La Main du Roi" 
            fill 
            className="object-contain opacity-90 scale-90"
          />
        </div>

        <div className="z-10 flex flex-col items-center text-center space-y-6 pt-64">
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ type: "spring", delay: 0.5 }}
             className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl"
           >
             <Trophy className="w-10 h-10 text-white" />
           </motion.div>
           
           <div className="space-y-2">
             <h2 className="text-4xl md:text-6xl font-display font-black text-[#3D2614] uppercase tracking-widest">
               Unité Céleste
             </h2>
             <p className="text-lg text-amber-900/60 font-serif italic max-w-md px-6">
               "Comme l'eau scellée dans la jarre, le peuple uni ne craint nulle fuite."
             </p>
           </div>

           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 1 }}
             className="bg-white/40 backdrop-blur-md p-6 rounded-3xl border border-amber-200 shadow-xl"
           >
              <div className="flex items-center gap-4">
                 <div className="text-left leading-none">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Gain Total</p>
                    <p className="text-3xl font-black text-amber-900">+50 Points</p>
                 </div>
                 <div className="w-px h-10 bg-amber-200" />
                 <div className="text-left leading-none">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Bonus</p>
                    <p className="text-3xl font-black text-amber-900">Puissance +5</p>
                 </div>
              </div>
           </motion.div>

           <TreasureCard data={treasureData} className="w-full max-w-4xl mt-10 scale-95" />
        </div>

        {/* Ambient rays */}
        <div className="absolute top-0 inset-0 bg-gradient-radial from-amber-200/20 to-transparent pointer-events-none" />
      </motion.div>
    );
  }

  // 2. FAILURE STATE: Le Masque du Silence (image_16.png)
  if (gameState === "FAILURE") {
    return (
       <div className="h-[100vh] w-full flex flex-col items-center justify-center bg-[#0D0D12] text-white p-10 text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-20 h-[50%] z-0">
             <Image 
               src="/images/treasures/image_16.png" 
               alt="Masque du Silence" 
               fill 
               className="object-contain opacity-60"
             />
          </div>

          <div className="z-10 mt-64 space-y-8 flex flex-col items-center">
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-black uppercase tracking-[0.2em] text-red-600">Silence Royal</h2>
              <p className="text-gray-400 max-w-sm font-medium italic">
                "Le Masque est descendu. Le trésor s'est refermé. Seul le mot de pouvoir brisera le silence ancestral."
              </p>
            </div>
            
            <div className="flex items-center gap-4 px-10 py-5 bg-white/5 rounded-full border border-white/5 shadow-inner">
              <Clock className="w-6 h-6 text-amber-500 animate-pulse" />
              <div className="text-left">
                 <p className="text-[8px] font-black text-amber-500/50 uppercase tracking-widest">Temps sous silence</p>
                 <p className="font-mono text-3xl font-black text-amber-500 tracking-widest">{lockTimeLeft || "48:00:00"}</p>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  value={powerWord}
                  onChange={(e) => setPowerWord(e.target.value)}
                  placeholder="Écrivez le Mot de Pouvoir..."
                  className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 outline-none text-center font-black text-2xl text-white placeholder:text-gray-700 transition-all uppercase"
                />
                <ShieldAlert className="absolute top-1/2 right-6 -translate-y-1/2 w-6 h-6 text-gray-700 group-focus-within:text-amber-500/30 transition-colors" />
              </div>
              
              <button
                onClick={() => onUnlock(powerWord)}
                className="w-full py-6 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-95 uppercase tracking-[0.3em] text-sm flex items-center justify-center gap-3"
              >
                <RotateCcw className="w-5 h-5" />
                Lever le Secret
              </button>
            </div>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0D12]/20 to-[#0D0D12] pointer-events-none" />
       </div>
    );
  }

  // 3. NOMINAL STATE: L'Arène (ARENA)
  return (
    <div className="h-[100vh] w-full flex flex-col overflow-hidden relative touch-none bg-[#F9F9F7] text-[#3D2614]">
      {/* Top Fixe: Awalé Header (20%) */}
      <AwaleHeader lives={lives} className="z-30 h-[20%] border-b border-amber-900/5 bg-[#F9F9F7]" />

      {/* Zone Centrale: Royal Jar (50%) */}
      <div className="h-[50%] flex flex-col items-center justify-center relative z-10 p-4" id="royal-jar-container">
        <div className="relative group" ref={jarRef}>
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
          
          <div className="absolute -bottom-4 inset-x-0 text-center space-y-2 pointer-events-none">
             <h3 className="text-xl md:text-3xl font-display font-black text-[#2A1B0E] leading-tight">
               {currentQuestion?.question}
             </h3>
             <p className="text-[10px] text-amber-900/40 uppercase tracking-[0.1em] font-bold">
               Glissez la vérité dans le canari
             </p>
          </div>
        </div>
      </div>

      {/* Bottom Zone: Answer 2x2 Grid (30%) */}
      <div className="h-[30%] px-6 pb-12 pt-4 z-20 bg-gradient-to-t from-white to-transparent">
        <AnswerGrid 
          options={currentQuestion?.options || []}
          currentQuestionIndex={currentQuestionIndex}
          isAnswered={isAnswered}
          onDragStart={() => {
            setIsDragging(true);
            window.navigator.vibrate?.(10);
          }}
          onDrag={(e, info) => {
             if (!jarRef.current) return;
             const rect = jarRef.current.getBoundingClientRect();
             const over = info.point.x > rect.left && info.point.x < rect.right && info.point.y > rect.top && info.point.y < rect.bottom;
             setIsOverJar(over);
          }}
          onDragEnd={handleDragEnd}
        />
      </div>

      {/* Background Style v3.1 */}
      <div className="absolute inset-0 -z-10 bg-[url('/images/textures/paper-light.jpg')] opacity-30 pointer-events-none" />
    </div>
  );
}

"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Heart, Clock, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import SacredJar from "./SacredJar";
import TreasureCard from "./TreasureCard";
import { toast } from "sonner";

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
      // SUCCESS logic
      setIsAnswered(true);
      await jarControls.start({
        scale: [1, 1.1, 1],
        filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"],
        transition: { duration: 0.5 }
      });
      
      toast.success("Correct ! Un secret de plus scellé.");
      onCorrect(currentQuestion.id);
      
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setIsAnswered(false);
        } else {
          // Final completion
          setTimeout(() => setShowTreasureCard(true), 2000);
        }
      }, 1200);
    } else {
      // FAILURE logic
      await jarControls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
      
      toast.error("Faux ! La jarre tremble...");
      onWrong(currentQuestion.id);
    }
  };

  // Rendering logic for Locked state
  if (isLocked) {
    return (
       <div className="h-full flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-md rounded-3xl p-10 text-white border border-white/10 shadow-2xl">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6"
          >
            <ShieldAlert className="w-12 h-12 text-red-500" />
          </motion.div>
          <h2 className="text-3xl font-display font-bold mb-2 text-center">Accès Interdit</h2>
          <p className="text-gray-400 mb-8 text-center max-w-sm">Le trésor est protégé par un silence mystique. Reposez-vous.</p>
          
          <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full mb-10 border border-white/10">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="font-mono text-xl">{lockTimeLeft || "48:00:00"}</span>
          </div>

          <div className="w-full max-w-xs space-y-4">
            <input
              type="text"
              value={powerWord}
              onChange={(e) => setPowerWord(e.target.value)}
              placeholder="Mot de pouvoir..."
              className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-center font-bold text-white placeholder:text-gray-600 transition-all"
            />
            <button
              onClick={() => onUnlock(powerWord)}
              className="w-full py-4 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl shadow-xl transition-all active:scale-95 uppercase tracking-widest"
            >
              Délivrer
            </button>
          </div>
       </div>
    );
  }

  // Rendering logic for completion
  if (showTreasureCard && treasureData) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center space-y-8"
      >
        <SacredJar pluggedHoles={4} className="w-48 h-48 drop-shadow-[0_0_30px_rgba(217,119,6,0.3)]" />
        <TreasureCard data={treasureData} className="w-full max-w-3xl" />
      </motion.div>
    );
  }

  return (
    <div className="h-[80vh] flex flex-col overflow-hidden relative touch-none">
      {/* Top Zone: Awalé Header (20%) */}
      <div className="h-[20%] flex flex-col items-center justify-center space-y-3">
        <div className="flex gap-3">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={{
                scale: i < (lives || 0) ? 1 : 0.8,
                opacity: i < (lives || 0) ? 1 : 0.2,
                y: i < (lives || 0) ? 0 : 5
              }}
              className="relative"
            >
              <Heart className={cn("w-7 h-7", i < (lives || 0) ? "fill-red-500 text-red-500" : "text-gray-700")} />
              {i < (lives || 0) && (
                <motion.div
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.5, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className="absolute inset-0 bg-red-400 blur-xl rounded-full"
                />
              )}
            </motion.div>
          ))}
        </div>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
             Graines d'éveil : {(lives || 0)} / 6
           </p>
        </div>
      </div>

      {/* Center Zone: Sacred Jar (50%) */}
      <div className="h-[50%] flex flex-col items-center justify-center relative z-10" id="royal-jar-container">
        <div className="relative">
          <motion.div
            ref={jarRef}
            animate={jarControls}
            style={{
              filter: isOverJar ? "brightness(1.2) drop-shadow(0 0 40px rgba(217,119,6,0.4))" : "none"
            }}
            className="relative cursor-default"
          >
            <SacredJar 
              id="royal-jar"
              pluggedHoles={currentStep ?? currentQuestionIndex} 
              className="w-64 h-64 md:w-80 md:h-80 transition-all duration-300" 
            />
          </motion.div>

          <AnimatePresence>
            {isDragging && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-72 h-72 border-4 border-dashed border-amber-500/20 rounded-full animate-spin-slow" />
                <Sparkles className="absolute w-8 h-8 text-amber-500/30 animate-pulse" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Zone: Draggable Items (30%) */}
      <div className="h-[30%] px-6 pb-10 flex flex-col justify-end">
        <div className="text-center mb-6">
           <AnimatePresence mode="wait">
             <motion.h3 
               key={currentQuestionIndex}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="text-2xl font-display font-bold text-gray-900 leading-tight"
             >
               {currentQuestion?.question}
             </motion.h3>
           </AnimatePresence>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {currentQuestion?.options.map((option, index) => (
            <motion.div
              key={`${currentQuestionIndex}-${index}`}
              drag
              dragSnapToOrigin
              dragListener={!isAnswered}
              onDragStart={() => setIsDragging(true)}
              onDrag={(e, info) => {
                if (!jarRef.current) return;
                const rect = jarRef.current.getBoundingClientRect();
                const over = info.point.x > rect.left && info.point.x < rect.right && info.point.y > rect.top && info.point.y < rect.bottom;
                setIsOverJar(over);
              }}
              onDragEnd={(e, info) => handleDragEnd(e, info, index)}
              whileHover={{ scale: 1.02 }}
              whileDrag={{ 
                scale: 1.1, 
                zIndex: 100,
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
              }}
              className="cursor-grab active:cursor-grabbing"
            >
              <div className={cn(
                "p-4 bg-white border-2 border-gray-100 rounded-2xl shadow-sm transition-colors flex items-center gap-3",
                isOverJar && "border-amber-400"
              )}>
                <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-bold text-gray-800 text-sm line-clamp-2 leading-tight">
                  {option}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

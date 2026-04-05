"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, CheckCircle2, XCircle, Clock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

interface QcmComponentProps {
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

import SacredJar from "./SacredJar";
import TreasureCard from "./TreasureCard";
import { toast } from "sonner";

export default function QcmComponent({
  questions,
  lives,
  isLocked,
  lockTimeLeft,
  treasureData,
  currentStep,
  onCorrect,
  onWrong,
  onUnlock
}: QcmComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(currentStep || 0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showTreasureCard, setShowTreasureCard] = useState((currentStep || 0) >= 4);
  const [powerWord, setPowerWord] = useState("");
  const [draggedOver, setDraggedOver] = useState(false);
  const jarRef = React.useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentQuestionIndex];

  const handleDragEnd = (event: any, info: any, optionIndex: number) => {
    if (isAnswered || isLocked || !jarRef.current) return;

    const jarRect = jarRef.current.getBoundingClientRect();
    const dropX = info.point.x;
    const dropY = info.point.y;

    // Check if drop point is inside the jar boundaries
    const isInside = 
      dropX >= jarRect.left && 
      dropX <= jarRect.right && 
      dropY >= jarRect.top && 
      dropY <= jarRect.bottom;

    if (isInside) {
      setIsAnswered(true);
      if (optionIndex === currentQuestion.correct_answer) {
        toast.success("Correct ! +10 points dans la jarre.");
        onCorrect(currentQuestion.id);
        setTimeout(() => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsAnswered(false);
          } else {
            // Last question correct -> Trigger Apex and wait
            setTimeout(() => {
              setShowTreasureCard(true);
            }, 2000);
          }
        }, 1000);
      } else {
        toast.error("Mauvaise réponse. Une vie perdue.");
        onWrong(currentQuestion.id);
        setIsAnswered(false);
      }
    }
    setDraggedOver(false);
  };

  // Total holes plugged is currentStep (from DB) or internal index if preferred
  const pluggedHoles = currentStep ?? currentQuestionIndex;
  const isComplete = pluggedHoles >= 4;

  if (isComplete && treasureData && showTreasureCard) {
    return (
      <div className="flex flex-col items-center space-y-8 py-4">
        <SacredJar pluggedHoles={4} className="w-48 h-48" />
        <TreasureCard data={treasureData} className="w-full max-w-2xl" />
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl border border-red-100 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <div>
          <h3 className="text-2xl font-display font-bold text-gray-900">Accès Verrouillé</h3>
          <p className="text-gray-500 mt-2">Vous avez épuisé vos vies.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
          <Clock className="w-4 h-4" />
          {lockTimeLeft || "48h 00min"}
        </div>
        
        <div className="w-full max-w-xs space-y-3">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Libérer le trésor (+5 pts)</p>
          <input
            type="text"
            value={powerWord}
            onChange={(e) => setPowerWord(e.target.value)}
            placeholder="Mot de pouvoir..."
            className="w-full px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#008751] focus:border-transparent transition-all text-center font-bold"
          />
          <button
            onClick={() => onUnlock(powerWord)}
            className="w-full py-4 bg-[#008751] text-white font-extrabold rounded-xl shadow-lg hover:bg-[#006B3F] transition-all active:scale-95"
          >
            LIBÉRER
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="w-full grid md:grid-cols-2 gap-12 items-center">
      {/* Target: The Jar */}
      <div className="flex flex-col items-center space-y-6">
        <div ref={jarRef} className="relative group">
          <motion.div
            animate={{
              scale: draggedOver ? 1.05 : 1,
              filter: draggedOver ? "brightness(1.1)" : "brightness(1)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <SacredJar pluggedHoles={pluggedHoles} isLocked={isLocked} className="w-64 h-64 md:w-80 md:h-80" />
          </motion.div>
          
          <AnimatePresence>
            {draggedOver && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="w-32 h-32 border-4 border-dashed border-white/50 rounded-full animate-spin-slow" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex gap-2">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i < lives ? 1 : 0.8,
                opacity: i < lives ? 1 : 0.2
              }}
            >
              <Heart className={cn("w-6 h-6", i < lives ? "fill-red-500 text-red-500" : "text-gray-300")} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Draggable Answers */}
      <div className="space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em] bg-amber-50 px-3 py-1 rounded-full">
            Énigme {currentQuestionIndex + 1}/{questions.length}
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold leading-tight text-gray-900">
            {currentQuestion.question}
          </h2>
          <p className="text-sm text-gray-400 font-medium italic">
            Glissez la bonne réponse dans la jarre pour sceller le secret.
          </p>
        </div>

        <div className="grid gap-4">
          {currentQuestion.options.map((option, index) => (
            <motion.div
              key={index}
              drag
              dragSnapToOrigin
              onDragStart={() => setDraggedOver(true)}
              onDragEnd={(e, info) => handleDragEnd(e, info, index)}
              whileDrag={{ scale: 1.05, zIndex: 50 }}
              className="cursor-grab active:cursor-grabbing"
            >
              <div className="p-6 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-amber-400 hover:shadow-md transition-shadow flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="font-bold text-gray-800">{option}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

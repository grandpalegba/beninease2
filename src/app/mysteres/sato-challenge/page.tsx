"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameLogic } from '@/components/mysteres/gameLogic';

export default function SatoChallengePage() {
  const gameLogicRef = useRef<GameLogic | null>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'completed'>('menu');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    // Initialiser le jeu
    gameLogicRef.current = new GameLogic();
    
    return () => {
      gameLogicRef.current?.stopTimer();
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
    gameLogicRef.current?.reset();
    gameLogicRef.current?.startTimer();
  };

  const handleAnswer = (answer: string) => {
    if (!gameLogicRef.current) return;
    
    const isCorrect = gameLogicRef.current.checkAnswer(answer);
    
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
  };

  return (
    <main className="w-full max-w-screen-lg px-6 flex flex-col items-center justify-center min-h-screen bg-background text-on-surface">
      {/* Immersive Visual Section */}
      <div className="relative w-full flex justify-center items-center mb-16 h-80">
        {/* Background Bloom */}
        <div className="absolute w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] -z-10"></div>
        
        {/* Left: Okpele Divination Chain */}
        <div className="absolute right-[calc(50%+200px)] flex gap-8 pointer-events-none scale-90">
          <div className="relative flex gap-8">
            {/* Refined Detailed Chain Connector */}
            <div className="okpele-connector"></div>
            <div className="relative flex flex-col items-center">
              <div className="husk-shape husk-active"></div>
              <div className="silver-link"></div>
              <div className="husk-shape husk-active"></div>
              <div className="silver-link"></div>
              <div className="husk-shape husk-active"></div>
              <div className="silver-link"></div>
              <div className="husk-shape husk-active"></div>
            </div>
            <div className="relative flex flex-col items-center">
              <div className="husk-shape husk-inactive"></div>
              <div className="silver-link"></div>
              <div className="husk-shape husk-inactive"></div>
              <div className="silver-link"></div>
              <div className="husk-shape husk-inactive"></div>
            </div>
          </div>
        </div>

        {/* Center: The Sato Jar */}
        <div className="relative w-64 h-80 z-10 transition-transform duration-700 hover:scale-105">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-10 bg-[#3d1810] rounded-[50%] shadow-inner border-4 border-primary/20 z-0"></div>
          <div className="absolute inset-0 clay-texture organic-shape flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute top-0 w-full h-12 bg-gradient-to-b from-black/20 to-transparent"></div>
            <div className="relative w-full h-full">
              <div className="absolute top-[40%] left-[25%] w-12 h-12 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
              <div className="absolute top-[32%] left-[58%] w-10 h-10 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
              <div className="absolute top-[62%] left-[40%] w-14 h-14 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
              <div className="absolute top-[55%] left-[72%] w-9 h-9 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
            </div>
          </div>
        </div>

        {/* Right: Vertical Awalé Board */}
        <div className="absolute left-[calc(50%+200px)] pointer-events-none">
          <div className="awale-board p-3 flex gap-3 flex-row items-center">
            {/* Left row (4 holes) */}
            <div className="gap-4 flex-col flex">
              <div className="awale-hole"><div className="sacred-seed"></div></div>
              <div className="awale-hole"><div className="sacred-seed"></div></div>
              <div className="awale-hole"><div className="sacred-seed"></div></div>
              <div className="awale-hole"><div className="sacred-seed"></div></div>
            </div>
            
            {/* Vertical Separator */}
            <div className="w-px h-36 bg-white/10 mx-1"></div>
            
            {/* Right row (4 holes) */}
            <div className="gap-4 flex-col flex">
              <div className="awale-hole"><div className="sacred-seed"></div></div>
              <div className="awale-hole"><div className="sacred-seed"></div></div>
              <div className="awale-hole"><div className="sacred-seed"></div></div>
              <div className="awale-hole"><div className="sacred-seed"></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Section */}
      <div className="text-center mb-12 max-w-2xl">
        <h2 className="text-xl md:text-2xl font-question font-bold text-on-surface leading-[2]">
          Quelle est la fonction principale du tambour Sato lors des rites agraires ?
        </h2>
      </div>

      {/* Answer Buttons Grid */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {['A', 'B', 'C', 'D'].map((answer) => (
          <motion.button
            key={answer}
            data-answer={answer}
            onClick={() => handleAnswer(answer)}
            className="bg-primary text-on-primary py-4 px-6 rounded-lg font-semibold hover:bg-primary/90 active:scale-95 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {answer}
          </motion.button>
        ))}
      </div>

      {/* Explanation Card */}
      <div className="w-full max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-3xl p-8 md:p-10 shadow-sm text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="font-bold block mb-2 text-primary">Bonne réponse !</span>
            <p className="font-question text-lg md:text-xl text-on-surface leading-[2.2]">
              Le Sato est un tambour sacré dont les vibrations sont censées purifier les récoltes et appeler la protection des ancêtres avant la saison des pluies. Il ne peut être fabriqué que par des initiés.
            </p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      {gameState === 'menu' && (
        <motion.button
          onClick={startGame}
          className="bg-primary text-on-primary py-4 px-8 rounded-full font-bold text-lg hover:bg-primary/90 active:scale-95 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Commencer le Défi
        </motion.button>
      )}

      {/* Game Over Screen */}
      <AnimatePresence>
        {gameState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-error/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-surface-container rounded-2xl p-8 max-w-md mx-4 text-center">
              <h3 className="text-2xl font-bold text-error mb-4">Source Épuisée</h3>
              <p className="text-on-surface mb-6">Les forces vitales ont été épuisées. Retournez au menu pour réessayer.</p>
              <motion.button
                onClick={() => setGameState('menu')}
                className="bg-primary text-on-primary py-3 px-6 rounded-lg font-semibold hover:bg-primary/90"
              >
                Retour au Menu
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Screen */}
      <AnimatePresence>
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-primary/90 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-surface-container rounded-2xl p-8 max-w-md mx-4 text-center">
              <h3 className="text-2xl font-bold text-primary mb-4">Défi Accompli !</h3>
              <p className="text-on-surface mb-6">Vous avez maîtrisé tous les savoirs de ce défi.</p>
              <motion.button
                onClick={() => setGameState('menu')}
                className="bg-primary text-on-primary py-3 px-6 rounded-lg font-semibold hover:bg-primary/90"
              >
                Nouveau Défi
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

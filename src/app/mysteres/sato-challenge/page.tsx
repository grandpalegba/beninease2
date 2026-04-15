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
    <html className="light" lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Le Sato Challenge</title>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script id="tailwind-config">
          tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  error: "#ac3149",
                  primary: "#a0412d",
                  surface: "#ffffff",
                  secondary: "#006b60",
                  tertiary: "#38666f",
                  background: "#ffffff",
                  outline: "#797b7a"
                },
                borderRadius: {
                  DEFAULT: "0.25rem",
                  lg: "0.5rem",
                  xl: "0.75rem",
                  full: "9999px"
                },
                fontFamily: {
                  headline: ["Plus Jakarta Sans"],
                  body: ["Inter"],
                  label: ["Inter"],
                  question: ["Lato"]
                }
              },
            },
          }
        </script>
        <style>
          {`
            .material-symbols-outlined {
              font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            }
            body { font-family: 'Inter', sans-serif; }
            h1, h2, h3 { font-family: 'Plus Jakarta Sans', sans-serif; }
            .clay-texture {
              background: linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%);
              box-shadow: 
                inset -8px -8px 20px rgba(0,0,0,0.2),
                inset 8px 8px 20px rgba(255,255,255,0.1),
                0 20px 40px rgba(0,0,0,0.15);
            }
            .organic-shape {
              border-radius: 42% 38% 34% 36% / 45% 45% 32% 32%;
            }
            .husk-active {
              background: radial-gradient(circle at 30% 30%, #a67c52 0%, #734a26 60%, #4d3118 100%);
              box-shadow: 
                inset 2px 2px 5px rgba(255,255,255,0.2),
                inset -2px -2px 8px rgba(0,0,0,0.4),
                0 4px 10px rgba(0,0,0,0.3);
              border: 1px solid rgba(0,0,0,0.2);
            }
            .husk-inactive {
              background: radial-gradient(circle at 30% 30%, #5d5d5d 0%, #3a3a3a 70%, #1a1a1a 100%);
              box-shadow: 
                inset 2px 2px 4px rgba(255,255,255,0.1),
                0 2px 5px rgba(0,0,0,0.4);
              opacity: 0.65;
            }
            .husk-shape {
              width: 24px;
              height: 34px;
              border-radius: 50% 50% 50% / 70% 70% 30% 30%;
              position: relative;
              transform: rotate(-5deg);
            }
            .husk-shape::before {
              content: '';
              position: absolute;
              top: 15%;
              left: 50%;
              transform: translateX(-50%);
              width: 2px;
              height: 70%;
              background: rgba(0,0,0,0.4);
              box-shadow: 0 0 2px rgba(255,255,255,0.1);
              border-radius: 1px;
            }
            .silver-link {
              width: 2px;
              height: 10px;
              background: linear-gradient(90deg, #d1d5db 0%, #9ca3af 50%, #d1d5db 100%);
              margin: 0 auto;
            }
            .okpele-connector {
              width: 56px;
              height: 24px;
              border: 2px solid #9ca3af;
              border-bottom: 0;
              border-radius: 40px 40px 0 0;
              position: absolute;
              top: -26px;
              left: 50%;
              transform: translateX(-50%);
              box-shadow: 0 -1px 4px rgba(255,255,255,0.3);
            }
            .awale-board {
              background: linear-gradient(135deg, #5d3a1a 0%, #3d2410 100%);
              border-radius: 12px;
              box-shadow: 
                0 10px 25px rgba(0,0,0,0.3),
                inset 0 1px 2px rgba(255,255,255,0.1);
              border: 1px solid #2a180b;
            }
            .awale-hole {
              background: radial-gradient(circle at 50% 20%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%);
              box-shadow: inset 0 4px 8px rgba(0,0,0,0.6);
              border-radius: 50%;
              width: 32px;
              height: 32px;
              display: flex; 
              align-items: center;
              justify-content: center;
            }
            .sacred-seed {
              width: 12px;
              height: 12px;
              background: radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 70%, #8b6508 100%);
              border-radius: 50%;
              box-shadow: 
                0 2px 4px rgba(0,0,0,0.3),
                inset 1px 1px 2px rgba(255,255,255,0.4);
            }
          `}
        </style>
      </head>
      <body className="bg-background text-on-surface min-h-screen flex flex-col items-center justify-center">
        <main className="w-full max-w-screen-lg px-6 flex flex-col items-center">
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
      </body>
    </html>
  );
}

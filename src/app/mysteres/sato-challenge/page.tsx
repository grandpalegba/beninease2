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
    <>
      <main className="w-full max-w-screen-lg px-6 flex flex-col items-center justify-center min-h-screen bg-[#faf9f8] text-[#303333]">
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
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-10 bg-[#3d1810] rounded-[50%] shadow-inner z-0"></div>
          <div className="absolute inset-0 clay-texture organic-shape flex flex-col items-center justify-center overflow-hidden" style={{background: 'linear-gradient(165deg, #a0412d 0%, #8b3422 45%, #7a2a1b 100%)'}}>
            <div className="absolute top-0 w-full h-12 bg-gradient-to-b from-black/20 to-transparent"></div>
            <div className="relative w-full h-full">
              <div className="absolute top-[40%] left-[25%] w-12 h-12 rounded-full bg-[#2a100a] shadow-inner opacity-95"></div>
              <div className="absolute top-[32%] left-[58%] w-10 h-10 rounded-full bg-[#2a100a] shadow-inner opacity-95"></div>
              <div className="absolute top-[62%] left-[40%] w-14 h-14 rounded-full bg-[#2a100a] shadow-inner opacity-95"></div>
              <div className="absolute top-[55%] left-[72%] w-9 h-9 rounded-full bg-[#2a100a] shadow-inner opacity-95"></div>
            </div>
          </div>
        </div>

        {/* Right: Vertical Awalé Board */}
        <div className="absolute left-[calc(50%+200px)] pointer-events-none">
          <div className="p-3 flex gap-3 flex-row items-center" style={{background: 'linear-gradient(135deg, #5d3a1a 0%, #3d2410 100%)', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.1)'}}>
            {/* Left row (4 holes) */}
            <div className="gap-4 flex-col flex">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6)'}}><div className="w-3 h-3 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 70%, #8b6508 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.4)'}}></div></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6)'}}><div className="w-3 h-3 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 70%, #8b6508 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.4)'}}></div></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6)'}}><div className="w-3 h-3 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 70%, #8b6508 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.4)'}}></div></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6)'}}><div className="w-3 h-3 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 70%, #8b6508 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.4)'}}></div></div>
            </div>
            
            {/* Vertical Separator */}
            <div className="w-px h-36 bg-white/10 mx-1"></div>
            
            {/* Right row (4 holes) */}
            <div className="gap-4 flex-col flex">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6)'}}><div className="w-3 h-3 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 70%, #8b6508 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.4)'}}></div></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6)'}}><div className="w-3 h-3 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 70%, #8b6508 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.4)'}}></div></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6)'}}><div className="w-3 h-3 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 70%, #8b6508 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.4)'}}></div></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{background: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 100%)', boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.6)'}}><div className="w-3 h-3 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, #ffd700 0%, #b8860b 70%, #8b6508 100%)', boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.4)'}}></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Section */}
      <div className="text-center mb-20 max-w-2xl px-12">
        <h2 className="text-xl md:text-2xl font-bold" style={{fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: '2.2'}}>
          Quelle est la fonction principale du tambour Sato lors des rites agraires ?
        </h2>
      </div>

      {/* Answer Buttons Grid */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {['A', 'B', 'C', 'D'].map((answer) => (
          <motion.button
            key={answer}
            data-answer={answer}
            onClick={() => handleAnswer(answer)}
            className="bg-[#f4f3f2] py-8 px-10 rounded-xl shadow-sm hover:shadow-lg hover:bg-[#ffac9b] hover:text-white transition-all duration-300 border-0"
            style={{fontFamily: 'Inter, sans-serif', lineHeight: '2.2', color: '#303333'}}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#ffac9b] text-white flex items-center justify-center font-bold text-sm" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>{answer}</span>
              <span className="text-lg">Réponse {answer}</span>
            </span>
          </motion.button>
        ))}
      </div>

      {/* Explanation Card */}
      <div className="w-full max-w-3xl mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="bg-[#faf9f8] rounded-3xl p-8 md:p-10 shadow-sm text-center">
          <div className="flex flex-col items-center gap-4">
            <span className="font-bold block mb-2" style={{color: '#a0412d', fontFamily: 'Plus Jakarta Sans, sans-serif'}}>Bonne réponse !</span>
            <p className="text-lg md:text-xl" style={{fontFamily: 'Lato, sans-serif', lineHeight: '2.2', color: '#303333'}}>
              Le Sato est un tambour sacré dont les vibrations sont censées purifier les récoltes et appeler la protection des ancêtres avant la saison des pluies. Il ne peut être fabriqué que par des initiés.
            </p>
          </div>
        </div>
      </div>

      {/* Start Button */}
      {gameState === 'menu' && (
        <motion.button
          onClick={startGame}
          className="bg-white py-4 px-8 rounded-full font-bold text-lg shadow-sm hover:shadow-md hover:bg-[#a0412d] hover:text-white transition-all duration-300"
          style={{fontFamily: 'Inter, sans-serif', lineHeight: '2.2', color: '#303333'}}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-[#faf9f8] rounded-2xl p-8 max-w-md mx-4 text-center shadow-lg">
              <h3 className="text-2xl font-bold mb-4" style={{color: '#ac3149', fontFamily: 'Plus Jakarta Sans, sans-serif'}}>Source Épuisée</h3>
              <p className="mb-6" style={{fontFamily: 'Inter, sans-serif', lineHeight: '2.2', color: '#303333'}}>Les forces vitales ont été épuisées. Retournez au menu pour réessayer.</p>
              <motion.button
                onClick={() => setGameState('menu')}
                className="bg-white py-3 px-6 rounded-lg font-semibold shadow-sm hover:shadow-md hover:bg-[#a0412d] hover:text-white transition-all duration-300"
                style={{fontFamily: 'Inter, sans-serif', lineHeight: '2.2', color: '#303333'}}
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <div className="bg-[#faf9f8] rounded-2xl p-8 max-w-md mx-4 text-center shadow-lg">
              <h3 className="text-2xl font-bold mb-4" style={{color: '#a0412d', fontFamily: 'Plus Jakarta Sans, sans-serif'}}>Défi Accompli !</h3>
              <p className="mb-6" style={{fontFamily: 'Inter, sans-serif', lineHeight: '2.2', color: '#303333'}}>Vous avez maîtrisé tous les savoirs de ce défi.</p>
              <motion.button
                onClick={() => setGameState('menu')}
                className="bg-white py-3 px-6 rounded-lg font-semibold shadow-sm hover:shadow-md hover:bg-[#a0412d] hover:text-white transition-all duration-300"
                style={{fontFamily: 'Inter, sans-serif', lineHeight: '2.2', color: '#303333'}}
              >
                Nouveau Défi
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </main>
      
      {/* Bottom Navigation - Glass Rule */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#faf9f8]/80 backdrop-blur-xl shadow-lg" style={{boxShadow: '0 4px 20px rgba(160, 65, 45, 0.08)'}}>
        <div className="max-w-screen-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <a href="/referents" className="text-[#303333] hover:text-[#a0412d] transition-colors" style={{fontFamily: 'Inter, sans-serif', fontWeight: '500'}}>Référents</a>
              <a href="/mysteres" className="text-[#303333] hover:text-[#a0412d] transition-colors" style={{fontFamily: 'Inter, sans-serif', fontWeight: '500'}}>Mystères</a>
              <a href="/talents" className="text-[#303333] hover:text-[#a0412d] transition-colors" style={{fontFamily: 'Inter, sans-serif', fontWeight: '500'}}>Talents</a>
              <a href="/tresors" className="text-[#303333] hover:text-[#a0412d] transition-colors" style={{fontFamily: 'Inter, sans-serif', fontWeight: '500'}}>Trésors</a>
            </div>
            <a href="/connexion" className="bg-white py-2 px-6 rounded-full shadow-sm hover:shadow-md hover:bg-[#a0412d] hover:text-white transition-all duration-300" style={{fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#303333'}}>
              Connexion
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SatoChallengePage() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover' | 'completed'>('menu');
  const [filledHoles, setFilledHoles] = useState(4); // Représente les graines d'Awalé
  
  return (
    <div className="min-h-screen bg-[#faf9f8] text-[#303333] flex flex-col items-center">
      
      {/* SECTION JEU : Centrée verticalement */}
      <main className="flex-1 w-full max-w-5xl px-6 flex flex-col items-center justify-center pb-32">
        
        {/* Artefacts Visuels */}
        <div className="relative w-full flex justify-center items-center mb-16 h-80">
          
          {/* OKPELE : 8 Noix (2 colonnes de 4) avec Septum */}
          <div className="absolute left-[calc(50%-300px)] flex gap-6 pointer-events-none">
            {[0, 1].map((col) => (
              <div key={col} className="flex flex-col gap-3">
                {[0, 1, 2, 3].map((row) => (
                  <div key={row} className="relative w-10 h-14 bg-[#a0412d] rounded-full shadow-md flex justify-center overflow-hidden">
                    {/* Le Septum (séparation centrale de la noix) */}
                    <div className="w-[2px] h-full bg-[#540900]/40 shadow-inner"></div>
                    {/* Reflet organique */}
                    <div className="absolute top-2 left-2 w-2 h-4 bg-white/10 rounded-full blur-[1px]"></div>
                  </div>
                ))}
              </div>
            ))}
            {/* Cordon de liaison en haut */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-6 border-t-2 border-x-2 border-gray-400/30 rounded-t-full"></div>
          </div>

          {/* JARRE SATO */}
          <div className="relative w-60 h-72 z-10">
            <div className="absolute inset-0 bg-[#a0412d] rounded-[40%_40%_45%_45%] shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/20 to-transparent"></div>
              {/* Ouvertures de la jarre */}
              <div className="relative w-full h-full">
                <div className="absolute top-[35%] left-[25%] w-10 h-10 rounded-full bg-[#2a100a] shadow-inner"></div>
                <div className="absolute top-[28%] left-[55%] w-8 h-8 rounded-full bg-[#2a100a] shadow-inner"></div>
                <div className="absolute top-[55%] left-[40%] w-12 h-12 rounded-full bg-[#2a100a] shadow-inner"></div>
                <div className="absolute top-[48%] left-[68%] w-7 h-7 rounded-full bg-[#2a100a] shadow-inner"></div>
              </div>
            </div>
          </div>

          {/* AWALÉ (Score/Vies) */}
          <div className="absolute left-[calc(50%+200px)] p-4 bg-[#4a3728] rounded-2xl shadow-xl flex gap-4">
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-black/40 shadow-inner flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700]"></div>
                </div>
              ))}
            </div>
            <div className="w-[1px] h-32 bg-white/10"></div>
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-black/40 shadow-inner"></div>
              ))}
            </div>
          </div>
        </div>

        {/* QUESTION SECTION */}
        <div className="text-center mb-12 max-w-2xl px-6">
          <h2 className="text-2xl font-bold font-headline leading-relaxed">
            Quelle est la fonction principale du tambour Sato lors des rites agraires ?
          </h2>
        </div>

        {/* GRILLE DE RÉPONSES (No-Line Rule) */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Purifier les récoltes', 'Appeler la pluie', 'Célébrer les mariages', 'Guérir les malades'].map((answer, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center p-6 bg-[#f4f3f2] rounded-2xl transition-all hover:bg-[#ffac9b]/20 text-left"
            >
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-[#a0412d] shadow-sm mr-4 group-hover:bg-[#a0412d] group-hover:text-white transition-colors">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-lg font-medium">{answer}</span>
            </motion.button>
          ))}
        </div>
      </main>

      {/* HEADER EN BAS (Comme sur la page Référents) */}
      <footer className="fixed bottom-0 left-0 w-full z-50 p-6">
        <div className="max-w-7xl mx-auto bg-[#faf9f8]/80 backdrop-blur-xl rounded-full px-8 py-4 flex items-center justify-between shadow-[rgba(160,65,45,0.08)_0px_-12px_30px]">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-600 via-yellow-400 to-red-600"></div>
            <span className="font-headline font-black text-xl tracking-tighter">Beninease</span>
          </div>

          {/* Navigation centrale */}
          <nav className="hidden md:flex items-center gap-8 font-headline text-xs font-bold uppercase tracking-[0.2em]">
            <a href="/referents" className="hover:text-[#a0412d] transition-colors">Référents</a>
            <a href="/mysteres" className="text-[#a0412d]">Mystères</a>
            <a href="/talents" className="hover:text-[#a0412d] transition-colors">Talents</a>
            <a href="/tresors" className="hover:text-[#a0412d] transition-colors">Trésors</a>
          </nav>

          {/* Bouton Connexion */}
          <button className="bg-[#006b60] text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform">
            Connexion
          </button>
        </div>
      </footer>

    </div>
  );
}
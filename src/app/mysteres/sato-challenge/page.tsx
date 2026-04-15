"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SatoChallengePage() {
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');

  return (
    <div className="min-h-screen bg-[#faf9f8] text-[#303333] flex flex-col items-center overflow-x-hidden">
      
      <main className="flex-1 w-full max-w-5xl px-6 flex flex-col items-center justify-center pb-32 pt-12">
        
        {/* SECTION VISUELLE : Artefacts culturels */}
        <div className="relative w-full flex justify-center items-center mb-16 h-80">
          
          {/* OKPELE : Noix brunes affinées (inspiré de la réalité) */}
          <div className="absolute left-[calc(50%-320px)] flex gap-4 pointer-events-none scale-90">
            {[0, 1].map((col) => (
              <div key={col} className="flex flex-col gap-2 pt-4">
                {[0, 1, 2, 3].map((row) => (
                  <div key={row} className="relative w-8 h-12 bg-[#5d3a1a] rounded-[45%_45%_50%_50%] shadow-md flex justify-center overflow-hidden border-b-2 border-black/20">
                    {/* Le Septum (Séparation centrale réaliste) */}
                    <div className="w-[1.5px] h-full bg-[#2a1a0d]/60 shadow-inner"></div>
                    {/* Texture/Reflet */}
                    <div className="absolute top-1 left-1 w-1 h-3 bg-white/5 rounded-full blur-[0.5px]"></div>
                  </div>
                ))}
              </div>
            ))}
            {/* Cordon de liaison fin */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-8 border-t-[1.5px] border-x-[1.5px] border-gray-400/40 rounded-t-2xl"></div>
          </div>

          {/* JARRE SATO : Ajout du col et de la texture terre cuite */}
          <div className="relative w-64 h-72 z-10 flex flex-col items-center">
            {/* Haut de la jarre (Col) */}
            <div className="w-24 h-6 bg-[#8b3422] rounded-t-lg border-b border-black/10 shadow-sm mb-[-2px] z-20"></div>
            {/* Corps de la jarre */}
            <div className="w-full h-full bg-[#a0412d] rounded-[42%_42%_48%_48%] shadow-2xl flex items-center justify-center overflow-hidden relative">
              <div className="absolute top-0 w-full h-20 bg-gradient-to-b from-black/25 to-transparent"></div>
              {/* Orifices sacrés */}
              <div className="relative w-full h-full">
                <div className="absolute top-[30%] left-[28%] w-11 h-11 rounded-full bg-[#2a100a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"></div>
                <div className="absolute top-[22%] left-[58%] w-9 h-9 rounded-full bg-[#2a100a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"></div>
                <div className="absolute top-[52%] left-[42%] w-14 h-14 rounded-full bg-[#2a100a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"></div>
                <div className="absolute top-[45%] left-[72%] w-8 h-8 rounded-full bg-[#2a100a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"></div>
              </div>
            </div>
          </div>

          {/* AWALÉ (Indicateur de progression) */}
          <div className="absolute left-[calc(50%+220px)] p-3 bg-[#3d2410] rounded-xl shadow-xl flex gap-3 scale-95">
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-black/50 shadow-inner flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffd700] shadow-[0_0_10px_#ffd700]"></div>
                </div>
              ))}
            </div>
            <div className="w-[1px] h-36 bg-white/5"></div>
            <div className="flex flex-col gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-7 h-7 rounded-full bg-black/50 shadow-inner"></div>
              ))}
            </div>
          </div>
        </div>

        {/* QUESTION : Editorial Typography (Plus Jakarta Sans) */}
        <div className="text-center mb-12 max-w-2xl px-6">
          <h2 className="text-3xl font-extrabold font-headline leading-snug tracking-tight text-on-surface">
            Quelle est la fonction principale du tambour Sato lors des rites agraires ?
          </h2>
        </div>

        {/* RÉPONSES : No-Divider Rule & Surface Hierarchy */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'A', text: 'Purifier les récoltes' },
            { id: 'B', text: 'Appeler la pluie' },
            { id: 'C', text: 'Célébrer les mariages' },
            { id: 'D', text: 'Guérir les malades' }
          ].map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.01, backgroundColor: '#fdfcfb' }}
              whileTap={{ scale: 0.99 }}
              className="group flex items-center p-6 bg-surface-container-low rounded-2xl transition-all shadow-sm hover:shadow-md text-left"
            >
              <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-primary shadow-sm mr-5 group-hover:bg-primary group-hover:text-white transition-colors font-headline">
                {item.id}
              </span>
              <span className="text-lg font-medium font-body text-on-surface">{item.text}</span>
            </motion.button>
          ))}
        </div>
      </main>

      {/* FOOTER NAVIGATION (Comme sur la page Référents) */}
      <footer className="fixed bottom-8 left-0 w-full z-50 px-6 pointer-events-none">
        <div className="max-w-4xl mx-auto bg-[#faf9f8]/85 backdrop-blur-xl rounded-full px-8 py-3 flex items-center justify-between shadow-[rgba(160,65,45,0.12)_0px_-15px_40px] pointer-events-auto border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-600 via-yellow-400 to-red-600"></div>
            <span className="font-headline font-black text-lg tracking-tighter">Beninease</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-headline text-[10px] font-black uppercase tracking-[0.25em]">
            <a href="/referents" className="text-on-surface/60 hover:text-primary transition-colors">Référents</a>
            <a href="/mysteres" className="text-primary underline underline-offset-8 decoration-2">Mystères</a>
            <a href="/talents" className="text-on-surface/60 hover:text-primary transition-colors">Talents</a>
            <a href="/tresors" className="text-on-surface/60 hover:text-primary transition-colors">Trésors</a>
          </nav>

          <button className="bg-secondary text-white px-6 py-2 rounded-full font-bold text-xs shadow-lg hover:scale-105 transition-all">
            CONNEXION
          </button>
        </div>
      </footer>
      
    </div>
  );
}
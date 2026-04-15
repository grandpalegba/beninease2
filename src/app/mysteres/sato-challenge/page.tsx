"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function SatoChallengePage() {

  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center overflow-hidden">
      
      <main className="flex-1 w-full max-w-5xl px-6 flex flex-col items-center justify-center">
        
        {/* SECTION VISUELLE : Focus sur la Jarre Sato */}
        <div className="relative w-full flex justify-center items-center mb-16 h-96">
          
          {/* Background Bloom */}
          <div className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
          
          {/* JARRE SATO : Design amélioré avec texture clay */}
          <div className="relative w-72 h-[360px] z-10">
            {/* Lip de la jarre */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-40 h-10 bg-[#3d1810] rounded-[50%] shadow-inner border-4 border-primary/20 z-0"></div>
            {/* Corps de la jarre */}
            <div className="absolute inset-0 clay-texture organic-shape flex flex-col items-center justify-center overflow-hidden">
              {/* Ombrage supérieur */}
              <div className="absolute top-0 w-full h-16 bg-gradient-to-b from-black/25 to-transparent"></div>
              {/* Cercles décoratifs (Ouvertures) */}
              <div className="relative w-full h-full">
                <div className="absolute top-[40%] left-[25%] w-14 h-14 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
                <div className="absolute top-[32%] left-[58%] w-12 h-12 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
                <div className="absolute top-[62%] left-[40%] w-16 h-16 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
                <div className="absolute top-[55%] left-[72%] w-10 h-10 rounded-full bg-[#2a100a] shadow-inner opacity-95 border border-black/10"></div>
              </div>
            </div>
          </div>
        </div>

      </main>

      
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { LifeCase } from '@/features/consultation/useLifeCases';

interface SwipeableCaseDeckProps {
  cases: LifeCase[];
  onChoice: (caseId: string, option: string) => void;
}

const SwipeableCaseDeck: React.FC<SwipeableCaseDeckProps> = ({ cases, onChoice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [verdictData, setVerdictData] = useState<{ option: string; case: LifeCase } | null>(null);

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (currentIndex >= cases.length || verdictData) return;

    const currentCase = cases[currentIndex];
    const directionMap = { left: 0, right: 1, up: 2, down: 3 };
    const index = directionMap[direction];

    const chosenOption = currentCase.options[index] || currentCase.options[0];

    // On affiche le verdict avant de passer à la suite
    setVerdictData({ option: chosenOption, case: currentCase });
    onChoice(currentCase.id, chosenOption);
  };

  const nextCase = () => {
    setVerdictData(null);
    setCurrentIndex((prev) => prev + 1);
  };

  if (currentIndex >= cases.length) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center p-8 bg-white h-full">
        <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-300 mb-4">Fin de Consultation</p>
        <h2 className="text-xl font-extralight text-black">La sagesse est en marche.</h2>
      </motion.div>
    );
  }

  return (
    <div className="relative w-full h-[500px] max-w-[350px] perspective-1000">
      <AnimatePresence mode="wait">
        {verdictData ? (
          <VerdictCard
            key="verdict"
            option={verdictData.option}
            data={verdictData.case}
            onNext={nextCase}
          />
        ) : (
          <div className="relative w-full h-full">
            {/* On ne montre que la carte actuelle et la suivante en dessous */}
            {cases.slice(currentIndex, currentIndex + 2).reverse().map((item, index) => {
              const isTop = (cases.length - currentIndex === 1) ? index === 0 : index === 1;
              return (
                <Card
                  key={item.id}
                  data={item}
                  isTop={isTop}
                  onSwipe={handleSwipe}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- COMPOSANT VERDICT (L'affichage après le swipe) ---
const VerdictCard = ({ option, data, onNext }: { option: string, data: LifeCase, onNext: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, x: 500 }}
    className="absolute inset-0 bg-black text-white rounded-3xl p-8 flex flex-col justify-between shadow-2xl"
  >
    <div>
      <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Votre Choix</span>
      <h3 className="text-xl font-light mt-4 mb-8">"{option}"</h3>
      <div className="h-[1px] w-full bg-neutral-800 mb-8" />
      <p className="text-sm font-light leading-relaxed text-neutral-400">
        L'analyse de ce cas de vie est enregistrée. La suite de la consultation vous révélera les correspondances avec le signe du Fa.
      </p>
    </div>

    <button
      onClick={onNext}
      className="w-full py-4 border border-neutral-700 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
    >
      Continuer →
    </button>
  </motion.div>
);

// --- COMPOSANT CARTE (Le swipe) ---
const Card = ({ data, isTop, onSwipe }: { data: LifeCase; isTop: boolean; onSwipe: (dir: any) => void }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.offset.y) > threshold) {
      if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
        onSwipe(info.offset.x > 0 ? 'right' : 'left');
      } else {
        onSwipe(info.offset.y > 0 ? 'down' : 'up');
      }
    }
  };

  return (
    <motion.div
      style={{ x, y, rotate, opacity, zIndex: isTop ? 10 : 0 }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute inset-0 bg-white border border-neutral-100 shadow-xl rounded-3xl p-8 flex flex-col justify-between cursor-grab active:cursor-grabbing"
    >
      <div>
        <div className="flex justify-between items-start mb-12">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium">{data.label}</span>
          <span className="text-[10px] font-light text-neutral-300">{data.persona}</span>
        </div>
        <h3 className="text-xl font-light leading-tight text-black mb-6">{data.title}</h3>
        <p className="text-sm font-light text-neutral-500 leading-relaxed italic">"{data.quote}"</p>
      </div>

      <div className="space-y-2">
        <div className="text-[9px] uppercase tracking-widest text-neutral-300 text-center mb-2">Faites glisser pour choisir</div>
        <div className="grid grid-cols-2 gap-2 opacity-40">
          {data.options.map((opt, i) => (
            <div key={i} className="p-2 border border-neutral-100 rounded text-[9px] truncate">{opt}</div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeableCaseDeck;
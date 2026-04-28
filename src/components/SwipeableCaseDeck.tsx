'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { LifeCase } from '@/features/consultation/useLifeCases';
import CaseCard from './CaseCard';

interface SwipeableCaseDeckProps {
  cases: LifeCase[];
  initialCaseId?: string;
  onPickCase?: (picked: LifeCase, selectedOption: number | null) => void;
}

const SUPABASE_PROJECT_ID = "wtjhkqkqmexddroqwawk";
const STORAGE_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public`;

const SwipeableCaseDeck: React.FC<SwipeableCaseDeckProps> = ({ cases, initialCaseId, onPickCase }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (initialCaseId) {
      const idx = cases.findIndex(c => c.id === initialCaseId);
      return idx !== -1 ? idx : 0;
    }
    return 0;
  });

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const currentCase = cases[currentIndex];



  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);

  const handleDragEnd = (event: any, info: any) => {
    // Swipe Horizontal : Navigation entre les cas
    if (Math.abs(info.offset.x) > 100) {
      if (info.offset.x > 0 && currentIndex > 0) setCurrentIndex(prev => prev - 1);
      else if (info.offset.x < 0 && currentIndex < cases.length - 1) setCurrentIndex(prev => prev + 1);
    }
    // Swipe Vertical : Consultation directe
    if (info.offset.y < -50) {
      onPickCase?.(currentCase, null);
    }
  };

  if (!currentCase) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* ZONE DE LA CARTE */}
      <div className="relative w-full max-w-lg h-full max-h-[82vh] z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCase.id}
            style={{ x, opacity }}
            drag="both"
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            onClick={() => onPickCase?.(currentCase, null)}
            className="w-full h-full rounded-[2.5rem] md:rounded-[3rem] overflow-hidden bg-white shadow-[0_30px_60px_rgba(0,0,0,0.06)] border border-neutral-100 cursor-grab active:cursor-grabbing"
          >
            <CaseCard
              lifeCase={currentCase}
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};



export default SwipeableCaseDeck;
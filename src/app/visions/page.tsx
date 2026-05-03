"use client";

import React from 'react';
import { VisionsGrid } from '@/components/visions/VisionsGrid';
import { VisionPanel } from '@/components/visions/VisionPanel';
import { VisionSelectionBar } from '@/components/visions/VisionSelectionBar';
import { VisionDetailModal } from '@/components/visions/VisionDetailModal';
import BackButton from '@/components/ui/BackButton';

export default function VisionsPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white font-sans selection:bg-black selection:text-white">
      {/* Pure Grid View */}
      <VisionsGrid />

      {/* BOUTON RETOUR */}
      <BackButton href="/" className="absolute top-4 left-4 z-[400]" />

      {/* Interactive Components */}
      <VisionSelectionBar />
      <VisionPanel />
      <VisionDetailModal />
    </div>
  );
}

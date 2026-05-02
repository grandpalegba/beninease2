"use client";

import React from 'react';
import { VisionsGrid } from '@/components/visions/VisionsGrid';
import { VisionPanel } from '@/components/visions/VisionPanel';
import { VisionSelectionBar } from '@/components/visions/VisionSelectionBar';
import { motion } from 'framer-motion';


export default function VisionsPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Grid Container */}
      <VisionsGrid />

      {/* Action Bar for selection */}
      <VisionSelectionBar />

      {/* Right-side Detail Panel */}
      <VisionPanel />
    </div>
  );
}

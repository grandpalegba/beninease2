"use client";

import React from 'react';
import { VisionsGrid } from '@/components/visions/VisionsGrid';
import { VisionPanel } from '@/components/visions/VisionPanel';
import { VisionSelectionBar } from '@/components/visions/VisionSelectionBar';

export default function VisionsPage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white font-sans selection:bg-black selection:text-white">
      {/* Pure Grid View */}
      <VisionsGrid />

      {/* Interactive Components */}
      <VisionSelectionBar />
      <VisionPanel />
    </div>
  );
}

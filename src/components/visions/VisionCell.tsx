"use client";

import React from 'react';
import { VisionCellData } from '@/types/visions';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface VisionCellProps {
  x: number;
  y: number;
  data?: VisionCellData;
  isSelected: boolean;
  isGhostSelected?: boolean;
  isLocked?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
}

export const VisionCell = React.memo(({ x, y, data, isSelected, isGhostSelected, isLocked, onClick, onMouseEnter }: VisionCellProps) => {
  const isOccupied = !!data?.ownerName;
  const locked = isLocked || data?.isLocked;

  return (
    <div 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "relative w-full h-full border-[0.5px] border-black/[0.03] cursor-pointer transition-colors duration-150 bg-white",
        isSelected && "bg-black/[0.05] border-black/20 z-10",
        isGhostSelected && !isSelected && "bg-black/[0.02]",
        isOccupied && "bg-zinc-50"
      )}
    >
      {/* Occupied State */}
      {isOccupied && (
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
           <div className="absolute inset-0 bg-black/[0.02] opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
             <span className="text-[6px] text-black font-bold uppercase tracking-tighter">
               {data?.ownerName}
             </span>
           </div>
        </div>
      )}

      {/* Lock State */}
      {locked && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-50/50 backdrop-blur-[1px]">
          <Lock size={10} className="text-black/10 animate-pulse" />
        </div>
      )}
    </div>
  );
});

VisionCell.displayName = 'VisionCell';

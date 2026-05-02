"use client";

import React from 'react';
import { VisionCellData } from '@/types/visions';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Plus } from 'lucide-react';

interface VisionCellProps {
  x: number;
  y: number;
  data?: VisionCellData;
  isSelected: boolean;
  isGhostSelected?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
}

export const VisionCell = React.memo(({ x, y, data, isSelected, isGhostSelected, onClick, onMouseEnter }: VisionCellProps) => {
  const isHot = (data?.captureCount || 0) >= 3;

  return (
    <div 
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "relative w-full h-full border-[0.5px] border-black/5 cursor-pointer transition-colors duration-150",
        isSelected && "bg-[#D4AF37]/30 border-[#D4AF37]/60",
        isGhostSelected && !isSelected && "bg-[#D4AF37]/10 border-[#D4AF37]/30"
      )}
    >

      {/* Occupied State */}
      {data && (
        <div className="absolute inset-0 group">
          {data.mediaType === 'photo' ? (
            <Image 
              src={data.mediaUrl} 
              alt={data.ownerName}
              fill
              className="object-cover"
              sizes="100px"
            />
          ) : (
            <video 
              src={data.mediaUrl}
              className="w-full h-full object-cover"
              muted
              loop
              onMouseEnter={(e) => e.currentTarget.play()}
              onMouseLeave={(e) => e.currentTarget.pause()}
            />
          )}
          
          {/* Hot Zone Aura */}
          {isHot && (
            <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(212,175,55,0.5)] animate-pulse border border-[#D4AF37]/30" />
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[6px] text-white font-bold uppercase tracking-tighter">
              {data.ownerName}
            </span>
          </div>
        </div>
      )}

      {/* Empty State Hover */}
      {!data && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/5 transition-opacity">
          <Plus size={12} className="text-black/20" />
        </div>
      )}
    </div>
  );
});

VisionCell.displayName = 'VisionCell';

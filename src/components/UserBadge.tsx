"use client";

import React from "react";
import { Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserBadgeProps {
  status: string;
  weight: number;
  multiplier: number;
  className?: string;
}

export default function UserBadge({ status, weight, multiplier, className }: UserBadgeProps) {
  const powerLevel = weight * multiplier;

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-inner",
      className
    )}>
      {/* Voter Status */}
      <div className="flex items-center gap-1.5 border-r border-white/20 pr-3">
        <Shield className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white whitespace-nowrap">
          {status || "Citoyen"}
        </span>
      </div>

      {/* Power Level */}
      <div className="flex items-center gap-1.5 pl-1">
        <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
        <div className="flex flex-col -space-y-1">
          <span className="text-[10px] font-black text-white leading-none">
            PUISSANCE {powerLevel}
          </span>
          <span className="text-[7px] font-bold text-white/50 uppercase tracking-tighter">
            Niveau Actuel
          </span>
        </div>
      </div>
    </div>
  );
}

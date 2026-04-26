"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Scroll, Landmark, History, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreasureData {
  titre: string;
  nature: string;
  history: string;
  location: string;
}

interface TreasureCardProps {
  data: TreasureData;
  className?: string;
}

export default function TreasureCard({ data, className }: TreasureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "relative overflow-hidden p-8 bg-white/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)]",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-amber-100/20 before:to-orange-100/20 before:pointer-events-none",
        className
      )}
    >
      {/* Decorative Corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
           <Scroll className="text-white w-6 h-6" />
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-amber-600 mb-1 flex items-center gap-2">
            <Sparkles className="w-3 h-3" /> Fiche Trésor <Sparkles className="w-3 h-3" />
          </h2>
          <h3 className="text-2xl font-display font-black text-gray-900 leading-tight">
            {data.titre}
          </h3>
        </div>
      </div>

      {/* Content Grid */}
      <div className="space-y-8">
        {/* Nature Section */}
        <div className="flex gap-5">
           <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              <Landmark className="w-5 h-5" />
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nature de l'objet</p>
              <p className="text-base font-bold text-gray-800 leading-snug">{data.nature}</p>
           </div>
        </div>

        {/* History Section */}
        <div className="flex gap-5">
           <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              <History className="w-5 h-5" />
           </div>
           <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Histoire & Héritage</p>
              <p className="text-sm text-gray-600 leading-relaxed font-sans italic">
                {data.history}
              </p>
           </div>
        </div>

        {/* Localization Section */}
        <div className="flex gap-5 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
           <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md">
              <MapPin className="w-5 h-5" />
           </div>
           <div className="space-y-1">
              <p className="text-[10px] font-bold text-amber-600/60 uppercase tracking-widest">Localisation Actuelle</p>
              <p className="text-base font-bold text-amber-900 leading-snug">{data.location}</p>
           </div>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="mt-10 flex justify-center">
         <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-200 to-transparent rounded-full" />
      </div>
    </motion.div>
  );
}

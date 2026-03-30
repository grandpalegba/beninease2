"use client";

import React from "react";
import { Play, Clock, Lock, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole, VideoSchema } from "@/types";

interface VideoTabsProps {
  role: UserRole;
  videoIds: VideoSchema;
  activeTabIndex: number;
  onTabChange: (index: number) => void;
  onUpload?: (index: number) => void;
  onDelete?: (index: number) => void;
  isEditable?: boolean;
}

const TAB_LABELS = [
  "QUI JE SUIS",
  "MON HISTOIRE",
  "MON SERVICE",
  "POURQUOI MOI"
];

export function VideoTabs({
  role,
  videoIds,
  activeTabIndex,
  onTabChange,
  onUpload,
  onDelete,
  isEditable = false
}: VideoTabsProps) {
  
  const isTabEnabled = (index: number) => {
    if (index === 0) return true;
    return role === "ambassadeur" || role === "jury" || role === "admin";
  };

  const getVideoId = (index: number) => {
    const key = `video_${index + 1}_id` as keyof VideoSchema;
    return videoIds[key];
  };

  return (
    <div className="w-full space-y-6">
      {/* Tab Selectors */}
      <div className="grid grid-cols-4 gap-2 md:gap-4">
        {TAB_LABELS.map((label, index) => {
          const enabled = isTabEnabled(index);
          const active = activeTabIndex === index;
          const hasVideo = !!getVideoId(index);

          return (
            <button
              key={label}
              onClick={() => enabled && onTabChange(index)}
              disabled={!enabled}
              className={cn(
                "relative group flex flex-col items-center justify-center p-2 md:p-4 rounded-xl border-2 transition-all duration-300",
                active 
                  ? "border-[#008751] bg-[#008751]/5 shadow-sm" 
                  : "border-transparent bg-white/50 hover:bg-white",
                !enabled && "opacity-50 cursor-not-allowed grayscale"
              )}
            >
              <div className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-center">
                {label}
              </div>
              
              {!enabled && (
                <Lock className="w-3 h-3 mt-1 text-gray-400" />
              )}
              
              {enabled && hasVideo && (
                <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#008751]" />
              )}
              
              {active && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#008751] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Video Display Area */}
      <div className="relative aspect-video bg-[#1A1A1A] rounded-[30px] overflow-hidden shadow-2xl group border-[8px] border-white ring-1 ring-[#008751]/20">
        {getVideoId(activeTabIndex) ? (
          <div className="absolute inset-0">
             <iframe
              src={`https://www.youtube.com/embed/${getVideoId(activeTabIndex)}`}
              className="w-full h-full"
              allowFullScreen
            />
            {isEditable && onDelete && (
              <button 
                onClick={() => onDelete(activeTabIndex)}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <Play className="w-8 h-8 text-white/50" />
            </div>
            <p className="text-lg font-display font-medium mb-2">
              {isEditable ? "Aucune vidéo ajoutée" : "Vidéo non disponible"}
            </p>
            <p className="text-sm text-white/60 max-w-xs mx-auto">
              {isEditable 
                ? "Ajoutez votre présentation vidéo pour ce chapitre."
                : "Ce talent n'a pas encore partagé cette partie de son histoire."}
            </p>
            
            {isEditable && onUpload && (
              <button 
                onClick={() => onUpload(activeTabIndex)}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-[#008751] text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#008751]/90 transition-all"
              >
                <Upload className="w-4 h-4" />
                Ajouter une vidéo
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-[#008751]/60 text-[10px] font-bold uppercase tracking-widest px-4">
        <Clock className="w-3.5 h-3.5" />
        Durée recommandée : 2 minutes maximum
      </div>
    </div>
  );
}

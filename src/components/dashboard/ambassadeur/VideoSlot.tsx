"use client";

import { useState } from 'react';
import { Lock, Trash2, Upload, CheckCircle2, Loader2, AlertTriangle, Film } from 'lucide-react';
import { cn } from '@/lib/utils';
import UploadDropzone from './UploadDropzone';

interface VideoSlotProps {
  step: {
    id: number;
    label: string;
    desc: string;
    key: string;
  };
  videoId: string | null;
  isLocked: boolean;
  isPreviousStepCompleted: boolean;
  onUpdate: (key: string, videoId: string | null) => Promise<void>;
  onDelete: (key: string) => Promise<void>;
}

type VideoStatus = 'published' | 'validating' | 'unpublished';

export default function VideoSlot({ step, videoId: initialVideoId, isLocked, isPreviousStepCompleted, onUpdate, onDelete }: VideoSlotProps) {
  const [videoId, setVideoId] = useState(initialVideoId);
  const [status, setStatus] = useState<VideoStatus>('published'); // A rendre dynamique plus tard
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = async (newVideoId: string) => {
    setIsLoading(true);
    await onUpdate(step.key, newVideoId);
    setVideoId(newVideoId);
    setIsLoading(false);
    setIsUploading(false);
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) {
      setIsLoading(true);
      await onDelete(step.key);
      setVideoId(null);
      setIsLoading(false);
    }
  };

  const statusMap = {
    published: {
      text: 'Validée',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      className: 'bg-green-500/10 text-green-600 border-green-500/20',
    },
    validating: {
      text: 'En validation',
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
      className: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    unpublished: {
      text: 'Non publiée',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      className: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    },
  };

  const currentStatus = statusMap[status];

  return (
    <div
      className={cn(
        "relative p-6 md:p-8 rounded-[32px] border-2 transition-all group overflow-hidden shadow-sm",
        isLocked
          ? "bg-gray-50 border-gray-100"
          : "bg-white border-transparent hover:border-[#008751]/20 hover:shadow-xl hover:shadow-[#008751]/5"
      )}
    >
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 backdrop-blur-[2px] z-10 p-6 text-center">
          <Lock className="w-10 h-10 text-gray-300 mb-4" />
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
            {isPreviousStepCompleted ? "En attente de validation" : "Étape précédente requise"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {isPreviousStepCompleted ? "Le jury examinera votre vidéo." : "Veuillez compléter le slot précédent."}
          </p>
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <h3 className="font-display text-xl font-bold text-black">{step.label}</h3>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{step.desc}</p>
        </div>
        {videoId && (
          <div className={cn("flex items-center gap-2 text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border", currentStatus.className)}>
            {currentStatus.icon}
            {currentStatus.text}
          </div>
        )}
      </div>

      <div className="mt-4 min-h-[200px] flex flex-col justify-center">
        {videoId ? (
          <div className="space-y-4 animate-in fade-in">
            <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-lg border-4 border-white">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={step.label}
                allowFullScreen
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsUploading(true)}
                disabled={isLoading}
                className="flex-1 text-center px-4 py-2 bg-gray-800 text-white rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition-all"
              >
                Modifier la vidéo
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Supprimer la vidéo"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsUploading(true)}
            disabled={isLocked || isLoading}
            className="w-full py-12 border-2 border-dashed border-gray-200 rounded-[24px] flex flex-col items-center justify-center hover:border-[#008751]/30 hover:bg-[#008751]/5 transition-all group bg-gray-50/50"
          >
            <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#008751]" />
            </div>
            <span className="text-sm font-bold text-gray-400 group-hover:text-[#008751] uppercase tracking-widest">Ajouter ma vidéo</span>
          </button>
        )}
      </div>

      {isUploading && !isLocked && (
        <UploadDropzone
          onSuccess={handleUploadSuccess}
          onClose={() => setIsUploading(false)}
        />
      )}
    </div>
  );
}

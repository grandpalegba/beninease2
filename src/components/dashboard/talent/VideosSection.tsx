"use client";

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { VIDEO_STEPS } from '@/lib/constants/video-steps';
import type { Talent } from '@/types';
import VideoSlot from './VideoSlot';
import { cn } from '@/lib/utils';

interface VideosSectionProps {
  profile: Talent;
}

export default function VideosSection({ profile: initialProfile }: VideosSectionProps) {
  const [profile, setProfile] = useState(initialProfile);
  const supabase = createSupabaseBrowserClient();

  const isAmbassadeur = profile.role === 'ambassadeur' || profile.role === 'admin';

  const handleUpdateVideo = async (key: string, videoId: string | null) => {
    const { data, error } = await supabase
      .from('talents')
      .update({ [key]: videoId })
      .eq('id', profile.id)
      .select()
      .single();

    if (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Une erreur est survenue.");
    } else if (data) {
      setProfile(data as Talent);
    }
  };

  const handleDeleteVideo = async (key: string) => {
    await handleUpdateVideo(key, null);
  };

  const totalSteps = VIDEO_STEPS.length;
  const completedSteps = VIDEO_STEPS.filter(step => !!profile[step.key as keyof Talent]).length;

  return (
    <div className="space-y-12">
      <div className="bg-white border border-gray-100 rounded-[32px] p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <h4 className="text-lg font-bold text-black">Progression de votre candidature</h4>
              <p className="text-sm text-gray-500">
                Présentez votre talent avec une vidéo principale et jusqu'à 4 vidéos complémentaires.
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-grow relative h-2 bg-gray-100 rounded-full">
                    <div 
                        className="absolute top-0 left-0 h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
                    />
                </div>
                <span className="text-sm font-bold text-gray-600">{completedSteps}/{totalSteps}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {VIDEO_STEPS.map((step) => {
          const videoId = profile[step.key as keyof Talent] as string | null;
          const isPreviousStepCompleted = step.id === 1 || !!profile[VIDEO_STEPS[step.id - 2].key as keyof Talent];
          const isLocked = step.id > 1 && !isAmbassadeur && !isPreviousStepCompleted;

          return (
            <VideoSlot
              key={step.id}
              step={step}
              videoId={videoId}
              isLocked={isLocked}
              onUpdate={handleUpdateVideo}
              onDelete={handleDeleteVideo}
            />
          );
        })}
      </div>
    </div>
  );
}

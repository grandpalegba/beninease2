"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { TreasuresService } from "@/lib/treasures-service";
import type { Mystere, UserTreasure } from "@/types/treasures";
import CardDeck from "@/components/ui/CardDeck";
import TeasingCard from "@/components/ui/TeasingCard";
import AwaleHeader from "@/components/treasures/AwaleHeader";
import RoyalJar from "@/components/treasures/RoyalJar";
import AnswerGrid from "@/components/treasures/AnswerGrid";
import TreasureCard from "@/components/treasures/TreasureCard";
import { useMysteryGame } from "@/hooks/useMysteryGame";
import { Loader2, AlertCircle, Clock, Trophy, RotateCcw } from "lucide-react";
import Image from "next/image";

export default function TreasuresPage() {
  const [mysteres, setMysteres] = useState<Mystere[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserTreasure>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSuccess = useCallback((mystereId: string, data: any) => {
    setUserProgress(prev => ({ ...prev, [mystereId]: data }));
  }, []);

  const { 
    handleCorrectAnswer, 
    handleWrongAnswer, 
    handleLiftCooldown 
  } = useMysteryGame(userId, handleSuccess);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      const [mysteresRes, progressRes] = await Promise.all([
        TreasuresService.getMysteres(0, 50),
        user ? TreasuresService.getUserProgress(user.id) : Promise.resolve({ data: {} })
      ]);

      if (mysteresRes.error) throw mysteresRes.error;
      
      const mysteresWithInfo = await Promise.all((mysteresRes.data || []).map(async (m) => {
        const { data: info } = await TreasuresService.getTreasureInfo(m.id);
        return { ...m, treasure_info: info };
      }));

      setMysteres(mysteresWithInfo);
      setUserProgress(progressRes.data || {});
    } catch (err) {
      console.error('Error loading treasures:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F4F4F2]">
      <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-4" />
      <p className="text-gray-500 font-medium font-display uppercase tracking-widest text-xs">Extraction des Trésors...</p>
    </div>
  );

  return (
    <div className="h-screen w-full bg-[#F4F4F2] overflow-hidden">
      <CardDeck 
        items={mysteres}
        renderItem={(mystere) => {
          const progress = userProgress[mystere.id];
          const lives = TreasuresService.getRemainingLives(progress);
          const isLocked = TreasuresService.checkCooldown(progress);
          const currentStep = progress?.current_step || 0;
          const lockTimeLeft = progress ? TreasuresService.getTimeRemaining(progress.locked_until) : "";

          return (
            <TeasingCard
              id={mystere.id}
              image=""
              title=""
              subtitle={mystere.theme?.name || "Mystère Ancestral"}
              text={mystere.mise_en_abyme || mystere.explanation || "Découvrez le secret enfoui..."}
              hideImage={true}
              hideTitle={true}
              className="mt-16"
              expandedContent={() => (
                <div className="space-y-12">
                   {/* Header: Awale is actually inside the TeasingCard's sticky top fixed area but we need lives */}
                   <div className="fixed top-0 left-0 right-0 z-[60] pointer-events-none">
                      <div className="max-w-4xl mx-auto flex justify-center">
                        <AwaleHeader lives={lives} className="pointer-events-auto" />
                      </div>
                   </div>

                   <div className="pt-24 space-y-12">
                      {currentStep >= 4 ? (
                        <div className="flex flex-col items-center text-center space-y-8">
                           <Image src="/images/treasures/image_15.png" alt="Victoire" width={400} height={400} className="object-contain" />
                           <h2 className="text-5xl font-display font-black text-amber-900 uppercase">Unité Céleste</h2>
                           <TreasureCard data={mystere.treasure_info} className="w-full" />
                        </div>
                      ) : lives === 0 || isLocked ? (
                        <div className="bg-[#0D0D12] text-white p-12 rounded-[3.5rem] text-center space-y-8">
                           <Image src="/images/treasures/image_16.png" alt="Silence" width={300} height={300} className="object-contain mx-auto opacity-80" />
                           <h2 className="text-4xl font-display font-black text-red-600 uppercase tracking-widest">Silence Royal</h2>
                           <div className="flex items-center justify-center gap-4 px-8 py-4 bg-white/5 rounded-full border border-white/5 w-fit mx-auto">
                             <Clock className="w-6 h-6 text-amber-500" />
                             <span className="text-2xl font-mono text-amber-500 font-black">{lockTimeLeft || "48:00:00"}</span>
                           </div>
                        </div>
                      ) : (
                        <div className="space-y-16">
                           <div className="text-center space-y-4">
                              <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900">
                                {mystere.questions?.[currentStep]?.question}
                              </h2>
                           </div>
                           <div className="flex justify-center">
                             <RoyalJar currentStep={currentStep} className="w-80 h-80" />
                           </div>
                           <div className="max-w-2xl mx-auto w-full">
                              <AnswerGrid 
                                options={[
                                  mystere.questions?.[currentStep]?.choice_a,
                                  mystere.questions?.[currentStep]?.choice_b,
                                  mystere.questions?.[currentStep]?.choice_c,
                                  mystere.questions?.[currentStep]?.choice_d
                                ]}
                                currentQuestionIndex={currentStep}
                                isAnswered={false}
                                onDragEnd={(e, info, index) => {
                                  const correct = mystere.questions?.[currentStep]?.correct_answer;
                                  const letter = String.fromCharCode(65 + index);
                                  if (letter === correct) onCorrectAnswer(mystere.id);
                                  else onWrongAnswer(mystere.id);
                                }}
                                onDragStart={() => {}}
                                onDrag={() => {}}
                              />
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              )}
            />
          );
        }}
      />
    </div>
  );

  function onCorrectAnswer(id: string) {
    handleCorrectAnswer(id);
  }

  function onWrongAnswer(id: string) {
    handleWrongAnswer(id);
  }
}

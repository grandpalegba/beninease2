"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { TreasuresService } from "@/lib/treasures-service";
import type { Mystere, UserTreasure } from "@/types/treasures";
import { Loader2, AlertCircle, Sparkles, MapPin } from "lucide-react";
import HorizontalSwiper from "@/components/swipers/HorizontalSwiper";
import ExpandableCard from "@/components/ui/ExpandableCard";
import JarreSvg from "@/components/treasures/JarreSvg";
import QcmComponent from "@/components/treasures/QcmComponent";
import { useMysteryGame } from "@/hooks/useMysteryGame";
import { toast } from "sonner";

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-4" />
      <p className="text-gray-500 font-medium font-display">Extraction des Trésors...</p>
    </div>
  );

  return (
    <div className="min-h-screen py-10 bg-[#F9F9F7] overflow-x-hidden">
      <header className="px-6 md:px-12 mb-12 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-display font-extrabold text-gray-900 mb-4 tracking-tight">
          Les <span className="text-amber-600">Trésors</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Traversez les âges et résolvez les mystères de notre patrimoine. Chaque jarre contient un secret, saurez-vous le libérer ?
        </p>
      </header>

      <HorizontalSwiper>
        {mysteres.map((mystere) => {
          const progress = userProgress[mystere.id];
          const isLocked = TreasuresService.checkCooldown(progress);
          const lives = TreasuresService.getRemainingLives(progress);
          const timeLeft = progress ? TreasuresService.getTimeRemaining(progress.locked_until) : "";

          return (
            <ExpandableCard
              key={mystere.id}
              preview={
                <div className="w-full h-full relative p-8 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
                  <JarreSvg isLocked={isLocked} className="w-48 h-48 mb-6" />
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest mb-2">
                       {mystere.theme?.name || "Mystère"}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-gray-900 line-clamp-1">
                      {mystere.title || `Trésor #${mystere.mystere_number}`}
                    </h3>
                  </div>
                </div>
              }
              expandedContent={
                      <div className="pt-6 border-t border-gray-100">
                        <QcmComponent
                          questions={(mystere.questions || []).map(q => ({
                            id: q.id,
                            question: q.question,
                            options: [q.choice_a, q.choice_b, q.choice_c, q.choice_d],
                            correct_answer: q.correct_answer === 'A' ? 0 : q.correct_answer === 'B' ? 1 : q.correct_answer === 'C' ? 2 : 3
                          }))}
                          lives={lives}
                          isLocked={isLocked}
                          lockTimeLeft={timeLeft}
                          currentStep={progress?.current_step || 0}
                          treasureData={mystere.treasure_info}
                          onCorrect={() => handleCorrectAnswer(mystere.id)}
                          onWrong={() => handleWrongAnswer(mystere.id)}
                          onUnlock={(word) => handleLiftCooldown(mystere.id, word)}
                        />
                      </div>
              }
            />
          );
        })}
      </HorizontalSwiper>
    </div>
  );
}

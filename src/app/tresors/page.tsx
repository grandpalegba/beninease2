"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { TreasuresService } from "@/lib/treasures-service";
import type { Mystere, UserTreasure } from "@/types/treasures";
import { Loader2, AlertCircle, Sparkles, MapPin } from "lucide-react";
import HorizontalSwiper from "@/components/swipers/HorizontalSwiper";
import ExpandableCard from "@/components/ui/ExpandableCard";
import JarreSvg from "@/components/treasures/JarreSvg";
import MysteryDeck from "@/components/treasures/MysteryDeck";
import { useMysteryGame } from "@/hooks/useMysteryGame";

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
      <MysteryDeck 
        mysteres={mysteres}
        userProgress={userProgress}
        onCorrect={handleCorrectAnswer}
        onWrong={handleWrongAnswer}
        onUnlock={handleLiftCooldown}
      />
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { TreasuresService } from "@/lib/treasures-service";
import { toast } from "sonner";

export function useMysteryGame(userId: string | null, onSuccess?: (mystereId: string, data: any) => void) {
  const [loading, setLoading] = useState(false);

  const handleCorrectAnswer = useCallback(async (mystereId: string) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await TreasuresService.updateProgress(
        userId,
        mystereId,
        true
      );

      if (error) throw error;
      
      const nextStep = data?.current_step || 0;
      if (onSuccess) onSuccess(mystereId, data);
      
      // ✅ Call cast_weighted_vote on final completion as requested
      if (nextStep >= 4) {
         await supabase.rpc('cast_weighted_vote', {
            target_talent_id: mystereId
         });
      }
      
      toast.success("Énigme résolue ! La jarre se scelle...");
      return { data, error: null };
    } catch (err) {
      console.error("Error in useMysteryGame handleCorrect:", err);
      toast.error("Erreur lors de la mise à jour de la progression");
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [userId, onSuccess]);

  const handleWrongAnswer = useCallback(async (mystereId: string) => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await TreasuresService.updateProgress(
        userId,
        mystereId,
        false
      );

      if (error) throw error;
      if (onSuccess) onSuccess(mystereId, data);
      toast.error("Mauvaise réponse. Soyez prudent.");
      return { data, error: null };
    } catch (err) {
      console.error("Error in useMysteryGame handleWrong:", err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [userId, onSuccess]);

  const handleLiftCooldown = useCallback(async (mystereId: string, powerWord: string) => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await TreasuresService.liftCooldown(userId, mystereId, powerWord);
      if (error) throw error;
      if (onSuccess) onSuccess(mystereId, data);
      toast.success("Trésor libéré ! Vos vies sont restaurées.");
      return { data, error: null };
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur de libération");
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, [userId, onSuccess]);

  return {
    loading,
    handleCorrectAnswer,
    handleWrongAnswer,
    handleLiftCooldown
  };
}

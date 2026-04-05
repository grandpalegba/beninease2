import { supabase } from '@/utils/supabase/client';
import type { Mystere, Question, UserTreasure } from '@/types/treasures';

export class TreasuresService {
  // Récupérer les mystères avec pagination
  static async getMysteres(page: number = 0, limit: number = 20) {
    try {
      const offset = page * limit;
      
      const { data, error } = await supabase
        .from('mysteres')
        .select(`
          *,
          theme:themes(id, name, order),
          questions:questions(
            id,
            mystere_id,
            question_number,
            question,
            choice_a,
            choice_b,
            choice_c,
            choice_d,
            correct_answer,
            explanation
          )
        `)
        .order('mystere_number', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Error fetching mysteres:', error);
      return { data: null, error: error as Error };
    }
  }

  // Récupérer la progression de l'utilisateur
  static async getUserProgress(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_treasures')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const progressMap = (data || []).reduce((acc: Record<string, UserTreasure>, progress: UserTreasure) => {
        acc[progress.treasure_id] = progress;
        return acc;
      }, {});

      return { data: progressMap, error: null };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return { data: null, error: error as Error };
    }
  }

  // Mettre à jour la progression et attribuer des points
  static async updateProgress(userId: string, mystereId: string, isCorrect: boolean) {
    try {
      const { data: existing } = await supabase
        .from('user_treasures')
        .select('*')
        .eq('user_id', userId)
        .eq('treasure_id', mystereId)
        .maybeSingle();

      let livesLeft = existing ? (existing.lives_left ?? 6) : 6;
      let currentStep = existing ? (existing.current_step || 0) : 0;
      let attempts = existing ? (existing.attempts || 0) : 0;

      if (isCorrect) {
        currentStep += 1;
      } else {
        livesLeft = Math.max(0, livesLeft - 1);
      }
      attempts += 1;

      // Gestion du verrouillage
      let lockedUntil = existing?.locked_until || null;
      if (livesLeft === 0) {
        const lockEnd = new Date();
        lockEnd.setHours(lockEnd.getHours() + 48);
        lockedUntil = lockEnd.toISOString();
      }

      const { data, error: upsertError } = await supabase
        .from('user_treasures')
        .upsert({
          user_id: userId,
          treasure_id: mystereId,
          attempts,
          locked_until: lockedUntil,
          current_step: currentStep,
          lives_left: livesLeft
        })
        .select()
        .single();

      if (upsertError) throw upsertError;

      // Attribution des points via RPC
      if (isCorrect) {
        await supabase.rpc('increment_user_points', { amount: 10 });
        if (currentStep >= 4) {
          await supabase.rpc('increment_user_points', { amount: 10 });
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error updating progress:', error);
      return { data: null, error: error as Error };
    }
  }

  // Libérer via Mot de Pouvoir
  static async liftCooldown(userId: string, mystereId: string, powerWord?: string) {
    try {
      if (powerWord && powerWord.toLowerCase().trim() !== 'libération') {
        throw new Error("Mot de pouvoir incorrect");
      }

      const { data, error } = await supabase
        .from('user_treasures')
        .update({
          locked_until: null,
          lives_left: 6,
          attempts: 0,
          current_step: 0
        })
        .eq('user_id', userId)
        .eq('treasure_id', mystereId)
        .select()
        .single();

      if (error) throw error;

      if (powerWord) {
        await supabase.rpc('increment_user_points', { amount: 5 });
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error lifting cooldown:', error);
      return { data: null, error: error as Error };
    }
  }

  static checkCooldown(userProgress: UserTreasure | undefined): boolean {
    if (!userProgress?.locked_until) return false;
    return new Date(userProgress.locked_until) > new Date();
  }

  static getTimeRemaining(lockedUntil: string | null): string {
    if (!lockedUntil) return '';
    const distance = new Date(lockedUntil).getTime() - new Date().getTime();
    if (distance < 0) return '';
    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}min`;
  }

  static getRemainingLives(userProgress: UserTreasure | undefined): number {
    return userProgress ? (userProgress.lives_left ?? 6) : 6;
  }

  // Récupérer les informations historiques du trésor
  static async getTreasureInfo(mystereId: string) {
    try {
      const { data, error } = await supabase
        .from('tresors')
        .select('*')
        .eq('mystere_id', mystereId)
        .maybeSingle();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching treasure info:', error);
      return { data: null, error: error as Error };
    }
  }
}

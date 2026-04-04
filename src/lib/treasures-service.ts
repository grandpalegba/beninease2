import { supabase } from '@/utils/supabase/client';
import type { Mystere, Question, Theme, UserTreasure } from '@/types/treasures';

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
            label,
            choice_a,
            choice_b,
            choice_c,
            choice_d,
            correct_choice,
            explication
          )
        `)
        .order('mystere_number', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      // Les questions sont déjà triées par mystere_id dans la jointure
      const mysteres = data || [];

      return { data: mysteres, error: null };
    } catch (error) {
      console.error('Error fetching mysteres:', error);
      return { data: null, error: error as Error };
    }
  }

  // Récupérer la progression de l'utilisateur depuis user_treasures
  static async getUserProgress(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_treasures')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Transformer en objet clé-valeur pour un accès facile
      const progressMap = (data || []).reduce((acc, progress) => {
        acc[progress.treasure_id] = progress;
        return acc;
      }, {} as Record<string, UserTreasure>);

      return { data: progressMap, error: null };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return { data: null, error: error as Error };
    }
  }

  // Initialiser ou mettre à jour la progression utilisateur
  static async updateProgress(
    userId: string, 
    mystereId: string, 
    isCorrect: boolean
  ) {
    try {
      // D'abord vérifier si une entrée existe
      const { data: existing } = await supabase
        .from('user_treasures')
        .select('*')
        .eq('user_id', userId)
        .eq('treasure_id', mystereId)
        .single();

      let livesRemaining = 6; // Valeur par défaut
      let attempts = 0;
      let currentStep = 0;

      if (existing) {
        livesRemaining = existing.lives_remaining;
        attempts = existing.attempts;
        currentStep = existing.current_step;

        if (!isCorrect) {
          livesRemaining = Math.max(0, livesRemaining - 1);
        } else {
          currentStep = Math.min(4, currentStep + 1);
        }
        attempts++;
      } else {
        // Première tentative
        if (!isCorrect) {
          livesRemaining = 5;
        } else {
          currentStep = 1;
        }
        attempts = 1;
      }

      // Si plus de vies, activer le cooldown
      let lockedUntil = existing?.locked_until || null;
      if (livesRemaining === 0) {
        const lockEnd = new Date();
        lockEnd.setHours(lockEnd.getHours() + 48);
        lockedUntil = lockEnd.toISOString();
      }

      const { data, error } = await supabase
        .from('user_treasures')
        .upsert({
          user_id: userId,
          treasure_id: mystereId,
          attempts,
          locked_until: lockedUntil,
          current_step: currentStep,
          lives_remaining: livesRemaining
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating progress:', error);
      return { data: null, error: error as Error };
    }
  }

  // Lever le cooldown (QR Code)
  static async liftCooldown(userId: string, mystereId: string) {
    try {
      const { data, error } = await supabase
        .from('user_treasures')
        .update({
          locked_until: null,
          lives_remaining: 6, // Réinitialiser les vies
          attempts: 0, // Réinitialiser les tentatives
          current_step: 0 // Réinitialiser la progression
        })
        .eq('user_id', userId)
        .eq('treasure_id', mystereId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error lifting cooldown:', error);
      return { data: null, error: error as Error };
    }
  }

  // Vérifier si un utilisateur est en cooldown
  static checkCooldown(userProgress: UserTreasure | undefined): boolean {
    if (!userProgress?.locked_until) return false;
    
    const cooldownEnd = new Date(userProgress.locked_until);
    const now = new Date();
    
    return cooldownEnd > now;
  }

  // Calculer le temps restant
  static getTimeRemaining(lockedUntil: string | null): string {
    if (!lockedUntil) return '';
    
    const now = new Date().getTime();
    const cooldownEnd = new Date(lockedUntil).getTime();
    const distance = cooldownEnd - now;
    
    if (distance < 0) return '';
    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}min`;
  }

  // Calculer le nombre de vies restantes pour un mystère
  static getRemainingLives(userProgress: UserTreasure | undefined): number {
    if (!userProgress) return 6;
    return userProgress.lives_remaining;
  }

  // Obtenir les options de question sous forme de tableau
  static getQuestionOptions(question: Question): string[] {
    return [question.choice_a, question.choice_b, question.choice_c, question.choice_d];
  }
}

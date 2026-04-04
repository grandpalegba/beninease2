import { supabase } from '@/utils/supabase/client';
import type { Mystery, Question, Theme, UserProgress } from '@/types/treasures';

export class TreasuresService {
  // Récupérer les mystères avec pagination
  static async getMysteries(page: number = 0, limit: number = 20) {
    try {
      const offset = page * limit;
      
      const { data, error } = await supabase
        .from('mysteries')
        .select(`
          *,
          theme:themes(id, name, icon, color),
          questions:questions(
            id,
            question_number,
            text,
            options,
            correct_answer,
            explanation
          )
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      
      // Trier les questions par numéro pour chaque mystère
      const mysteries = data?.map(mystery => ({
        ...mystery,
        questions: mystery.questions?.sort((a, b) => a.question_number - b.question_number)
      })) || [];

      return { data: mysteries, error: null };
    } catch (error) {
      console.error('Error fetching mysteries:', error);
      return { data: null, error: error as Error };
    }
  }

  // Récupérer la progression de l'utilisateur
  static async getUserProgress(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Transformer en objet clé-valeur pour un accès facile
      const progressMap = (data || []).reduce((acc, progress) => {
        acc[progress.mystery_id] = progress;
        return acc;
      }, {} as Record<string, UserProgress>);

      return { data: progressMap, error: null };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return { data: null, error: error as Error };
    }
  }

  // Mettre à jour la progression
  static async updateProgress(
    userId: string, 
    mysteryId: string, 
    questionsCompleted: number, 
    livesLost: number,
    isCompleted: boolean = false
  ) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          mystery_id: mysteryId,
          questions_completed: questionsCompleted,
          lives_lost: livesLost,
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
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

  // Activer l'Épreuve du Silence (cooldown de 48h)
  static async activateCooldown(userId: string, mysteryId: string) {
    try {
      const cooldownUntil = new Date();
      cooldownUntil.setHours(cooldownUntil.getHours() + 48);

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          mystery_id: mysteryId,
          cooldown_until: cooldownUntil.toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error activating cooldown:', error);
      return { data: null, error: error as Error };
    }
  }

  // Lever le cooldown (QR Code)
  static async liftCooldown(userId: string, mysteryId: string) {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .update({
          cooldown_until: null,
          lives_lost: 0, // Réinitialiser les vies perdues
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('mystery_id', mysteryId)
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
  static checkCooldown(userProgress: UserProgress | undefined): boolean {
    if (!userProgress?.cooldown_until) return false;
    
    const cooldownEnd = new Date(userProgress.cooldown_until);
    const now = new Date();
    
    return cooldownEnd > now;
  }

  // Calculer le temps restant
  static getTimeRemaining(cooldownUntil: string | null): string {
    if (!cooldownUntil) return '';
    
    const now = new Date().getTime();
    const cooldownEnd = new Date(cooldownUntil).getTime();
    const distance = cooldownEnd - now;
    
    if (distance < 0) return '';
    
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}min`;
  }

  // Calculer le nombre de vies restantes pour un mystère
  static getRemainingLives(userProgress: UserProgress | undefined): number {
    if (!userProgress) return 6;
    return Math.max(0, 6 - userProgress.lives_lost);
  }
}

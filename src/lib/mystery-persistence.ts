"use client";

interface MysteryProgress {
  errors: number;
  lockedUntil: number | null;
  currentQuestion: number;
  completedQuestions: number[];
  lastAccessed: number;
}

const STORAGE_KEY = "mystery_progress";
const MAX_ERRORS = 6;
const LOCK_DURATION = 48 * 60 * 60 * 1000; // 48 heures en millisecondes

export class MysteryPersistence {
  static getProgress(mysteryId: string): MysteryProgress {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return this.getDefaultProgress();
      }

      const allProgress = JSON.parse(stored);
      return allProgress[mysteryId] || this.getDefaultProgress();
    } catch (error) {
      console.error('Error reading mystery progress:', error);
      return this.getDefaultProgress();
    }
  }

  static saveProgress(mysteryId: string, progress: Partial<MysteryProgress>): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allProgress = stored ? JSON.parse(stored) : {};
      
      const currentProgress = allProgress[mysteryId] || this.getDefaultProgress();
      const updatedProgress = { ...currentProgress, ...progress, lastAccessed: Date.now() };
      
      allProgress[mysteryId] = updatedProgress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Error saving mystery progress:', error);
    }
  }

  static addError(mysteryId: string): { locked: boolean; errors: number } {
    const progress = this.getProgress(mysteryId);
    const newErrors = progress.errors + 1;
    
    let lockedUntil: number | null = null;
    let locked = false;

    if (newErrors >= MAX_ERRORS) {
      lockedUntil = Date.now() + LOCK_DURATION;
      locked = true;
    }

    this.saveProgress(mysteryId, {
      errors: newErrors,
      lockedUntil
    });

    return { locked, errors: newErrors };
  }

  static isLocked(mysteryId: string): boolean {
    const progress = this.getProgress(mysteryId);
    
    if (!progress.lockedUntil) {
      return false;
    }

    const now = Date.now();
    if (now >= progress.lockedUntil) {
      // Le blocage est terminé, on reset
      this.resetProgress(mysteryId);
      return false;
    }

    return true;
  }

  static getLockEndTime(mysteryId: string): number | null {
    const progress = this.getProgress(mysteryId);
    return progress.lockedUntil;
  }

  static resetProgress(mysteryId: string): void {
    this.saveProgress(mysteryId, this.getDefaultProgress());
  }

  static updateQuestionProgress(mysteryId: string, currentQuestion: number, completedQuestions: number[]): void {
    this.saveProgress(mysteryId, {
      currentQuestion,
      completedQuestions
    });
  }

  private static getDefaultProgress(): MysteryProgress {
    return {
      errors: 0,
      lockedUntil: null,
      currentQuestion: 0,
      completedQuestions: [],
      lastAccessed: Date.now()
    };
  }

  static getAllProgress(): Record<string, MysteryProgress> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error reading all progress:', error);
      return {};
    }
  }

  static clearAllProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const MYSTERY_MODES = {
  LOCKED: 'locked',
  RITUAL: 'ritual',
  MEMORY: 'memory'
} as const;

export type MysteryMode = typeof MYSTERY_MODES[keyof typeof MYSTERY_MODES];

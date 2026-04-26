"use client";

import { create } from "zustand";
import type { Profil } from "@/data/series";

/**
 * src/store/wallet.ts
 * Store Zustand pour la gestion du portefeuille Noix Bénies.
 * effectivePrice calcule le prix dynamique d'un profil selon son activité.
 *
 * Note : Cette implémentation est un stub extensible.
 * La logique de getSparkline utilise valeur_noix_benies (DB snake_case).
 */

type SnapHistory = {
  profilId: string;
  valeur: number;
  timestamp: number;
};

type WalletState = {
  solde: number;
  history: SnapHistory[];
  /** Enregistre un snapshot de valeur pour un profil */
  addSnap: (profilId: string, valeur: number) => void;
  /**
   * Calcule le prix effectif dynamique d'un profil.
   * Si pas d'historique : retourne valeur_noix_benies du profil.
   * Sinon : retourne la dernière valeur connue.
   */
  effectivePrice: (profilId: string) => number;
  /**
   * Retourne une courbe sparkline pour un profil.
   * Utilise valeur_noix_benies comme point de départ si peu de données.
   */
  getSparkline: (profilId: string, profil?: Profil) => number[];
  /** Simule un investissement */
  investir: (profilId: string, montant: number) => { ok: boolean; error?: string };
};

export const useWallet = create<WalletState>((set, get) => ({
  solde: 1000,
  history: [],

  addSnap: (profilId, valeur) => {
    set((state) => ({
      history: [
        ...state.history,
        { profilId, valeur, timestamp: Date.now() },
      ],
    }));
  },

  investir: (profilId, montant) => {
    const solde = get().solde;
    if (montant <= 0) return { ok: false, error: "Montant invalide" };
    if (montant > solde) return { ok: false, error: "Solde insuffisant" };
    set({ solde: solde - montant });
    return { ok: true };
  },

  effectivePrice: (profilId) => {
    const snaps = get().history.filter((h) => h.profilId === profilId);
    if (snaps.length === 0) return 0; // Sera surchargé avec la valeur du profil
    return snaps[snaps.length - 1].valeur;
  },

  getSparkline: (profilId, profil) => {
    const snaps = get()
      .history.filter((h) => h.profilId === profilId)
      .map((s) => s.valeur);

    if (snaps.length >= 2) return snaps;

    // Pas assez d'historique → génère une courbe simulée depuis valeur_noix_benies
    if (!profil) return [];
    const start = profil.valeur_noix_benies; // snake_case correct
    const end = get().effectivePrice(profilId) || start;
    const steps = 6;
    return Array.from({ length: steps }, (_, i) => {
      const t = i / (steps - 1);
      const noise = (Math.random() - 0.5) * start * 0.1;
      return Math.max(0, start + (end - start) * t + noise);
    });
  },
}));

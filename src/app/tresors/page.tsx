"use client";

import { useState, useEffect, useCallback } from "react";
import TreasureSwiper from "@/components/TreasureSwiper";
import { TreasuresService } from "@/lib/treasures-service";
import type { Mystere } from "@/types/treasures";

// Configuration
const MYSTERIES_PER_PAGE = 20;

export default function TreasuresPage() {
  const [mysteres, setMysteres] = useState<Mystere[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // Charger les données initiales
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await TreasuresService.getMysteres(page, MYSTERIES_PER_PAGE);

      if (fetchError) throw fetchError;

      if (page === 0) {
        setMysteres(data || []);
      } else {
        setMysteres(prev => [...prev, ...(data || [])]);
      }

    } catch (error) {
      console.error('Error loading treasures data:', error);
      setError(error instanceof Error ? error.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Effet pour charger les données au montage
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Gérer le chargement infini
  const handleScrollEnd = useCallback(() => {
    if (!loading) {
      setPage(prev => prev + 1);
    }
  }, [loading]);

  if (loading && mysteres.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-900">Chargement des Trésors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-2xl shadow-xl">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <TreasureSwiper
      mysteres={mysteres}
      loading={loading}
      onScrollEnd={handleScrollEnd}
    />
  );
}

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Profil, ProfilAvecSerie, Serie, Episode } from "@/data/series";

/**
 * useHistoires
 * Fetch profiles_histoires avec jointure sur series_histoires.
 * Mappe les données brutes Supabase vers les types TypeScript snake_case.
 */
export function useHistoires() {
  const [profils, setProfils] = useState<ProfilAvecSerie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoires = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles_histoires")
        .select("*")
        .order("numero_profil", { ascending: true });

      if (profilesError) throw profilesError;

      // 2. Fetch series/episodes metadata
      const { data: seriesHistoiresData, error: sError } = await supabase
        .from("series_histoires")
        .select("*");

      if (sError) throw sError;

      const getPosterUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        const cleanUrl = url.replace(/^\/+/, '');
        return `https://wtjhkqkqmexddroqwawk.supabase.co/storage/v1/object/public/affiches_histoires/${cleanUrl}`;
      };

      // 3. Map manually
      const enriched: ProfilAvecSerie[] = (profilesData ?? []).map((row: any) => {
        const rawVideos = row.video_urls ?? [];
        const video_urls: Episode[] = Array.isArray(rawVideos)
          ? rawVideos.map((v: any) => ({
              id: v.id ?? "",
              titre: v.titre ?? "",
              video_url: v.video_url ?? v.url ?? "",
            }))
          : [];

        // Liaison directe Profils ↔ Séries (via integer ID)
        const serieRow = seriesHistoiresData?.find((s: any) => s.id === row.series_id);
        
        let serie: Serie | null = null;
        if (serieRow) {
          serie = {
            id: String(serieRow.id),
            titre: serieRow.titre ?? "",
            synopsis: serieRow.synopsis ?? "",
            affiche_url: getPosterUrl(serieRow.affiche_url),
            episode_titre: serieRow.episode_titre ?? null,
            episode_question: serieRow.episode_question ?? null,
            episode_numero: serieRow.episode_numero ?? null
          };
        }

        return {
          id: row.id,
          series_id: row.series_id,
          nom_complet: row.nom_complet ?? "",
          age: row.age ?? null,
          profession: row.profession ?? null,
          bio_courte: row.bio_courte ?? null,
          photo_url: row.photo_url ?? null,
          valeur_noix_benies: row.valeur_noix_benies ?? 0,
          video_urls,
          total_investisseurs: row.total_investisseurs ?? 0,
          numero_profil: row.numero_profil ?? null,
          serie,
        };
      });

      // Fisher-Yates shuffle
      for (let i = enriched.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [enriched[i], enriched[j]] = [enriched[j], enriched[i]];
      }

      setProfils(enriched);
    } catch (err: any) {
      console.error("❌ useHistoires error:", err);
      setError(err?.message ?? "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistoires();
  }, [fetchHistoires]);

  return { profils, loading, error, refetch: fetchHistoires };
}

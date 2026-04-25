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

      const { data, error: supabaseError } = await supabase
        .from("profiles_histoires")
        .select(
          `
          id,
          series_id,
          nom_complet,
          age,
          profession,
          bio_courte,
          photo_url,
          valeur_noix_benies,
          video_urls,
          total_investisseurs,
          numero_profil,
          series_histoires (
            id,
            titre,
            synopsis,
            affiche_url,
            episode_numero,
            episode_titre,
            episode_question,
            created_at
          )
        `
        )
        .order("numero_profil", { ascending: true });

      if (supabaseError) throw supabaseError;

      // Mapper les données brutes → types stricts
      const enriched: ProfilAvecSerie[] = (data ?? []).map((row: any) => {
        // video_urls est stocké en JSONB → peut être null ou tableau
        const rawVideos = row.video_urls ?? [];
        const video_urls: Episode[] = Array.isArray(rawVideos)
          ? rawVideos.map((v: any) => ({
              id: v.id ?? "",
              titre: v.titre ?? "",
              video_url: v.video_url ?? v.url ?? "",
            }))
          : [];

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
          serie: row.series_histoires
            ? (row.series_histoires as Serie)
            : null,
        };
      });

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

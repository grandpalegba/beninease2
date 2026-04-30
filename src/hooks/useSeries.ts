import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Serie } from "@/data/series";

export function useSeries() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSeries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("series_histoires")
        .select("*");

      if (fetchError) throw fetchError;

      setSeries(data ?? []);
    } catch (err: any) {
      console.error("❌ useSeries error:", err);
      setError(err?.message ?? "Erreur de chargement des séries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeries();
  }, [fetchSeries]);

  return { series, loading, error, refetch: fetchSeries };
}

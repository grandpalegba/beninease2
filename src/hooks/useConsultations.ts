import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapConsultationRow } from "@/integrations/supabase/mappers";
import type { Consultation } from "@/data/consultations";

export function useConsultations() {
  return useQuery<Consultation[]>({
    queryKey: ["consultations"],
    staleTime: 60_000,
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("consultations_with_scores")
        .select("*");

      if (error) throw error;
      if (!rows) return [];

      const profileIds = Array.from(new Set(rows.map((r) => r.profile_id)));
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, first_name, age, archetype, photo_index")
        .in("id", profileIds);

      if (pErr) throw pErr;

      const byId = new Map((profiles ?? []).map((p) => [p.id, p]));

      return rows
        .map((row) => {
          const profile = byId.get(row.profile_id);
          if (!profile) return null;
          return mapConsultationRow(row, profile);
        })
        .filter((c): c is Consultation => c !== null);
    },
  });
}

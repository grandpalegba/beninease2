import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EvaluationInput {
  consultationId: string;
  relevance: number;
  clarity: number;
  depth: number;
}

export function useSubmitEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EvaluationInput) => {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      if (!user) throw new Error("Vous devez être connecté pour évaluer.");

      const { error } = await supabase
        .from("evaluations")
        .upsert({
            consultation_id: input.consultationId,
            user_id: user.id,
            relevance: input.relevance,
            clarity: input.clarity,
            depth: input.depth,
          }, { onConflict: "consultation_id,user_id" });

      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["consultations"] });
    },
  });
}

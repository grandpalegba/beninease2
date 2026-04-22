import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CreateConsultationInput {
  rowIndex: number;
  colIndex: number;
  signXIndex: number;
  signYIndex: number;
  dynamicWord: string;
  lifeCaseId: string;
  selectedOption: number;
  reflection: string;
  profileId: string;
  isAnonymous: boolean;
  audioBlob?: Blob;
}

export function useCreateConsultation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateConsultationInput) => {
      const { data: { user }, error: authErr } = await supabase.auth.getUser();
      if (authErr) throw authErr;
      if (!user) throw new Error("Connexion requise pour transmettre une sagesse.");

      let audioUrl: string | null = null;
      if (input.audioBlob) {
        const path = `${user.id}/${Date.now()}.webm`;
        const { error: upErr } = await supabase.storage
          .from("bokonon-audio")
          .upload(path, input.audioBlob, {
            contentType: input.audioBlob.type || "audio/webm",
            upsert: false,
          });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("bokonon-audio").getPublicUrl(path);
        audioUrl = pub.publicUrl;
      }

      const { data, error } = await supabase
        .from("consultations")
        .upsert({
            row_index: input.rowIndex,
            col_index: input.colIndex,
            sign_x_index: input.signXIndex,
            sign_y_index: input.signYIndex,
            dynamic_word: input.dynamicWord,
            life_case_id: input.lifeCaseId,
            selected_option: input.selectedOption,
            reflection: input.reflection,
            profile_id: input.profileId,
            is_anonymous: input.isAnonymous,
            audio_url: audioUrl,
            user_id: user.id,
            video_seed: Math.floor(Math.random() * 100000),
            video_offset: Math.random() * 5,
          }, { onConflict: "row_index,col_index" })
        .select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["consultations"] });
    },
  });
}

import { createSupabaseBrowserClient } from "./client";
import type { SupabaseClient } from "@supabase/supabase-js";

export const getUserVotes = async (supabase: SupabaseClient, voterId: string) => {
  return await supabase
    .from('votes')
    .select(`
      *,
      ambassadeurs:ambassadeurs(*)
    `)
    .eq('voter_id', voterId) // Changed from votant_id to voter_id
    .order('created_at', { ascending: false });
};

export async function updateVideoId(ambassadeurId: string, slotIndex: 1 | 2 | 3 | 4, videoId: string | null) {
  const supabase = createSupabaseBrowserClient();
  const column = `video_${slotIndex}_id`;
  
  const { data, error } = await supabase
    .from("ambassadeurs")
    .update({ [column]: videoId })
    .eq("id", ambassadeurId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function reportContent(contentId: string, reason: string, reporterId?: string) {
  const supabase = createSupabaseBrowserClient();
  
  const { data, error } = await supabase
    .from("reports")
    .insert({
      content_id: contentId,
      reason,
      reporter_id: reporterId,
      status: "pending"
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAmbassadeurByRole(role: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("ambassadeurs")
    .select("*")
    .eq("role", role)
    .eq("is_validated", true);

  if (error) throw error;
  return data;
}

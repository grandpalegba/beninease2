import { createSupabaseBrowserClient } from "./client";
import type { SupabaseClient } from "@supabase/supabase-js";

export const getUserVotes = async (supabase: SupabaseClient, votantId: string) => {
  return await supabase
    .from('votes')
    .select(`
      *,
      talents:talents(*)
    `)
    .eq('votant_id', votantId)
    .order('vote_date', { ascending: false });
};

export async function updateVideoId(talentId: string, slotIndex: 1 | 2 | 3 | 4, videoId: string | null) {
  const supabase = createSupabaseBrowserClient();
  const column = `video_${slotIndex}_id`;
  
  const { data, error } = await supabase
    .from("talents")
    .update({ [column]: videoId })
    .eq("id", talentId)
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

export async function getTalentByRole(role: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("Talents")
    .select("*")
    .eq("role", role)
    .eq("is_validated", true);

  if (error) throw error;
  return data;
}

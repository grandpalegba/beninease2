import { createSupabaseBrowserClient } from "./client";

export const getUserVotes = async (supabase: any, votantId: string) => {
  return await supabase
    .from('Votes')
    .select(`
      *,
      talents:Talents(*)
    `)
    .eq('votant_id', votantId)
    .order('vote_date', { ascending: false });
};

export async function updateVideoId(userId: string, slotIndex: 1 | 2 | 3 | 4, videoId: string | null) {
  const supabase = createSupabaseBrowserClient();
  const column = `video_${slotIndex}_id`;
  
  const { data, error } = await supabase
    .from("profiles")
    .update({ [column]: videoId })
    .eq("id", userId)
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

export async function getProfileByRole(role: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", role)
    .eq("is_validated", true);

  if (error) throw error;
  return data;
}

import { createSupabaseBrowserClient } from "./client";

export async function getVotesByUserId(voterId: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("votes")
    .select(`
      id,
      created_at,
      candidate_id,
      profiles:candidate_id (
        id,
        slug,
        prenom,
        nom,
        category,
        avatar_url
      )
    `)
    .eq("voter_id", voterId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

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

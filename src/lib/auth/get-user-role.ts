import type { PublicUserRow } from "@/lib/auth/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server-only helper for Server Components / Route Handlers.
 * Returns the authenticated user's row in `public.users`, or null if not signed in / row missing.
 */
export async function getUserRole(): Promise<PublicUserRow | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("users")
    .select("id, role, is_approved")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) return null;

  return data as PublicUserRow;
}

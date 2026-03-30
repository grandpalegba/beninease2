import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🚨 [ERREUR CRITIQUE] Les variables d'environnement Supabase sont MANQUANTES côté client !");
  }

  try {
    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return supabase;
  } catch (error) {
    console.error("🚨 [ERREUR CRITIQUE] Impossible d'initialiser le client Supabase :", error);
    throw error;
  }
}

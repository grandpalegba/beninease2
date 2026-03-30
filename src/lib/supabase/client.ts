import { createBrowserClient } from "@supabase/ssr";

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  // Logs de débogage pour vérifier la présence des variables (sans exposer la clé entière)
  console.log("🔍 [DEBUG SUPABASE] URL définie :", !!supabaseUrl, supabaseUrl ? `(${supabaseUrl.substring(0, 12)}...)` : "VIDE");
  console.log("🔍 [DEBUG SUPABASE] Clé Anon définie :", !!supabaseAnonKey);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🚨 [ERREUR CRITIQUE] Les variables d'environnement Supabase sont MANQUANTES côté client !");
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("🚨 [ERREUR CRITIQUE] Impossible d'initialiser le client Supabase :", error);
    throw error;
  }
}
// trigger git
// trigger git

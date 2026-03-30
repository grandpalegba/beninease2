import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("🚨 [ERREUR CRITIQUE CLIENT] Variables d'environnement Supabase manquantes !");
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  )
}

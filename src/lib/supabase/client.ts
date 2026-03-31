import { createBrowserClient } from '@supabase/ssr'

console.log("SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("SUPABASE_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

// Vérification critique des variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error("CRITICAL: Supabase environment variables are missing!");
  throw new Error("Supabase configuration is incomplete. Please check .env.local file.");
}

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

export function createSupabaseBrowserClient() {
  return supabase
}

import { createBrowserClient } from '@supabase/ssr'

export function createSupabaseBrowserClient() {
  console.log("SUPABASE URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log("SUPABASE KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  
  return createBrowserClient(
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
}

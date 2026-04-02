import { createBrowserClient } from '@supabase/ssr'

// Singleton global - ne recrée jamais le client
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export const supabase = supabaseInstance || (supabaseInstance = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
))

// Log d'erreur global pour le debug
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 Auth state change:', event, session ? '✅ Session active' : '❌ No session');
  
  // Gérer les erreurs de session silencieusement
  if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
    console.log('🔄 Session updated:', event);
  }
})

// Export d'une fonction utilitaire pour vérifier la session
export async function checkSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (err) {
    console.error('💥 Session check error:', err);
    return { session: null, error: err };
  }
}

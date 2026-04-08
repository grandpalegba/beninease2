import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Singleton global - initialisé seulement si les variables sont présentes
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Export d'une instance qui peut être null au build mais sera là au runtime
export const supabase = supabaseInstance as NonNullable<typeof supabaseInstance>;

// Log d'erreur global pour le debug (uniquement si l'instance existe)
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Auth state change:', event, session ? '✅ Session active' : '❌ No session');
    
    if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
      console.log('🔄 Session updated:', event);
    }
  });
}

// Export d'une fonction utilitaire pour vérifier la session
export async function checkSession() {
  if (!supabase) return { session: null, error: new Error('Supabase not initialized') };
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  } catch (err) {
    console.error('💥 Session check error:', err);
    return { session: null, error: err };
  }
}

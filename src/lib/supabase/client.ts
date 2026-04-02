// Réexport du singleton principal pour compatibilité
export { supabase } from '@/utils/supabase/client'

// Fonction de compatibilité pour les imports existants
export function createSupabaseBrowserClient() {
  return supabase
}

import { supabase as utilsSupabase } from "@/utils/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// On réexporte le singleton de SSR pour éviter l'erreur "Multiple GoTrueClient"
// tout en gardant le type Database disponible si besoin.
export const supabase = utilsSupabase as any;

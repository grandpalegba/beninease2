import { createClient } from "@supabase/supabase-js";
import RefletsClient from "@/components/reflets/RefletsClient";

// On utilise un composant Serveur pour essayer de fetch initialement si on peut.
// Mais comme on doit utiliser supabase généré côté client/serveur, on utilise @/utils/supabase/server si dispo.
// A défaut de certitudes sur le server client, je passe en page purement "Client" pour être sûr.

export default function RefletsPage() {
  return <RefletsClient />;
}

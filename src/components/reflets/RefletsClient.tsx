"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase/client"; // Assurez-vous du bon chemin
import SwipeContainer from "./SwipeContainer";
import { Loader2 } from "lucide-react"; // Importez de lucide-react si utilisé, sinon un svg simple

export default function RefletsClient() {
  const [duels, setDuels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        // Fallback anonyme dans sessionStorage pour l'expérience et le dev
        let anonId = sessionStorage.getItem("anon_user_id");
        if (!anonId) {
          const generateId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : "anon-" + Math.random().toString(36).substr(2, 9);
          anonId = generateId();
          sessionStorage.setItem("anon_user_id", anonId);
        }
        setUserId(anonId);
      }
    }
    loadUser();
  }, []);

  useEffect(() => {
    async function fetchDuels() {
      try {
        // Le prompt mentionne: Use the existing Supabase function generate_duels()
        const { data, error } = await supabase.rpc("generate_duels");
        
        if (error) {
          console.error("Erreur RPC generate_duels:", error);
          // Fallback si la rpc ne renvoie rien ou échoue : tenter le .from("duels")
          const { data: fallbackData, error: fallbackError } = await supabase
            .from("duels")
            .select(`
              id,
              category,
              left:ambassadeur_left(*),
              right:ambassadeur_right(*)
            `);
          if (fallbackData) {
            setDuels(fallbackData);
          } else {
            console.error("Erreur from duels:", fallbackError);
          }
        } else if (data) {
          setDuels(data);
        }
      } catch (err) {
        console.error("Error fetching duels:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDuels();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006b3f]"></div>
      </div>
    );
  }

  if (!duels || duels.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white font-inter">
        <p>Aucun duel disponible.</p>
      </div>
    );
  }

  return (
    <div className="bg-black w-full h-screen overflow-hidden text-white font-inter selection:bg-[#006b3f] selection:text-white">
      <SwipeContainer duels={duels} userId={userId} />
    </div>
  );
}

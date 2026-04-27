"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/utils/supabase/client";
import { Loader2, AlertCircle } from "lucide-react";
import CardDeck from "@/components/ui/CardDeck";
import { TresorCard } from "@/components/tresors/TresorCard";

interface Tresor {
  id: string;
  nom: string;
  sous_titre: string;
  image_url: string;
  localisation?: string;
  created_at: string;
}

export default function TresorsPage() {
  const [tresors, setTresors] = useState<Tresor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTresors() {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase
          .from("tresors_benin")
          .select("*")
          .order("nom", { ascending: true });

        if (supabaseError) throw supabaseError;
        setTresors(data || []);
      } catch (err: any) {
        console.error("Error fetching tresors:", err);
        setError(err.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    }

    fetchTresors();
  }, []);

  const shuffledTresors = useMemo(() => {
    if (!tresors) return [];
    return [...tresors].sort(() => Math.random() - 0.5);
  }, [tresors]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#008751] mb-4" />
        <p className="text-gray-400 uppercase tracking-widest text-[10px] font-sans font-black">Chargement des Trésors...</p>
      </div>
    );
  }

  if (error || shuffledTresors.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white font-sans text-center">
        <AlertCircle className="w-12 h-12 text-red-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">
          {error ? "Une erreur est survenue" : "Collection vide"}
        </h2>
        <button 
          onClick={() => window.location.reload()} 
          className="text-[#008751] font-bold hover:underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden pt-12">
      {/* BACKGROUND DECOR */}
      <div className="fixed inset-0 pattern-bg -z-10 opacity-[0.03]"></div>

      <div className="flex-1 overflow-hidden">
        <CardDeck
          items={shuffledTresors}
          className="bg-white h-full"
          renderItem={(tresor) => (
            <TresorCard tresor={tresor} />
          )}
        />
      </div>
    </div>
  );
}

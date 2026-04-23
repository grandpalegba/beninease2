"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import type { Ambassadeur } from "@/types";
import { Loader2, AlertCircle } from "lucide-react";
import CardDeck from "@/components/ui/CardDeck";
import StitchReferentCard from "@/components/referent/StitchReferentCard";
import Link from "next/link";
import { toast } from "sonner";

export default function BatisseursPage() {
  const [ambassadeurs, setAmbassadeurs] = useState<Ambassadeur[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [voterWeight, setVoterWeight] = useState<number>(1);
  const [userId, setUserId] = useState<string | null>(null);

  const loadAmbassadeurs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("ambassadeurs")
        .select("*")
        .order("weighted_votes_total", { ascending: false });

      if (error) throw error;
      setAmbassadeurs(data || []);
    } catch (err) {
      console.error("Error loading ambassadeurs:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAmbassadeurs();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);

        supabase
          .from("profiles")
          .select("voter_weight")
          .eq("id", data.user.id)
          .single()
          .then(({ data: profileData }) => {
            if (profileData) setVoterWeight(profileData.voter_weight);
          });
      }
    });
  }, [loadAmbassadeurs]);

  const handleVote = async (ambassadeur: Ambassadeur) => {
    if (!userId) {
      toast.error("Veuillez vous connecter pour voter");
      return;
    }

    try {
      const { error } = await supabase.rpc("cast_weighted_vote", {
        target_ambassadeur_id: ambassadeur.id,
      });

      if (error) throw error;

      toast.success(`Vote enregistré ! Impact : +${voterWeight}`);

      setAmbassadeurs((prev) =>
        prev.map((a) =>
          a.id === ambassadeur.id
            ? {
              ...a,
              weighted_votes_total:
                (a.weighted_votes_total || 0) + voterWeight,
            }
            : a
        )
      );
    } catch (err) {
      console.error("Error casting vote:", err);
      toast.error("Erreur lors du vote");
    }
  };

  if (loading)
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-[#F4F4F2]">
        <Loader2 className="w-10 h-10 animate-spin text-[#008751] mb-4" />
        <p className="text-gray-500 uppercase tracking-widest text-xs">
          Chargement des Bâtisseurs...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Oups !</h2>
          <p className="text-gray-600 mb-6">
            Impossible de charger les Bâtisseurs.
          </p>
          <button
            onClick={loadAmbassadeurs}
            className="text-[#008751] font-bold hover:underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );

  return (
    <div className="h-screen w-full bg-[#F4F4F2] overflow-hidden">
      <CardDeck
        items={ambassadeurs}
        renderItem={(ambassadeur) => (
          <StitchReferentCard 
            key={ambassadeur.id} 
            ambassadeur={ambassadeur} 
          />
        )}
      />
    </div>
  );
}